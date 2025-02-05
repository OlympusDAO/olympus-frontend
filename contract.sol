// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import { ERC20 } from "solmate/tokens/ERC20.sol";
import { DLGTEv1 } from "modules/DLGTE/DLGTE.v1.sol";
import { ICoolerLtvOracle } from "policies/interfaces/cooler/ICoolerLtvOracle.sol";
import { ICoolerTreasuryBorrower } from "policies/interfaces/cooler/ICoolerTreasuryBorrower.sol";
import { IStaking } from "interfaces/IStaking.sol";

/**
 * @title Mono Cooler
 * @notice A borrow/lend market where users can deposit their gOHM as collateral and then
 * borrow a stablecoin debt token up to a certain LTV
 *  - The debt token may change over time - eg DAI to USDS (or USDC), determined by the
 *    `CoolerTreasuryBorrower`
 *  - The collateral and debt amounts tracked on this contract are always reported in wad,
 *    ie 18 decimal places
 *  - gOHM collateral can be delegated to accounts for voting, via the DLGTE module
 *  - Positions can be liquidated if the LTV breaches the 'liquidation LTV' as determined by the
 *    `LTV Oracle`
 *  - Users may set an authorization for one other address to act on its behalf.
 */
interface IMonoCooler {
  error ExceededMaxOriginationLtv(uint256 newLtv, uint256 maxOriginationLtv);
  error ExceededCollateralBalance();
  error MinDebtNotMet(uint256 minRequired, uint256 current);
  error InvalidAddress();
  error InvalidParam();
  error ExpectedNonZero();
  error Paused();
  error CannotLiquidate();
  error InvalidDelegationRequests();
  error ExceededPreviousLtv(uint256 oldLtv, uint256 newLtv);
  error InvalidCollateralDelta();
  error ExpiredSignature(uint256 deadline);
  error InvalidNonce(uint256 deadline);
  error InvalidSigner(address signer, address owner);
  error UnathorizedOnBehalfOf();

  event BorrowPausedSet(bool isPaused);
  event LiquidationsPausedSet(bool isPaused);
  event InterestRateSet(uint16 interestRateBps);
  event LtvOracleSet(address indexed oracle);
  event TreasuryBorrowerSet(address indexed treasuryBorrower);
  event CollateralAdded(address indexed caller, address indexed onBehalfOf, uint128 collateralAmount);
  event CollateralWithdrawn(
    address indexed caller,
    address indexed onBehalfOf,
    address indexed recipient,
    uint128 collateralAmount
  );
  event Borrow(address indexed caller, address indexed onBehalfOf, address indexed recipient, uint128 amount);
  event Repay(address indexed caller, address indexed onBehalfOf, uint128 repayAmount);
  event Liquidated(address indexed account, uint128 collateralSeized, uint128 debtWiped);
  event AuthorizationSet(
    address indexed caller,
    address indexed account,
    address indexed authorized,
    uint96 authorizationDeadline
  );

  /// @notice The record of an individual account's collateral and debt data
  struct AccountState {
    /// @notice The amount of gOHM collateral the account has posted
    uint128 collateral;
    /**
     * @notice A checkpoint of user debt, updated after a borrow/repay/liquidation
     * @dev Debt as of now =  (
     *    `account.debtCheckpoint` *
     *    `debtTokenData.interestAccumulator` /
     *    `account.interestAccumulator`
     * )
     */
    uint128 debtCheckpoint;
    /// @notice The account's last interest accumulator checkpoint
    uint256 interestAccumulatorRay;
  }

  struct Authorization {
    /// @notice The address of the account granting authorization
    address account;
    /// @notice The address of who is authorized to act on the the accounts behalf
    address authorized;
    /// @notice The unix timestamp that the access is automatically revoked
    uint96 authorizationDeadline;
    /// @notice For replay protection
    uint256 nonce;
    /// @notice A unix timestamp for when the signature is valid until
    uint256 signatureDeadline;
  }

