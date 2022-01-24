import { isAddress } from "@ethersproject/address";
import { Box, Button, Divider, Link, Modal, Paper, SvgIcon, Typography } from "@material-ui/core";
import { FormControl, FormHelperText, InputAdornment } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { OutlinedInput } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { BigNumber } from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Project } from "src/components/GiveProject/project.type";
import { useWeb3Context } from "src/hooks/web3Context";
import {
  changeApproval,
  changeMockApproval,
  hasPendingGiveTxn,
  PENDING_TXN_EDIT_GIVE,
  PENDING_TXN_GIVE,
  PENDING_TXN_GIVE_APPROVAL,
} from "src/slices/GiveThunk";

import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import {
  ArrowGraphic,
  CurrPositionGraphic,
  NewPositionGraphic,
  VaultGraphic,
  WalletGraphic,
  YieldGraphic,
} from "../../components/EducationCard";
import { getTokenImage } from "../../helpers";
import { IAccountSlice } from "../../slices/AccountSlice";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../slices/PendingTxnsSlice";
const sOhmImg = getTokenImage("sohm");
import { t, Trans } from "@lingui/macro";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { InfoTooltip } from "@olympusdao/component-library";
import { useLocation } from "react-router-dom";
import { NetworkId } from "src/constants";
import { shorten } from "src/helpers";
import { EnvHelper } from "src/helpers/Environment";

import { CancelCallback, SubmitCallback } from "./Interfaces";

type RecipientModalProps = {
  isModalOpen: boolean;
  callbackFunc: SubmitCallback;
  cancelFunc: CancelCallback;
  project?: Project;
  currentWalletAddress?: string;
  currentDepositAmount?: BigNumber; // As per IUserDonationInfo
};

// TODO consider shifting this into interfaces.ts
type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
};

