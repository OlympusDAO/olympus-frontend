// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {IERC20Metadata as ERC20} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {SafeERC20 as SafeTransferLib} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC4626 as ERC4626} from "@openzeppelin/contracts/interfaces/IERC4626.sol";

import { OrigamiMath } from "contracts/libraries/OrigamiMath.sol";

import {Kernel, Policy, Keycode, Permissions, toKeycode} from "../Kernel.sol";
import {TRSRYv1} from "../modules/TRSRY/TRSRY.v1.sol";
import {MINTRv1} from "../modules/MINTR/MINTR.v1.sol";
import {ROLESv1, RolesConsumer} from "../modules/ROLES/OlympusRoles.sol";
import {DLGTEv1} from "../modules/DLGTE/DLGTE.v1.sol";

import {IMonoCooler} from "./interfaces/IMonoCooler.sol";
import {SafeCast} from "contracts/libraries/SafeCast.sol";
import {CompoundedInterest} from "contracts/libraries/CompoundedInterest.sol";

interface IStaking {
    function unstake(address, uint256, bool _trigger, bool) external returns (uint256);
}

library FixedPointMathLib {
    function mulWadDown(uint256 x, uint256 y) internal pure returns (uint256) {
        return OrigamiMath.mulDiv(x, y, 1e18, OrigamiMath.Rounding.ROUND_DOWN);
    }

    function divWadUp(uint256 x, uint256 y) internal pure returns (uint256) {
        return OrigamiMath.mulDiv(x, 1e18, y, OrigamiMath.Rounding.ROUND_UP);
    }

    function mulDivDown(
        uint256 x,
        uint256 y,
        uint256 denominator
    ) internal pure returns (uint256 z) {
        return OrigamiMath.mulDiv(x, y, denominator, OrigamiMath.Rounding.ROUND_DOWN);
    }

    function mulDivUp(
        uint256 x,
        uint256 y,
        uint256 denominator
    ) internal pure returns (uint256 z) {
        return OrigamiMath.mulDiv(x, y, denominator, OrigamiMath.Rounding.ROUND_UP);
    }
}

/*
@todo considerations:

- Olympus modules/policies/permissions need reviewing closely as i'm not too familiar with best practice, just blindly pasta'd
- Interest accrual is based on a global 'accumulator', and then each account has their own accumulator which is checkpoint whenever they do an action.
  Used in Temple Line of Credit, and was based on other mono-contract money markets.
- Uses a 'memory' cache to pre-load this info so we're not reading from 'storage' variables all the time (gas saving)
- Did a little gas golfing to pack storage variables - slight tradeoff for readability (eg safely encode uint256 => uint128). But worth it imo.
- Funding of DAI/USDS debt is done 'just in time'. Will need an opinion on whether this is OK or if too gassy and we need to have a debt buffer or use 
  the same Clearinghouse max weekly funding model.

- Discussed adding a circuit breaker (like Temple's TLC) - sounds like we should?
 */