  struct Signature {
    uint8 v;
    bytes32 r;
    bytes32 s;
  }

  /// @notice The status for whether an account can be liquidated or not
  struct LiquidationStatus {
    /// @notice The amount [in gOHM collateral terms] of collateral which has been provided by the user
    uint128 collateral;
    /// @notice The up to date amount of debt [in debtToken terms]
    uint128 currentDebt;
    /// @notice The current LTV of this account [in debtTokens per gOHM collateral terms]
    uint128 currentLtv;
    /// @notice Has this account exceeded the liquidation LTV
    bool exceededLiquidationLtv;
    /// @notice Has this account exceeded the max origination LTV
    bool exceededMaxOriginationLtv;
    /// @notice A liquidator will receive this amount [in gOHM collateral terms] if
    /// this account is liquidated as of this block
    uint128 currentIncentive;
  }

  /// @notice An account's collateral and debt position details
  /// Provided for UX
  struct AccountPosition {
    /// @notice The amount [in gOHM collateral terms] of collateral which has been provided by the user
    /// @dev To 18 decimal places
    uint256 collateral;
    /// @notice The up to date amount of debt
    /// @dev To 18 decimal places
    uint256 currentDebt;
    /// @notice The maximum amount of debtToken's this account can borrow given the
    /// collateral posted, up to `maxOriginationLtv`
    /// @dev To 18 decimal places
    uint256 maxOriginationDebtAmount;
    /// @notice The maximum amount of debtToken's this account can accrue before being
    /// eligable to be liquidated, up to `liquidationLtv`
    /// @dev To 18 decimal places
    uint256 liquidationDebtAmount;
    /// @notice The health factor of this accounts position.
    /// Anything less than 1 can be liquidated, relative to `liquidationLtv`
    /// @dev To 18 decimal places
    uint256 healthFactor;
    /// @notice The current LTV of this account [in debtTokens per gOHM collateral terms]
    /// @dev To 18 decimal places
    uint256 currentLtv;
    /// @notice The total collateral delegated for this user across all delegates
    /// @dev To 18 decimal places
    uint256 totalDelegated;
    /// @notice The current number of addresses this account has delegated to
    uint256 numDelegateAddresses;
    /// @notice The max number of delegates this account is allowed to delegate to
    uint256 maxDelegateAddresses;
  }

  /// @notice The collateral token supplied by users/accounts, eg gOHM
  function collateralToken() external view returns (ERC20);

  /// @notice The debt token which can be borrowed, eg DAI or USDS
  function debtToken() external view returns (ERC20);

  /// @notice Unwrapped gOHM
  function ohm() external view returns (ERC20);

  /// @notice staking contract to unstake (and burn) OHM from liquidations
  function staking() external view returns (IStaking);

  /// @notice The minimum debt a user needs to maintain
  /// @dev It costs gas to liquidate users, so we don't want dust amounts.
  /// To 18 decimal places
  function minDebtRequired() external view returns (uint256);

  /// @notice The total amount of collateral posted across all accounts.
  /// @dev To 18 decimal places
  function totalCollateral() external view returns (uint128);

  /// @notice The total amount of debt which has been borrowed across all users
  /// as of the latest checkpoint
  /// @dev To 18 decimal places
  function totalDebt() external view returns (uint128);

  /// @notice Liquidations may be paused in order for users to recover/repay debt after
  /// emergency actions or interest rate changes
  function liquidationsPaused() external view returns (bool);

  /// @notice Borrows may be paused for emergency actions or deprecating the facility
  function borrowsPaused() external view returns (bool);

  /// @notice The flat interest rate, defined in basis points.
  /// @dev Interest (approximately) continuously compounds at this rate.
  /// @dev To 18 decimal places
  function interestRateBps() external view returns (uint16);

  /// @notice The oracle serving both the Max Origination LTV and the Liquidation LTV
  function ltvOracle() external view returns (ICoolerLtvOracle);