export function RecipientModal({
  isModalOpen,
  callbackFunc,
  cancelFunc,
  project,
  currentWalletAddress,
  currentDepositAmount,
}: RecipientModalProps) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { provider, address, connect, networkId } = useWeb3Context();

  const _initialDepositAmount = 0;
  const _initialWalletAddress = "";
  const _initialDepositAmountValid = false;
  const _initialDepositAmountValidError = "";
  const _initialWalletAddressValid = false;
  const _initialWalletAddressValidError = "";
  const _initialIsAmountSet = false;

  const getInitialDepositAmount = () => {
    return currentDepositAmount ? currentDepositAmount.toNumber() : _initialDepositAmount;
  };
  const [depositAmount, setDepositAmount] = useState(getInitialDepositAmount());
  const [isDepositAmountValid, setIsDepositAmountValid] = useState(_initialDepositAmountValid);
  const [isDepositAmountValidError, setIsDepositAmountValidError] = useState(_initialDepositAmountValidError);

  const getInitialWalletAddress = () => {
    return currentWalletAddress ? currentWalletAddress : _initialWalletAddress;
  };
  const [walletAddress, setWalletAddress] = useState(getInitialWalletAddress());
  const [isWalletAddressValid, setIsWalletAddressValid] = useState(_initialWalletAddressValid);
  const [isWalletAddressValidError, setIsWalletAddressValidError] = useState(_initialWalletAddressValidError);

  const [isAmountSet, setIsAmountSet] = useState(_initialIsAmountSet);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    checkIsDepositAmountValid(getDepositAmount().toFixed());
    checkIsWalletAddressValid(getWalletAddress());
  }, []);

  useEffect(() => {
    // When we close the modal, we ensure that the state is also reset to default
    if (!isModalOpen) {
      handleSetDepositAmount(getInitialDepositAmount().toFixed());
      handleSetWallet(getInitialWalletAddress());
      setIsAmountSet(_initialIsAmountSet);
    }
  }, [isModalOpen]);

  const handleModalInsideClick = (e: any): void => {
    // When the user clicks within the modal window, we do not want to pass the event up the tree
    e.stopPropagation();
  };

  /**
   * Returns the user's sOHM balance
   *
   * Copied from Stake.jsx
   *
   * TODO consider extracting this into a helper file
   */
  const sohmBalance: string = useSelector((state: State) => {
    return networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.balances && state.account.balances.mockSohm
      : state.account.balances && state.account.balances.sohm;
  });

  const giveAllowance: number = useSelector((state: State) => {
    return networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.mockGiving && state.account.mockGiving.sohmGive
      : state.account.giving && state.account.giving.sohmGive;
  });

  const isAccountLoading: boolean = useSelector((state: State) => {
    return state.account.loading;
  });

  const isGiveLoading: boolean = useSelector((state: State) => {
    return networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.mockGiving.loading
      : state.account.giving.loading;
  });

  const pendingTransactions: IPendingTxn[] = useSelector((state: State) => {
    return state.pendingTransactions;
  });

  const onSeekApproval = async () => {
    if (networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)) {
      await dispatch(changeMockApproval({ address, token: "sohm", provider, networkID: networkId }));
    } else {
      await dispatch(changeApproval({ address, token: "sohm", provider, networkID: networkId }));
    }
  };

  const hasAllowance = useCallback(() => {
    return giveAllowance > 0;
  }, [giveAllowance]);

  const getSOhmBalance = (): BigNumber => {
    return new BigNumber(sohmBalance);
  };

  /**
   * Returns the maximum deposit that can be directed to the recipient.
   *
   * This is equal to the current wallet balance and the current deposit amount (in the vault).
   *
   * @returns BigNumber
   */
  const getMaximumDepositAmount = (): BigNumber => {
    return new BigNumber(sohmBalance).plus(currentDepositAmount ? currentDepositAmount : 0);
  };

  const handleSetDepositAmount = (value: string) => {
    checkIsDepositAmountValid(value);
    setDepositAmount(parseFloat(value));
  };

  const checkIsDepositAmountValid = (value: string) => {
    const valueNumber = new BigNumber(value);
    const sOhmBalanceNumber = getSOhmBalance();

    if (!value || value == "" || valueNumber.isEqualTo(0)) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError(t`Please enter a value`);
      return;
    }

    if (valueNumber.isLessThan(0)) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError(t`Value must be positive`);
      return;
    }

    if (sOhmBalanceNumber.isEqualTo(0)) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError(t`You must have a balance of sOHM (staked OHM) to continue`);
    }

    if (valueNumber.isGreaterThan(getMaximumDepositAmount())) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError(t`Value cannot be more than your sOHM balance of ` + getMaximumDepositAmount());
      return;
    }

    setIsDepositAmountValid(true);
    setIsDepositAmountValidError("");
  };

  const handleSetWallet = (value: string) => {
    checkIsWalletAddressValid(value);
    setWalletAddress(value);
  };

  /**
   * Checks if the provided wallet address is valid.
   *
   * This will return false if:
   * - it is an invalid Ethereum address
   * - it is the same as the sender address
   *
   * @param {string} value the proposed value for the wallet address
   */
  const checkIsWalletAddressValid = (value: string) => {
    if (!isAddress(value)) {
      setIsWalletAddressValid(false);
      setIsWalletAddressValidError(t`Please enter a valid Ethereum address`);
      return;
    }

    if (value == address) {
      setIsWalletAddressValid(false);
      setIsWalletAddressValidError(t`Please enter a different address: cannot direct to the same wallet`);
      return;
    }

    setIsWalletAddressValid(true);
    setIsWalletAddressValidError("");
  };

  /**
   * Determines if an existing recipient entry is being edited (false)
   * or if a new entry is being added (true).
   *
   * @returns boolean
   */
  const isCreateMode = (): boolean => {
    if (currentWalletAddress) return false;

    return true;
  };

  const isProjectMode = (): boolean => {
    if (project) return true;

    return false;
  };

  const getTitle = (): string => {
    if (!isCreateMode()) return t`Edit Yield`;

    return t`Give Yield`;
  };

  /**
   * Indicates whether the form can be submitted.
   *
   * This will return false if:
   * - the deposit amount is invalid
   * - the wallet address is invalid
   * - there is no sender address
   * - an add/edit transaction is pending
   * - it is not in create mode and there is no difference in the amount
   *
   * @returns boolean
   */
  const canSubmit = (): boolean => {
    if (!isDepositAmountValid) return false;

    if (isAccountLoading || isGiveLoading) return false;

    // The wallet address is only set when a project is not given
    if (!isProjectMode() && !isWalletAddressValid) return false;

    if (!address) return false;
    if (hasPendingGiveTxn(pendingTransactions)) return false;
    if (!isCreateMode() && getDepositAmountDiff().isEqualTo(0)) return false;

    return true;
  };

  /**
   * Indicates the amount retained in the user's wallet after a deposit to the vault.
   *
   * If a yield direction is being created, it returns the current sOHM balance minus the entered deposit.
   * If a yield direction is being edited, it returns the current sOHM balance minus the difference in the entered deposit.
   *
   * @returns BigNumber instance
   */
  const getRetainedAmountDiff = (): BigNumber => {
    const tempDepositAmount: BigNumber = !isCreateMode() ? getDepositAmountDiff() : getDepositAmount();
    return new BigNumber(sohmBalance).minus(tempDepositAmount);
  };

  const getDepositAmountDiff = (): BigNumber => {
    // We can't trust the accuracy of floating point arithmetic of standard JS libraries, so we use BigNumber
    const depositAmountBig = new BigNumber(depositAmount);
    return depositAmountBig.minus(getCurrentDepositAmount());
  };

  /**
   * Ensures that the depositAmount returned is a valid number.
   *
   * @returns
   */
  const getDepositAmount = (): BigNumber => {
    if (!depositAmount) return new BigNumber(0);

    return new BigNumber(depositAmount);
  };

  const getCurrentDepositAmount = (): BigNumber => {
    if (!currentDepositAmount) return new BigNumber(0);

    return new BigNumber(currentDepositAmount);
  };

  /**
   * Returns the wallet address. If a project is defined, it uses the
   * project wallet, else what was passed in as a parameter.
   */
  const getWalletAddress = (): string => {
    if (project) return project.wallet;

    return walletAddress;
  };

  /**
   * Returns the appropriate title of the recipient.
   * - No project: shortened wallet address
   * - Project without a separate owner value: project title
   * - Otherwise the project title and owner
   */
  const getRecipientTitle = (): string => {
    if (!project) return shorten(walletAddress);

    if (!project.owner) return project.title;

    return project.owner + " - " + project.title;
  };

  const handleGoBack = () => {
    setIsAmountSet(false);
  };

  const handleContinue = () => {
    setIsAmountSet(true);
  };

  /**
   * Calls the submission callback function that is provided to the component.
   */
  const handleSubmit = () => {
    const depositAmountBig = new BigNumber(depositAmount);

    callbackFunc(getWalletAddress(), depositAmountBig, getDepositAmountDiff());
  };

  const getRecipientElements = () => {
    // If project mode is enabled, the amount is editable, but the recipient is not
    if (isProjectMode()) {
      return (
        <>
          <Typography variant="body1">
            <Trans>Recipient</Trans>
          </Typography>
          <Typography variant="h6">{getRecipientTitle()}</Typography>
        </>
      );
    }

    // If not in create mode, don't display the recipient wallet address
    if (!isCreateMode()) {
      return <></>;
    }

    return (
      <>
        <div className="give-modal-alloc-tip">
          <Typography variant="body1">
            <Trans>Recipient</Trans>
          </Typography>
          {/* The main reason for having this tooltip is because it keeps spacing consistent with the sOHM Allocation above */}
          <InfoTooltip
            message={t`The specified wallet address will receive the rebase yield from the amount that you deposit.`}
            children={null}
          />
        </div>
        <FormControl className="modal-input" variant="outlined" color="primary">
          <InputLabel htmlFor="wallet-input"></InputLabel>
          <OutlinedInput
            id="wallet-input"
            type="text"
            placeholder={t`Enter a wallet address in the form of 0x ...`}
            className="stake-input"
            value={walletAddress}
            error={!isWalletAddressValid}
            onChange={e => handleSetWallet(e.target.value)}
            labelWidth={0}
            disabled={!isCreateMode()}
          />
          <FormHelperText>{isWalletAddressValidError}</FormHelperText>
        </FormControl>{" "}
      </>
    );
  };

  const handleConnect = () => {
    // Close the modal first
    cancelFunc();

    // Then connect
    connect();
  };

  // TODO stop modal from moving when validation messages are shown

  // NOTE: the following warning is caused by the amount-input field:
  // Warning: `value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.%s
  // This is caused by this line (currently 423):
  // value={getDepositAmount().isEqualTo(0) ? null : getDepositAmount()}
  // If we set the value to an empty string instead of null, any decimal number that is entered will not be accepted
  // This appears to be due to the following bug (which is still not resolved);
  // https://github.com/facebook/react/issues/11877

  // TODO re-arrange the below output to be around the state: approval, custom recipient, project recipient, editing

  return (
    /* modal-container displays a background behind the ohm-card container, which means that if modal-container receives a click, we can close the modal */
    <Modal className="modal-container" open={isModalOpen} onClose={cancelFunc} onClick={cancelFunc} hideBackdrop={true}>
      <Paper
        className={`ohm-card ohm-modal ${isSmallScreen && "smaller"}`}
        onClick={handleModalInsideClick}
        style={{
          top: hasAllowance() && isSmallScreen ? "0%" : "50%",
          transform: hasAllowance() && isSmallScreen ? "translate(-50.048%, 0%)" : "translate(-50.048%, -50.048%)",
        }}
      >
        <div className="yield-header">
          <Link onClick={() => cancelFunc()}>
            <SvgIcon color="primary" component={XIcon} />
          </Link>
          <Typography variant="h4">
            <strong>{getTitle()}</strong>
          </Typography>
        </div>
        {!address ? (
          <>
            <FormHelperText>
              <Trans>
                You must be logged into your wallet to use this feature. Click on the "Connect Wallet" button and try
                again.
              </Trans>
            </FormHelperText>
          </>
        ) : isAccountLoading || isGiveLoading ? (
          <Skeleton />
        ) : !hasAllowance() ? (
          <Box className="help-text">
            <Typography variant="body1" className="stream-note" color="textSecondary">
              <Trans>
                First time donating <b>sOHM</b>?
                <br />
                Please approve Olympus DAO to use your <b>sOHM</b> for donating.
              </Trans>
            </Typography>
          </Box>
        ) : isAmountSet ? (
          <>
            <div className="give-confirmation-details">
              <Typography variant="h5">
                <strong>
                  <Trans>Details</Trans>
                </strong>
              </Typography>
              <div className="details-row">
                <div className="sohm-allocation-col">
                  <Typography variant="body1">
                    <Trans>Your Wallet Address</Trans>
                  </Typography>
                  <Typography variant="h6">
                    <strong>{shorten(address)}</strong>
                  </Typography>
                </div>
                {!isSmallScreen && <ArrowGraphic />}
                <div className="recipient-address-col">
                  <Typography variant="body1">
                    <Trans>Recipient Address</Trans>
                  </Typography>
                  <Typography variant="h6">
                    <strong>{getRecipientTitle()}</strong>
                  </Typography>
                </div>
              </div>
            </div>
            <div className="give-confirmation-divider">
              <Divider />
            </div>
            <div className="give-confirmation-details">
              <Typography variant="h5" className="confirmation-sect-header">
                <strong>
                  <Trans>Transaction</Trans>
                </strong>
              </Typography>
              <div className="details-row">
                <Typography variant="body1">
                  <Trans>Amount</Trans>
                </Typography>
                <Typography variant="h6">
                  <strong>
                    <Trans>{depositAmount} sOHM</Trans>
                  </strong>
                </Typography>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="give-modal-alloc-tip">
              <Typography variant="body1">
                <Trans>sOHM Allocation</Trans>
              </Typography>
              <InfoTooltip
                message={t`Your sOHM will be tansferred into the vault when you submit. You will need to approve the transaction and pay for gas fees.`}
                children={null}
              />
            </div>
            <FormControl className="modal-input" variant="outlined" color="primary">
              <InputLabel htmlFor="amount-input"></InputLabel>
              <OutlinedInput
                id="amount-input"
                type="number"
                placeholder={t`Enter an amount`}
                className="stake-input"
                value={getDepositAmount().isEqualTo(0) ? null : getDepositAmount()}
                error={!isDepositAmountValid}
                onChange={e => handleSetDepositAmount(e.target.value)}
                labelWidth={0}
                startAdornment={
                  <InputAdornment position="start">
                    <div className="logo-holder">{sOhmImg}</div>
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <Button variant="text" onClick={() => handleSetDepositAmount(getMaximumDepositAmount().toFixed())}>
                      <Trans>Max</Trans>
                    </Button>
                  </InputAdornment>
                }
              />
              <FormHelperText>{isDepositAmountValidError}</FormHelperText>
              <div className="give-staked-balance">
                <Typography variant="body2" align="left">
                  <Trans>Your Staked Balance (depositable)</Trans>
                </Typography>
                <Typography variant="body2" align="right">
                  <Trans>{getSOhmBalance().toFixed(4)} sOHM</Trans>
                </Typography>
              </div>
            </FormControl>
            {getRecipientElements()}
            {isCreateMode() ? (
              <div className={`give-education-graphics ${isSmallScreen && "smaller"}`}>
                <WalletGraphic quantity={getRetainedAmountDiff().toFixed()} />
                {!isSmallScreen && <ArrowGraphic />}
                <VaultGraphic quantity={getDepositAmount().toFixed()} />
                {!isSmallScreen && <ArrowGraphic />}
                <YieldGraphic quantity={getDepositAmount().toFixed()} />
              </div>
            ) : (
              <div className="give-education-graphics">
                <CurrPositionGraphic quantity={getCurrentDepositAmount().toFixed()} />
                <NewPositionGraphic quantity={getDepositAmount().toFixed()} />
              </div>
            )}
          </>
        )}
        {isCreateMode() ? (
          !address ? (
            <FormControl className="ohm-modal-submit">
              <Button variant="contained" color="primary" className="connect-button" onClick={handleConnect}>
                <Trans>Connect Wallet</Trans>
              </Button>
            </FormControl>
          ) : address && (hasAllowance() || isGiveLoading) && !isAmountSet ? (
            <FormControl className="ohm-modal-submit">
              <Button variant="contained" color="primary" disabled={!canSubmit()} onClick={handleContinue}>
                <Trans>Continue</Trans>
              </Button>
            </FormControl>
          ) : isAmountSet ? (
            <>
              <FormControl className="ohm-modal-submit">
                <Button
                  variant="contained"
                  color="primary"
                  disabled={hasPendingGiveTxn(pendingTransactions)}
                  onClick={handleGoBack}
                >
                  {txnButtonText(pendingTransactions, PENDING_TXN_GIVE, t`Go Back`)}
                </Button>
              </FormControl>
              <FormControl className="ohm-modal-submit">
                <Button variant="contained" color="primary" disabled={!canSubmit()} onClick={handleSubmit}>
                  {txnButtonText(pendingTransactions, PENDING_TXN_GIVE, t`Confirm sOHM`)}
                </Button>
              </FormControl>
            </>
          ) : (
            <FormControl className="ohm-modal-submit">
              <Button
                variant="contained"
                color="primary"
                disabled={isPendingTxn(pendingTransactions, PENDING_TXN_GIVE_APPROVAL) || isAccountLoading}
                onClick={onSeekApproval}
              >
                {txnButtonText(pendingTransactions, PENDING_TXN_GIVE_APPROVAL, t`Approve`)}
              </Button>
            </FormControl>
          )
        ) : !isAmountSet ? (
          <FormControl className="ohm-modal-submit">
            <Button variant="contained" color="primary" disabled={!canSubmit()} onClick={handleContinue}>
              <Trans>Continue</Trans>
            </Button>
          </FormControl>
        ) : (
          <>
            <FormControl className="ohm-modal-submit">
              <Button
                variant="contained"
                color="primary"
                disabled={hasPendingGiveTxn(pendingTransactions)}
                onClick={handleGoBack}
              >
                {txnButtonText(pendingTransactions, PENDING_TXN_EDIT_GIVE, t`Go Back`)}
              </Button>
            </FormControl>
            <FormControl className="ohm-modal-submit">
              <Button variant="contained" color="primary" disabled={!canSubmit()} onClick={handleSubmit}>
                {txnButtonText(pendingTransactions, PENDING_TXN_EDIT_GIVE, t`Edit Give Amount`)}
              </Button>
            </FormControl>
          </>
        )}
      </Paper>
    </Modal>
  );
}