contract MonoCooler is IMonoCooler, Policy, RolesConsumer {
    using FixedPointMathLib for uint256;
    using SafeCast for uint256;
    using CompoundedInterest for uint256;
    using SafeTransferLib for ERC20;
    using SafeTransferLib for ERC4626;

    //============================================================================================//
    //                                         IMMUTABLES                                         //
    //============================================================================================//

    /// @notice The collateral token supplied by users/accounts, eg gOHM
    ERC20 public immutable override collateralToken;

    /// @notice The debt token which can be borrowed, eg DAI or USDS
    ERC20 public immutable override debtToken;

    /// @notice Unwrapped gOHM
    ERC20 public immutable ohm;

    // Necessary to unstake (and burn) OHM from liquidations
    IStaking public immutable staking;

    /// @notice The ERC2626 reserve asset which is pulled from treasury, eg sDAI
    /// @dev The asset of this vault must be `debtToken`
    ERC4626 public immutable debtSavingsVault;

    /**
     * @notice The minimum debt a user needs to maintain
     * @dev It costs gas to liquidate users, so we don't want dust amounts.
     */
    uint256 public immutable override minDebtRequired;

    //============================================================================================//
    //                                          MODULES                                           //
    //============================================================================================//

    MINTRv1 public MINTR; // Olympus V3 Minter Module
    TRSRYv1 public TRSRY; // Olympus V3 Treasury Module
    DLGTEv1 public DLGTE; // Olympus V3 Delegation Module

    //-- begin slot 6

    /// @notice The total amount of collateral posted across all accounts.
    uint128 public override totalCollateral;

    /// @notice The total amount of debt which has been borrowed across all users
    /// as of the latest checkpoint
    uint128 public override totalDebt;

    //--- begin slot 7
    /// @notice Liquidations may be paused in order for users to recover/repay debt after
    /// emergency actions or interest rate changes
    bool public override liquidationsPaused;

    /// @notice Borrows may be paused for emergency actions or deprecating the facility
    bool public override borrowsPaused;

    /// @notice The flat interest rate, defined in basis points.
    /// @dev Interest (approximately) continuously compounds at this rate.
    uint16 public override interestRateBps;

    /// @notice The Loan To Value point at which an account can be liquidated
    /// @dev Defined in terms of [debtToken/collateralToken] -- eg [USDS/gOHM]
    uint96 public override liquidationLtv;

    /// @notice The maximum Loan To Value an account is allowed when borrowing or withdrawing collateral
    /// @dev Defined in terms of [debtToken/collateralToken] -- eg [USDS/gOHM]
    uint96 public override maxOriginationLtv;

    /// @notice The last time the global debt accumulator was updated
    uint32 public override interestAccumulatorUpdatedAt;

    //--- begin slot 8

    /// @notice The accumulator index used to track the compounding of debt, starting at 1e27 at genesis
    /// @dev To RAY (1e27) precision
    uint256 public override interestAccumulatorRay;

    //-- begin slot 9
    /// @dev A per account store, tracking collateral/debt as of their latest checkpoint.
    mapping(address /* account */ => AccountState) private allAccountState;

    //============================================================================================//
    //                                         CONSTANTS                                          //
    //============================================================================================//

    bytes32 public constant COOLER_OVERSEER_ROLE = bytes32("cooler_overseer");

    /// @notice Extra precision scalar
    uint256 private constant RAY = 1e27;

    uint96 private constant ONE_YEAR = 365 days;

    //============================================================================================//
    //                                      INITIALIZATION                                        //
    //============================================================================================//

    constructor(
        address ohm_,
        address gohm_,
        address staking_,
        address debtSavingsVault_,
        address kernel_,
        uint96 liquidationLtv_,
        uint96 maxOriginationLtv_,
        uint16 interestRateBps_,
        uint256 minDebtRequired_
    ) Policy(Kernel(kernel_)) {
        ohm = ERC20(ohm_);
        collateralToken = ERC20(gohm_);
        staking = IStaking(staking_);
        debtSavingsVault = ERC4626(debtSavingsVault_);
        debtToken = ERC20(debtSavingsVault.asset());
        minDebtRequired = minDebtRequired_;

        // This contract only handles 18dp
        if (collateralToken.decimals() != 18) revert InvalidParam();
        if (debtToken.decimals() != 18) revert InvalidParam();

        liquidationLtv = liquidationLtv_;
        maxOriginationLtv = maxOriginationLtv_;
        interestRateBps = interestRateBps_;

        interestAccumulatorUpdatedAt = uint32(block.timestamp);
        interestAccumulatorRay = RAY;
    }

    /// @inheritdoc Policy
    function configureDependencies() external override returns (Keycode[] memory dependencies) {
        dependencies = new Keycode[](4);
        dependencies[0] = toKeycode("MINTR");
        dependencies[1] = toKeycode("ROLES");
        dependencies[2] = toKeycode("TRSRY");
        dependencies[3] = toKeycode("DLGTE");

        MINTR = MINTRv1(getModuleAddress(toKeycode("MINTR")));
        ROLES = ROLESv1(getModuleAddress(toKeycode("ROLES")));
        TRSRY = TRSRYv1(getModuleAddress(toKeycode("TRSRY")));
        DLGTE = DLGTEv1(getModuleAddress(toKeycode("DLGTE")));

        (uint8 MINTR_MAJOR, ) = MINTR.VERSION();
        (uint8 ROLES_MAJOR, ) = ROLES.VERSION();
        (uint8 TRSRY_MAJOR, ) = TRSRY.VERSION();
        (uint8 DLGTE_MAJOR, ) = DLGTE.VERSION();

        // Ensure Modules are using the expected major version.
        // Modules should be sorted in alphabetical order.
        bytes memory expected = abi.encode([1, 1, 1, 1]);
        if (
            MINTR_MAJOR != 1 ||
            ROLES_MAJOR != 1 ||
            TRSRY_MAJOR != 1 ||
            DLGTE_MAJOR != 1
        ) revert Policy_WrongModuleVersion(expected);

        // Approve MINTR for burning OHM (called here so that it is re-approved on updates)
        ohm.approve(address(MINTR), type(uint256).max);

        // Approve DLGTE to pull gOHM for delegation
        collateralToken.approve(address(DLGTE), type(uint256).max);
    }

    /// @inheritdoc Policy
    function requestPermissions() external view override returns (Permissions[] memory requests) {
        Keycode MINTR_KEYCODE = toKeycode("MINTR");
        Keycode TRSRY_KEYCODE = toKeycode("TRSRY");
        Keycode DLGTE_KEYCODE = toKeycode("DLGTE");

        requests = new Permissions[](8);
        requests[0] = Permissions(MINTR_KEYCODE, MINTR.burnOhm.selector);
        requests[1] = Permissions(TRSRY_KEYCODE, TRSRY.setDebt.selector);
        requests[2] = Permissions(TRSRY_KEYCODE, TRSRY.increaseWithdrawApproval.selector);
        requests[3] = Permissions(TRSRY_KEYCODE, TRSRY.withdrawReserves.selector);
        requests[4] = Permissions(DLGTE_KEYCODE, DLGTE.depositUndelegatedGohm.selector);
        requests[5] = Permissions(DLGTE_KEYCODE, DLGTE.withdrawUndelegatedGohm.selector);
        requests[6] = Permissions(DLGTE_KEYCODE, DLGTE.applyDelegations.selector);
        requests[7] = Permissions(DLGTE_KEYCODE, DLGTE.setMaxDelegateAddresses.selector);
    }

    //============================================================================================//
    //                                        COLLATERAL                                          //
    //============================================================================================//

    /// @inheritdoc IMonoCooler
    function addCollateral(
        uint128 collateralAmount,
        address onBehalfOf,
        DLGTEv1.DelegationRequest[] calldata delegationRequests
    ) external override {
        // Add collateral on behalf of another account
        AccountState storage aState = allAccountState[onBehalfOf];
        _addCollateral(
            aState,
            aState,
            collateralAmount,
            msg.sender,
            onBehalfOf,
            delegationRequests
        );
    }

    /// @inheritdoc IMonoCooler
    function withdrawCollateral(
        uint128 collateralAmount,
        address recipient,
        DLGTEv1.DelegationRequest[] calldata delegationRequests
    ) external override returns (uint128 collateralWithdrawn) {
        AccountState storage aState = allAccountState[msg.sender];
        collateralWithdrawn = _withdrawCollateral(
            aState,
            aState,
            _globalStateRO(), // No need to sync global debt state when withdrawing collateral
            collateralAmount,
            msg.sender,
            recipient,
            delegationRequests
        );
    }

    //============================================================================================//
    //                                       BORROW/REPAY                                         //
    //============================================================================================//

    /// @inheritdoc IMonoCooler
    function borrow(
        uint128 borrowAmount,
        address recipient
    ) external override returns (uint128 amountBorrowed) {
        AccountState storage aState = allAccountState[msg.sender];
        (amountBorrowed, ) = _borrow(
            aState,
            aState,
            _globalStateRW(),
            msg.sender,
            borrowAmount,
            recipient
        );
    }

    /// @inheritdoc IMonoCooler
    function repay(
        uint128 repayAmount,
        address onBehalfOf
    ) external override returns (uint128 amountRepaid) {
        AccountState storage aState = allAccountState[onBehalfOf];
        amountRepaid = _repay(
            aState,
            aState,
            _globalStateRW(),
            msg.sender,
            onBehalfOf,
            repayAmount
        );
    }

    //============================================================================================//
    //                                         COMPOSITE                                          //
    //============================================================================================//

    /// @inheritdoc IMonoCooler
    function addCollateralAndBorrow(
        uint128 collateralAmount,
        uint128 borrowAmount,
        address recipient,
        DLGTEv1.DelegationRequest[] calldata delegationRequests
    ) external override returns (uint128 amountBorrowed) {
        AccountState storage aState = allAccountState[msg.sender];
        AccountState memory aStateCache = aState;
        GlobalStateCache memory gStateCache = _globalStateRW();

        // Add collateral on behalf of msg.sender
        _addCollateral(
            aState,
            aStateCache,
            collateralAmount,
            msg.sender,
            msg.sender,
            delegationRequests
        );

        // Borrow on behalf of msg.sender
        (amountBorrowed, ) = _borrow(
            aState,
            aStateCache,
            gStateCache,
            msg.sender,
            borrowAmount,
            recipient
        );
    }

    /// @inheritdoc IMonoCooler
    function addCollateralAndBorrowOnBehalfOf(
        address onBehalfOf,
        uint128 collateralAmount,
        uint128 borrowAmount
    ) external override returns (uint128 amountBorrowed) {
        AccountState storage aState = allAccountState[onBehalfOf];
        AccountState memory aStateCache = aState;
        GlobalStateCache memory gStateCache = _globalStateRW();

        // Calculate the current LTV (to check vs afterwards), rounding debt up.
        uint256 oldLtv = _calculateCurrentLtv(
            _currentAccountDebt(
                aStateCache.debtCheckpoint, 
                aStateCache.interestAccumulatorRay, 
                gStateCache.interestAccumulatorRay, 
                true
            ),
            aStateCache.collateral
        );

        // Add collateral on behalf of another account
        // No delegations are allowed
        _addCollateral(
            aState,
            aStateCache,
            collateralAmount,
            msg.sender,
            onBehalfOf,
            new DLGTEv1.DelegationRequest[](0)
        );

        // Borrow on behalf of another account
        uint256 newLtv;
        (amountBorrowed, newLtv) = _borrow(
            aState,
            aStateCache,
            gStateCache,
            onBehalfOf,
            borrowAmount,
            onBehalfOf
        );

        // When adding & borrowing on behalf of another account
        // the new LTV must be the same or lower than the old LTV
        if (newLtv > oldLtv) revert ExceededPreviousLtv(oldLtv, newLtv);
    }

    /// @inheritdoc IMonoCooler
    function repayAndWithdrawCollateral(
        uint128 repayAmount,
        uint128 collateralAmount,
        address recipient,
        DLGTEv1.DelegationRequest[] calldata delegationRequests
    ) external override returns (uint128 amountRepaid, uint128 collateralWithdrawn) {
        AccountState storage aState = allAccountState[msg.sender];
        AccountState memory aStateCache = aState;
        GlobalStateCache memory gStateCache = _globalStateRW();

        // Repay debt on behalf of msg.sender
        amountRepaid = _repay(
            aState,
            aStateCache,
            gStateCache,
            msg.sender,
            msg.sender,
            repayAmount
        );

        // Withdraw collateral on behalf of msg.sender
        collateralWithdrawn = _withdrawCollateral(
            aState,
            aStateCache,
            gStateCache,
            collateralAmount,
            msg.sender,
            recipient,
            delegationRequests
        );
    }

    //============================================================================================//
    //                                        DELEGATION                                          //
    //============================================================================================//

    /// @inheritdoc IMonoCooler
    function applyDelegations(
        DLGTEv1.DelegationRequest[] calldata delegationRequests
    ) external override returns (uint256 /*totalDelegated*/, uint256 /*totalUndelegated*/) {
        return DLGTE.applyDelegations(msg.sender, delegationRequests);
    }

    /// @inheritdoc IMonoCooler
    function applyUnhealthyDelegations(
        address account,
        DLGTEv1.DelegationRequest[] calldata delegationRequests
    ) external override returns (uint256 totalUndelegated) {
        if (liquidationsPaused) revert Paused();
        GlobalStateCache memory gState = _globalStateRW();
        LiquidationStatus memory status = _computeLiquidity(allAccountState[account], gState);
        if (!status.exceededLiquidationLtv) revert CannotLiquidate();

        // Note: More collateral may be undelegated than required for the liquidation here.
        // But this is assumed ok - the liquidated user will need to re-apply the delegations again.
        uint256 totalDelegated;
        (totalDelegated, totalUndelegated) = DLGTE.applyDelegations(account, delegationRequests);

        // Only allowed to undelegate.
        if (totalDelegated > 0) revert InvalidDelegationRequests();
    }

    //============================================================================================//
    //                                       LIQUIDATIONS                                         //
    //============================================================================================//

    // @todo incentivise liquidations
    /*
Frontier:
> I wasn't sure how we want to incentivise liquidations. Heart based model with increasing reward doesn't work here imo since we can't easily know the start time of when it first became unhealthy.

Anon:
> First thought that comes to mind is have interest keep accruing but give the keeper the delta above liq point? kind of an already there gda mechanism

It means the liquidation won't happen until that accrued interest pays for gas++, but probably not a problem if it's a few hours/days after the fact. It’s a softer liquidation mechanism but that’s more in the nature of expiry time to debt threshold, ie you could top up or repay before liquidation bot actually liquidates
*/

    /// @inheritdoc IMonoCooler
    function batchLiquidate(
        address[] calldata accounts,
        DLGTEv1.DelegationRequest[][] calldata delegationRequests
    ) external override returns (uint128 totalCollateralClaimed, uint128 totalDebtWiped) {
        if (liquidationsPaused) revert Paused();

        LiquidationStatus memory status;
        GlobalStateCache memory gState = _globalStateRW();
        address account;
        uint256 numAccounts = accounts.length;
        for (uint256 i; i < numAccounts; ++i) {
            account = accounts[i];
            status = _computeLiquidity(allAccountState[account], gState);

            // Skip if this account is still under the maxLTV
            if (status.exceededLiquidationLtv) {
                emit Liquidated(account, status.collateral, status.currentDebt);

                // Apply any undelegation requests
                DLGTEv1.DelegationRequest[] calldata dreqs = delegationRequests[i];
                if (dreqs.length > 1) {
                    // Note: More collateral may be undelegated than required for the liquidation here.
                    // But this is assumed ok - the liquidated user will need to re-apply the delegations again.
                    (uint256 appliedDelegations, ) = DLGTE.applyDelegations(account, dreqs);

                    // For liquidations, only allow undelegation requests
                    if (appliedDelegations > 0) revert InvalidDelegationRequests();
                }

                // Withdraw the undelegated gOHM
                DLGTE.withdrawUndelegatedGohm(account, status.collateral);

                totalCollateralClaimed += status.collateral;
                totalDebtWiped += status.currentDebt;

                // Clear the account data
                delete allAccountState[account];
            }
        }

        // burn the gOHM collateral and update the total state.
        if (totalCollateralClaimed > 0) {
            // Unstake and burn gOHM holdings.
            collateralToken.safeApprove(address(staking), totalCollateralClaimed);
            MINTR.burnOhm(
                address(this),
                staking.unstake(address(this), totalCollateralClaimed, false, false)
            );

            totalCollateral -= totalCollateralClaimed;
        }

        // Remove debt from the totals
        if (totalDebtWiped > 0) {
            _reduceTotalDebt(gState, totalDebtWiped);
        }
    }

    //============================================================================================//
    //                                           ADMIN                                            //
    //============================================================================================//

    /// @inheritdoc IMonoCooler
    function setLoanToValue(
        uint96 newLiquidationLtv,
        uint96 newMaxOriginationLtv
    ) external override onlyRole(COOLER_OVERSEER_ROLE) {
        uint256 currentLiquidationLtv = liquidationLtv;
        if (newLiquidationLtv != currentLiquidationLtv) {
            // Not allowed to decrease
            if (newLiquidationLtv < currentLiquidationLtv) revert InvalidParam();
            emit LiquidationLtvSet(newLiquidationLtv);
            liquidationLtv = newLiquidationLtv;
        }

        uint256 currentMaxOriginationLtv = maxOriginationLtv;
        if (newMaxOriginationLtv != currentMaxOriginationLtv) {
            // Must be less than the liquidationLtv
            if (newMaxOriginationLtv >= newLiquidationLtv) revert InvalidParam();
            emit MaxOriginationLtvSet(newMaxOriginationLtv);
            maxOriginationLtv = newMaxOriginationLtv;
        }
    }

    /// @inheritdoc IMonoCooler
    function setLiquidationsPaused(bool isPaused) external override onlyRole(COOLER_OVERSEER_ROLE) {
        liquidationsPaused = isPaused;
        emit LiquidationsPausedSet(isPaused);
    }

    /// @inheritdoc IMonoCooler
    function setBorrowPaused(bool isPaused) external override onlyRole(COOLER_OVERSEER_ROLE) {
        emit BorrowPausedSet(isPaused);
        borrowsPaused = isPaused;
    }

    /// @inheritdoc IMonoCooler
    function setInterestRateBps(
        uint16 newInterestRateBps
    ) external override onlyRole(COOLER_OVERSEER_ROLE) {
        // Force an update of state on the old rate first.
        _globalStateRW();

        emit InterestRateSet(newInterestRateBps);
        interestRateBps = newInterestRateBps;
    }

    /// @inheritdoc IMonoCooler
    function setMaxDelegateAddresses(
        address account,
        uint32 maxDelegateAddresses
    ) external override onlyRole(COOLER_OVERSEER_ROLE) {
        DLGTE.setMaxDelegateAddresses(account, maxDelegateAddresses);
    }

    /// @inheritdoc IMonoCooler
    function checkpointDebt()
        external
        override
        returns (uint128 /*totalDebt*/, uint256 /*interestAccumulatorRay*/)
    {
        GlobalStateCache memory gState = _globalStateRW();
        return (gState.totalDebt, gState.interestAccumulatorRay);
    }

    //============================================================================================//
    //                                      VIEW FUNCTIONS                                        //
    //============================================================================================//

    /// @inheritdoc IMonoCooler
    function debtDeltaForMaxOriginationLtv(
        address account,
        int128 collateralDelta
    ) external view override returns (int128 debtDelta) {
        AccountState memory aStateCache = allAccountState[account];
        GlobalStateCache memory gStateCache = _globalStateRO();

        int128 newCollateral = collateralDelta + int128(aStateCache.collateral);
        if (newCollateral < 0) revert InvalidCollateralDelta();

        uint128 maxDebt = _maxDebt(uint128(newCollateral));
        uint128 currentDebt = _currentAccountDebt(
            aStateCache.debtCheckpoint, 
            aStateCache.interestAccumulatorRay, 
            gStateCache.interestAccumulatorRay, 
            true
        );
        debtDelta = int128(maxDebt) - int128(currentDebt);
    }

    /// @inheritdoc IMonoCooler
    function accountPosition(
        address account
    ) external view override returns (AccountPosition memory position) {
        AccountState memory aStateCache = allAccountState[account];
        GlobalStateCache memory gStateCache = _globalStateRO();
        LiquidationStatus memory status = _computeLiquidity(aStateCache, gStateCache);

        position.collateral = aStateCache.collateral;
        position.currentDebt = status.currentDebt;
        position.currentLtv = status.currentLtv;
        position.maxOriginationDebtAmount = _maxDebt(aStateCache.collateral);

        // liquidationLtv [USDS/gOHM] * collateral [gOHM]
        // Round down to get the conservative max debt allowed
        position.liquidationDebtAmount = uint256(liquidationLtv).mulWadDown(position.collateral);

        // healthFactor = liquidationLtv [USDS/gOHM] * collateral [gOHM] / debt [USDS]
        position.healthFactor = position.currentDebt == 0
            ? type(uint256).max
            : uint256(liquidationLtv).mulDivDown(position.collateral, position.currentDebt);

        (
            ,
            /*totalGOhm*/ position.totalDelegated,
            position.numDelegateAddresses,
            position.maxDelegateAddresses
        ) = DLGTE.accountDelegationSummary(account);
    }

    /// @inheritdoc IMonoCooler
    function computeLiquidity(
        address[] calldata accounts
    ) external view override returns (LiquidationStatus[] memory status) {
        uint256 numAccounts = accounts.length;
        status = new LiquidationStatus[](numAccounts);
        GlobalStateCache memory gStateCache = _globalStateRO();
        for (uint256 i; i < numAccounts; ++i) {
            status[i] = _computeLiquidity(allAccountState[accounts[i]], gStateCache);
        }
    }

    /// @inheritdoc IMonoCooler
    function accountDelegationsList(
        address account,
        uint256 startIndex,
        uint256 maxItems
    ) external view override returns (DLGTEv1.AccountDelegation[] memory delegations) {
        return DLGTE.accountDelegationsList(account, startIndex, maxItems);
    }

    /// @inheritdoc IMonoCooler
    function accountState(address account) external view override returns (AccountState memory) {
        return allAccountState[account];
    }

    /// @inheritdoc IMonoCooler
    function accountCollateral(address account) external view override returns (uint128) {
        return allAccountState[account].collateral;
    }

    /// @inheritdoc IMonoCooler
    function accountDebt(address account) external view override returns (uint128) {
        AccountState storage aState = allAccountState[account];
        GlobalStateCache memory gStateCache = _globalStateRO();
        return _currentAccountDebt(
            aState.debtCheckpoint,
            aState.interestAccumulatorRay,
            gStateCache.interestAccumulatorRay,
            true
        );
    }

    /// @inheritdoc IMonoCooler
    function globalState()
        external
        view
        override
        returns (uint128 /*totalDebt*/, uint256 /*interestAccumulatorRay*/)
    {
        GlobalStateCache memory gStateCache = _globalStateRO();
        return (gStateCache.totalDebt, gStateCache.interestAccumulatorRay);
    }

    //============================================================================================//
    //                                    INTERNAL STATE MGMT                                     //
    //============================================================================================//

    struct GlobalStateCache {
        /**
         * @notice The total amount that has already been borrowed by all accounts.
         * This increases as interest accrues or new borrows.
         * Decreases on repays or liquidations.
         */
        uint128 totalDebt;
        /**
         * @notice Internal tracking of the accumulated interest as an index starting from 1.0e27
         * When this accumulator is compunded by the interest rate, the total debt can be calculated as
         * `updatedTotalDebt = prevTotalDebt * latestInterestAccumulator / prevInterestAccumulator
         */
        uint256 interestAccumulatorRay;
    }

    /**
     * @dev Setup and refresh the global state
     * Update storage if and only if the timestamp has changed since last updated.
     */
    function _globalStateRW() private returns (GlobalStateCache memory gStateCache) {
        if (_initGlobalStateCache(gStateCache)) {
            // If the cache is dirty (increase in time) then write the
            // updated state
            interestAccumulatorUpdatedAt = uint32(block.timestamp);
            totalDebt = gStateCache.totalDebt;
            interestAccumulatorRay = gStateCache.interestAccumulatorRay;
        }
    }

    /**
     * @dev Setup the GlobalStateCache for a given token
     * read only -- storage isn't updated.
     */
    function _globalStateRO() private view returns (GlobalStateCache memory gStateCache) {
        _initGlobalStateCache(gStateCache);
    }

    /**
     * @dev Initialize the global state cache from storage to this block, for a given token.
     */
    function _initGlobalStateCache(
        GlobalStateCache memory gStateCache
    ) private view returns (bool dirty) {
        // Copies from storage
        gStateCache.interestAccumulatorRay = interestAccumulatorRay;
        gStateCache.totalDebt = totalDebt;

        // Convert annual IR [basis points] into WAD per second, assuming 365 days in a year
        uint96 interestRatePerSec = (uint96(interestRateBps) * 1e14) / ONE_YEAR;

        // Only compound if we're on a new block
        uint32 timeElapsed;
        unchecked {
            timeElapsed = uint32(block.timestamp) - interestAccumulatorUpdatedAt;
        }

        if (timeElapsed > 0) {
            dirty = true;

            // Compound the accumulator
            uint256 newInterestAccumulatorRay = gStateCache
                .interestAccumulatorRay
                .continuouslyCompounded(timeElapsed, interestRatePerSec);

            // Calculate the latest totalDebt from this
            gStateCache.totalDebt = newInterestAccumulatorRay
                .mulDivUp(gStateCache.totalDebt, gStateCache.interestAccumulatorRay)
                .encodeUInt128();
            gStateCache.interestAccumulatorRay = newInterestAccumulatorRay;
        }
    }

    //============================================================================================//
    //                                   INTERNAL COLLATERAL                                      //
    //============================================================================================//

    function _addCollateral(
        AccountState storage aState,
        AccountState memory aStateCache,
        uint128 collateralAmount,
        address caller,
        address onBehalfOf,
        DLGTEv1.DelegationRequest[] memory delegationRequests
    ) private {
        if (collateralAmount == 0) revert ExpectedNonZero();
        if (onBehalfOf == address(0)) revert InvalidAddress();

        collateralToken.safeTransferFrom(caller, address(this), collateralAmount);

        aState.collateral = aStateCache.collateral = aStateCache.collateral + collateralAmount;
        totalCollateral += collateralAmount;

        // Deposit the gOHM into DLGTE (undelegated)
        DLGTE.depositUndelegatedGohm(onBehalfOf, collateralAmount);

        // Apply any delegation requests on the undelegated gOHM
        if (delegationRequests.length > 0) {
            // While adding collateral on another user's behalf is ok,
            // delegating on behalf of someone else is not allowed.
            if (onBehalfOf != caller) revert InvalidAddress();
            DLGTE.applyDelegations(onBehalfOf, delegationRequests);
        }

        // NB: No need to check if the position is healthy when adding collateral as this
        // only improves the liquidity.
        emit CollateralAdded(caller, onBehalfOf, collateralAmount);
    }

    function _withdrawCollateral(
        AccountState storage aState,
        AccountState memory aStateCache,
        GlobalStateCache memory gStateCache,
        uint128 collateralAmount,
        address caller,
        address recipient,
        DLGTEv1.DelegationRequest[] calldata delegationRequests
    ) private returns (uint128 collateralWithdrawn) {
        if (collateralAmount == 0) revert ExpectedNonZero();
        if (recipient == address(0)) revert InvalidAddress();

        if (delegationRequests.length > 0) {
            // Apply the delegation requests in order to pull the required collateral back into this contract.
            DLGTE.applyDelegations(caller, delegationRequests);
        }

        uint128 currentDebt = _currentAccountDebt(
            aStateCache.debtCheckpoint, 
            aStateCache.interestAccumulatorRay, 
            gStateCache.interestAccumulatorRay, 
            true
        );

        if (collateralAmount == type(uint128).max) {
            uint128 minRequiredCollateral = _minCollateral(currentDebt);
            if (aStateCache.collateral > minRequiredCollateral) {
                collateralWithdrawn = aStateCache.collateral - minRequiredCollateral;
            } else {
                // Already at/above the origination LTV
                revert ExceededMaxOriginationLtv(
                    _calculateCurrentLtv(currentDebt, aStateCache.collateral),
                    maxOriginationLtv
                );
            }
            aStateCache.collateral = minRequiredCollateral;
        } else {
            collateralWithdrawn = collateralAmount;
            if (aStateCache.collateral < collateralWithdrawn) revert ExceededCollateralBalance();
            aStateCache.collateral = aStateCache.collateral - collateralWithdrawn;
        }
        
        DLGTE.withdrawUndelegatedGohm(caller, collateralWithdrawn);

        // Update the collateral balance, and then verify that it doesn't make the debt unsafe.
        aState.collateral = aStateCache.collateral;
        totalCollateral -= collateralWithdrawn;

        // Calculate the new LTV and verify it's less than or equal to the maxOriginationLtv
        if (currentDebt > 0) {
            uint256 newLtv = _calculateCurrentLtv(currentDebt, aStateCache.collateral);
            _validateOriginationLtv(newLtv);
        }

        // Finally transfer the collateral to the recipient
        collateralToken.safeTransfer(recipient, collateralWithdrawn);
        emit CollateralWithdrawn(caller, recipient, collateralWithdrawn);
    }

    //============================================================================================//
    //                                  INTERNAL BORROW/REPAY                                     //
    //============================================================================================//

    function _borrow(
        AccountState storage aState,
        AccountState memory aStateCache,
        GlobalStateCache memory gStateCache,
        address onBehalfOf,
        uint128 borrowAmount,
        address recipient
    ) private returns (uint128 amountBorrowed, uint256 newLtv) {
        if (borrowsPaused) revert Paused();
        if (borrowAmount == 0) revert ExpectedNonZero();
        if (recipient == address(0)) revert InvalidAddress();

        // don't round up the debt when borrowing.
        uint128 currentDebt = _currentAccountDebt(
            aStateCache.debtCheckpoint, 
            aStateCache.interestAccumulatorRay, 
            gStateCache.interestAccumulatorRay, 
            false
        );

        // Apply the new borrow. If type(uint128).max was specified
        // then borrow up to the maxOriginationLtv
        if (borrowAmount == type(uint128).max) {
            uint128 accountTotalDebt = _maxDebt(aStateCache.collateral);
            if (accountTotalDebt > currentDebt) {
                amountBorrowed = accountTotalDebt - currentDebt;
            } else {
                // Already at/above the origination LTV
                revert ExceededMaxOriginationLtv(
                    _calculateCurrentLtv(currentDebt, aStateCache.collateral),
                    maxOriginationLtv
                );
            }
            aStateCache.debtCheckpoint = accountTotalDebt;
        } else {
            amountBorrowed = borrowAmount;
            aStateCache.debtCheckpoint = currentDebt + amountBorrowed;
        }

        if (aStateCache.debtCheckpoint < minDebtRequired)
            revert MinDebtNotMet(minDebtRequired, aStateCache.debtCheckpoint);

        // Update the state
        aState.debtCheckpoint = aStateCache.debtCheckpoint;
        aState.interestAccumulatorRay = aStateCache.interestAccumulatorRay = gStateCache
            .interestAccumulatorRay;
        totalDebt = gStateCache.totalDebt = gStateCache.totalDebt + amountBorrowed;

        emit Borrow(onBehalfOf, recipient, amountBorrowed);

        // Calculate the new LTV and verify it's less than or equal to the maxOriginationLtv
        newLtv = _calculateCurrentLtv(aStateCache.debtCheckpoint, aStateCache.collateral);
        _validateOriginationLtv(newLtv);

        // Finally, borrow the funds from the Treasury and send the tokens to the recipient.
        _fundFromTreasury(amountBorrowed, recipient);
    }

    function _repay(
        AccountState storage aState,
        AccountState memory aStateCache,
        GlobalStateCache memory gStateCache,
        address caller,
        address onBehalfOf,
        uint128 repayAmount
    ) private returns (uint128 amountRepaid) {
        if (repayAmount == 0) revert ExpectedNonZero();
        if (onBehalfOf == address(0)) revert InvalidAddress();

        // Update the account's latest debt
        // round up for repay balance
        uint128 latestDebt = _currentAccountDebt(
            aStateCache.debtCheckpoint, 
            aStateCache.interestAccumulatorRay, 
            gStateCache.interestAccumulatorRay, 
            true
        );
        if (latestDebt == 0) revert ExpectedNonZero();

        // Cap the amount to be repaid to the current debt as of this block
        if (repayAmount < latestDebt) {
            amountRepaid = repayAmount;

            // Ensure the minimum debt amounts are still maintained
            aState.debtCheckpoint = aStateCache.debtCheckpoint = latestDebt - amountRepaid;
            if (aStateCache.debtCheckpoint < minDebtRequired)
                revert MinDebtNotMet(minDebtRequired, aStateCache.debtCheckpoint);
        } else {
            amountRepaid = latestDebt;
            aState.debtCheckpoint = aStateCache.debtCheckpoint = 0;
        }

        aState.interestAccumulatorRay = aStateCache.interestAccumulatorRay = gStateCache
            .interestAccumulatorRay;

        _reduceTotalDebt(gStateCache, amountRepaid);

        emit Repay(caller, onBehalfOf, amountRepaid);
        // NB: Liquidity doesn't need to be checked after a repay, as that only improves the health.

        _repayTreasury(amountRepaid, caller);
    }

    //============================================================================================//
    //                                     INTERNAL FUNDING                                       //
    //============================================================================================//

    function _fundFromTreasury(uint256 debtTokenAmount, address recipient) private {
        uint256 outstandingDebt = TRSRY.reserveDebt(debtToken, address(this));
        TRSRY.setDebt({
            debtor_: address(this),
            token_: debtToken,
            amount_: outstandingDebt + debtTokenAmount
        });

        // Since TRSRY holds sUSDS, a conversion must be done before funding.
        // Withdraw that sUSDS amount locally and then redeem to USDS sending to the recipient
        uint256 debtSavingsVaultAmount = debtSavingsVault.previewWithdraw(debtTokenAmount);
        TRSRY.increaseWithdrawApproval(address(this), debtSavingsVault, debtSavingsVaultAmount);
        TRSRY.withdrawReserves(address(this), debtSavingsVault, debtSavingsVaultAmount);
        debtSavingsVault.redeem(debtSavingsVaultAmount, recipient, address(this));
    }

    function _repayTreasury(uint256 debtTokenAmount, address from) private {
        uint256 outstandingDebt = TRSRY.reserveDebt(debtToken, address(this));
        TRSRY.setDebt({
            debtor_: address(this),
            token_: debtToken,
            amount_: (outstandingDebt > debtTokenAmount) ? outstandingDebt - debtTokenAmount : 0
        });

        // Pull in the debToken from the user and deposit into the savings vault,
        // with TRSRY as the receiver
        debtToken.safeTransferFrom(from, address(this), debtTokenAmount);
        debtToken.safeApprove(address(debtSavingsVault), debtTokenAmount);
        debtSavingsVault.deposit(debtTokenAmount, address(TRSRY));
    }

    /**
     * @dev Reduce the total debt in storage by a repayment amount.
     * NB: The sum of all users debt may be slightly more than the recorded total debt
     * because users debt is rounded up for dust.
     * The total debt is floored at 0.
     */
    function _reduceTotalDebt(GlobalStateCache memory gStateCache, uint128 repayAmount) private {
        unchecked {
            totalDebt = gStateCache.totalDebt = repayAmount > gStateCache.totalDebt
                ? 0
                : gStateCache.totalDebt - repayAmount;
        }
    }

    //============================================================================================//
    //                                      INTERNAL HEALTH                                       //
    //============================================================================================//

    /**
     * @dev Calculate the maximum amount which can be borrowed up to the maxOriginationLtv, given
     * a collateral amount
     */
    function _maxDebt(uint128 collateral) private view returns (uint128) {
        // debt [USDS] = maxOriginationLtv [USDS/gOHM] * collateral [gOHM]
        // Round down to get the conservative max debt allowed
        return uint256(maxOriginationLtv).mulWadDown(collateral).encodeUInt128();
    }

    /**
     * @dev Calculate the maximum collateral amount which can be withdrawn up to the maxOriginationLtv, given
     * a current debt amount
     */
    function _minCollateral(uint128 debt) private view returns (uint128) {
        // collateral [gOHM] = debt [USDS] / maxOriginationLtv [USDS/gOHM]
        // Round up to get the conservative min collateral allowed
        return uint256(debt).divWadUp(maxOriginationLtv).encodeUInt128();
    }

    /**
     * @dev Ensure the LTV isn't higher than the maxOriginationLtv
     */
    function _validateOriginationLtv(uint256 ltv) private view {
        if (ltv > maxOriginationLtv) {
            revert ExceededMaxOriginationLtv(ltv, maxOriginationLtv);
        }
    }

    /**
     * @dev Calculate the current LTV based on the latest debt
     */
    function _calculateCurrentLtv(
        uint128 currentDebt,
        uint128 collateral
    ) private pure returns (uint256) {
        return
            collateral == 0
                ? type(uint256).max // Represent 'undefined' as max uint256
                : uint256(currentDebt).divWadUp(collateral);
    }

    /**
     * @dev Generate the LiquidationStatus struct with current details
     * for this account.
     */
    function _computeLiquidity(
        AccountState memory aStateCache,
        GlobalStateCache memory gStateCache
    ) private view returns (LiquidationStatus memory status) {
        status.collateral = aStateCache.collateral;

        // Round the debt up
        status.currentDebt = _currentAccountDebt(
            aStateCache.debtCheckpoint, 
            aStateCache.interestAccumulatorRay, 
            gStateCache.interestAccumulatorRay, 
            true
        );
        status.currentLtv = _calculateCurrentLtv(status.currentDebt, status.collateral);

        status.exceededLiquidationLtv = status.collateral > 0 && status.currentLtv > liquidationLtv;
        status.exceededMaxOriginationLtv =
            status.collateral > 0 &&
            status.currentLtv > maxOriginationLtv;
    }

    //============================================================================================//
    //                                       INTERNAL AUX                                         //
    //============================================================================================//

    /**
     * @dev Calculate the latest debt for a given account & token.
     * Derived from the prior debt checkpoint, and the interest accumulator.
     */
    function _currentAccountDebt(
        uint128 accountDebtCheckpoint_,
        uint256 accountInterestAccumulatorRay_,
        uint256 globalInterestAccumulatorRay_,
        bool roundUp
    ) private pure returns (uint128 result) {
        if (accountDebtCheckpoint_ == 0) return 0;

        // Shortcut if no change.
        if (accountInterestAccumulatorRay_ == globalInterestAccumulatorRay_) {
            return accountDebtCheckpoint_;
        }

        uint256 debt = roundUp
            ? globalInterestAccumulatorRay_.mulDivUp(
                accountDebtCheckpoint_,
                accountInterestAccumulatorRay_
            )
            : globalInterestAccumulatorRay_.mulDivDown(
                accountDebtCheckpoint_,
                accountInterestAccumulatorRay_
            );
        return debt.encodeUInt128();
    }
}