  /// @notice The policy which borrows/repays from Treasury on behalf of Cooler
  function treasuryBorrower() external view returns (ICoolerTreasuryBorrower);

  /// @notice The current Max Origination LTV and Liquidation LTV from the `ltvOracle()`
  /// @dev Both to 18 decimal places
  function loanToValues() external view returns (uint96 maxOriginationLtv, uint96 liquidationLtv);

  /// @notice The last time the global debt accumulator was updated
  function interestAccumulatorUpdatedAt() external view returns (uint32);

  /// @notice The accumulator index used to track the compounding of debt, starting at 1e27 at genesis
  /// @dev To RAY (1e27) precision
  function interestAccumulatorRay() external view returns (uint256);

  /// @notice Whether `authorized` is authorized to act on `authorizer`'s behalf for all user actions
  /// up until the `authorizationDeadline` unix timestamp.
  /// @dev Anyone is authorized to modify their own positions, regardless of this variable.
  function authorizations(address authorizer, address authorized) external view returns (uint96 authorizationDeadline);

  /// @notice The `authorizer`'s current nonce. Used to prevent replay attacks with EIP-712 signatures.
  function authorizationNonces(address authorizer) external view returns (uint256);

  /// @dev Returns the domain separator used in the encoding of the signature for `setAuthorizationWithSig()`, as defined by {EIP712}.
  function DOMAIN_SEPARATOR() external view returns (bytes32);

  /// @notice Sets the authorization for `authorized` to manage `msg.sender`'s positions until `authorizationDeadline`
  /// @param authorized The authorized address.
  /// @param authorizationDeadline The unix timestamp that they the authorization is valid until.
  /// @dev Authorization can be revoked by setting the `authorizationDeadline` into the past
  function setAuthorization(address authorized, uint96 authorizationDeadline) external;

  /// @notice Sets the authorization for `authorization.authorized` to manage `authorization.authorizer`'s positions
  /// until `authorization.authorizationDeadline`.
  /// @dev Warning: Reverts if the signature has already been submitted.
  /// @dev The signature is malleable, but it has no impact on the security here.
  /// @dev The nonce is passed as argument to be able to revert with a different error message.
  /// @param authorization The `Authorization` struct.
  /// @param signature The signature.
  /// @dev Authorization can be revoked by calling `setAuthorization()` and setting the `authorizationDeadline` into the past
  function setAuthorizationWithSig(Authorization calldata authorization, Signature calldata signature) external;

  /// @dev Returns whether the `sender` is authorized to manage `onBehalf`'s positions.
  function isSenderAuthorized(address sender, address onBehalf) external view returns (bool);

  //============================================================================================//
  //                                        COLLATERAL                                          //
  //============================================================================================//

  /**
   * @notice Deposit gOHM as collateral
   * @param collateralAmount The amount to deposit to 18 decimal places
   *    - MUST be greater than zero
   * @param onBehalfOf A caller can add collateral on behalf of themselves or another address.
   *    - MUST NOT be address(0)
   * @param delegationRequests The set of delegations to apply after adding collateral.
   *    - MAY be empty, meaning no delegations are applied.
   *    - Total collateral delegated as part of these requests MUST BE less than the account collateral.
   *    - MUST NOT apply delegations that results in more collateral being undelegated than
   *      the account has collateral for.
   *    - If `onBehalfOf` does not equal the caller, the caller must be authorized via
   *      `setAuthorization()` or `setAuthorizationWithSig()`
   */
  function addCollateral(
    uint128 collateralAmount,
    address onBehalfOf,
    DLGTEv1.DelegationRequest[] calldata delegationRequests
  ) external;

  /**
   * @notice Withdraw gOHM collateral.
   *    - Account LTV MUST be less than or equal to `maxOriginationLtv` after the withdraw is applied
   *    - At least `collateralAmount` collateral MUST be undelegated for this account.
   *      Use the `delegationRequests` to rescind enough as part of this request.
   * @param collateralAmount The amount of collateral to remove to 18 decimal places
   *    - MUST be greater than zero
   *    - If set to type(uint128).max then withdraw the max amount up to maxOriginationLtv
   * @param onBehalfOf A caller can withdraw collateral on behalf of themselves or another address if
   *      authorized via `setAuthorization()` or `setAuthorizationWithSig()`
   * @param recipient Send the gOHM collateral to a specified recipient address.
   *    - MUST NOT be address(0)
   * @param delegationRequests The set of delegations to apply before removing collateral.
   *    - MAY be empty, meaning no delegations are applied.
   *    - Total collateral delegated as part of these requests MUST BE less than the account collateral.
   *    - MUST NOT apply delegations that results in more collateral being undelegated than
   *      the account has collateral for.
   */
  function withdrawCollateral(
    uint128 collateralAmount,
    address onBehalfOf,
    address recipient,
    DLGTEv1.DelegationRequest[] calldata delegationRequests
  ) external returns (uint128 collateralWithdrawn);

  /**
   * @notice Apply a set of delegation requests on behalf of a given user.
   * @param delegationRequests The set of delegations to apply.
   *    - MAY be empty, meaning no delegations are applied.
   *    - Total collateral delegated as part of these requests MUST BE less than the account collateral.
   *    - MUST NOT apply delegations that results in more collateral being undelegated than
   *      the account has collateral for.
   *    - It applies across total gOHM balances for a given account across all calling policies
   *      So this may (un)delegate the account's gOHM set by another policy
   * @param onBehalfOf A caller can apply delegations on behalf of themselves or another address if
   *      authorized via `setAuthorization()` or `setAuthorizationWithSig()`
   */
  function applyDelegations(
    DLGTEv1.DelegationRequest[] calldata delegationRequests,
    address onBehalfOf
  ) external returns (uint256 totalDelegated, uint256 totalUndelegated);

  //============================================================================================//
  //                                       BORROW/REPAY                                         //
  //============================================================================================//

  /**
   * @notice Borrow `debtToken`
   *    - Account LTV MUST be less than or equal to `maxOriginationLtv` after the borrow is applied
   *    - Total debt for this account MUST be greater than or equal to the `minDebtRequired`
   *      after the borrow is applied
   * @param borrowAmountInWad The amount of `debtToken` to borrow, to 18 decimals regardless of the debt token
   *    - MUST be greater than zero
   *    - If set to type(uint128).max then borrow the max amount up to maxOriginationLtv
   * @param onBehalfOf A caller can borrow on behalf of themselves or another address if
   *      authorized via `setAuthorization()` or `setAuthorizationWithSig()`
   * @param recipient Send the borrowed token to a specified recipient address.
   *    - MUST NOT be address(0)
   * @return amountBorrowed The amount actually borrowed.
   */
  function borrow(
    uint128 borrowAmountInWad,
    address onBehalfOf,
    address recipient
  ) external returns (uint128 amountBorrowed);

  /**
   * @notice Repay a portion, or all of the debt
   *    - MUST NOT be called for an account which has no debt
   *    - If the entire debt isn't paid off, then the total debt for this account
   *      MUST be greater than or equal to the `minDebtRequired` after the borrow is applied
   * @param repayAmountInWad The amount to repay, to 18 decimals regardless of the debt token
   *    - MUST be greater than zero
   *    - MAY be greater than the latest debt as of this block. In which case it will be capped
   *      to that latest debt
   * @param onBehalfOf A caller can repay the debt on behalf of themselves or another address
   * @return amountRepaid The amount actually repaid.
   */
  function repay(uint128 repayAmountInWad, address onBehalfOf) external returns (uint128 amountRepaid);

  //============================================================================================//
  //                                       LIQUIDATIONS                                         //
  //============================================================================================//

  /**
   * @notice Liquidate one or more accounts which have exceeded the `liquidationLtv`
   * The gOHM collateral is seized (unstaked to OHM and burned), and the accounts debt is wiped.
   * @dev If one of the provided accounts in the batch hasn't exceeded the max LTV then it is skipped.
   */
  function batchLiquidate(
    address[] calldata accounts,
    DLGTEv1.DelegationRequest[][] calldata delegationRequests
  ) external returns (uint128 totalCollateralClaimed, uint128 totalDebtWiped);

  /**
   * @notice If an account becomes unhealthy and has many delegations such that liquidation can't be
   * performed in one transaction, then delegations can be rescinded over multiple transactions
   * in order to get this account into a state where it can then be liquidated.
   */
  function applyUnhealthyDelegations(
    address account,
    DLGTEv1.DelegationRequest[] calldata delegationRequests
  ) external returns (uint256 totalUndelegated);

  //============================================================================================//
  //                                           ADMIN                                            //
  //============================================================================================//

  /// @notice Set the oracle which serves the max Origination LTV and the Liquidation LTV
  function setLtvOracle(address newOracle) external;

  /// @notice Set the policy which borrows/repays from Treasury on behalf of Cooler
  function setTreasuryBorrower(address newTreasuryBorrower) external;

  /// @notice Liquidation may be paused in order for users to recover/repay debt after emergency actions
  function setLiquidationsPaused(bool isPaused) external;

  /// @notice Pause any new borrows of `debtToken`
  function setBorrowPaused(bool isPaused) external;

  /// @notice Update the interest rate, specified in basis points.
  function setInterestRateBps(uint16 newInterestRateBps) external;

  /// @notice Allow an account to have more or less than the DEFAULT_MAX_DELEGATE_ADDRESSES
  /// number of delegates.
  function setMaxDelegateAddresses(address account, uint32 maxDelegateAddresses) external;

  /// @notice Update and checkpoint the total debt up until now
  /// @dev May be useful in case there are no new user actions for some time.
  function checkpointDebt() external returns (uint128 totalDebtInWad, uint256 interestAccumulatorRay);

  //============================================================================================//
  //                                      AUX FUNCTIONS                                         //
  //============================================================================================//

  /**
   * @notice Calculate the difference in debt required in order to be at or just under
   * the maxOriginationLTV if `collateralDelta` was added/removed
   * from the current position.
   * A positive `debtDeltaInWad` means the account can borrow that amount after adding that `collateralDelta` collateral
   * A negative `debtDeltaInWad` means it needs to repay that amount in order to withdraw that `collateralDelta` collateral
   * @dev debtDeltaInWad is always to 18 decimal places
   */
  function debtDeltaForMaxOriginationLtv(
    address account,
    int128 collateralDelta
  ) external view returns (int128 debtDeltaInWad);

  /**
   * @notice An view of an accounts current and up to date position as of this block
   * @param account The account to get a position for
   */
  function accountPosition(address account) external view returns (AccountPosition memory position);

  /**
   * @notice Compute the liquidity status for a set of accounts.
   * @dev This can be used to verify if accounts can be liquidated or not.
   * @param accounts The accounts to get the status for.
   */
  function computeLiquidity(address[] calldata accounts) external view returns (LiquidationStatus[] memory status);

  /**
   * @notice Paginated view of an account's delegations
   * @dev Can call sequentially increasing the `startIndex` each time by the number of items returned in the previous call,
   * until number of items returned is less than `maxItems`
   */
  function accountDelegationsList(
    address account,
    uint256 startIndex,
    uint256 maxItems
  ) external view returns (DLGTEv1.AccountDelegation[] memory delegations);

  /// @notice A view of the last checkpoint of account data (not as of this block)
  function accountState(address account) external view returns (AccountState memory);

  /// @notice An account's current collateral
  /// @dev to 18 decimal places
  function accountCollateral(address account) external view returns (uint128 collateral);

  /// @notice An account's current debt as of this block
  //  @notice to 18 decimal places regardless of the debt token
  function accountDebt(address account) external view returns (uint128 debt);

  /// @notice A view of the derived/internal cache data.
  function globalState() external view returns (uint128 totalDebt, uint256 interestAccumulatorRay);
}
