import { isAddress } from "@ethersproject/address";
import { Box, Link, Modal, Paper, SvgIcon, Typography } from "@material-ui/core";
import { FormControl, FormHelperText, InputAdornment } from "@material-ui/core";
import { InputLabel } from "@material-ui/core";
import { OutlinedInput } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Input, PrimaryButton, TextButton } from "@olympusdao/component-library";
import { BigNumber } from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Project } from "src/components/GiveProject/project.type";
import { useWeb3Context } from "src/hooks/web3Context";
import {
  changeApproval,
  changeMockApproval,
  hasPendingGiveTxn,
  PENDING_TXN_GIVE,
  PENDING_TXN_GIVE_APPROVAL,
} from "src/slices/GiveThunk";

import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import { ArrowGraphic, VaultGraphic, WalletGraphic, YieldGraphic } from "../../components/EducationCard";
import { getTokenImage } from "../../helpers";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../slices/PendingTxnsSlice";
const sOhmImg = getTokenImage("sohm");
import { t, Trans } from "@lingui/macro";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ChevronLeft } from "@material-ui/icons";
import { InfoTooltip } from "@olympusdao/component-library";
import { useLocation } from "react-router-dom";
import { NetworkId } from "src/constants";
import { shorten } from "src/helpers";
import { EnvHelper } from "src/helpers/Environment";

import { CancelCallback, DonationInfoState, SubmitCallback } from "./Interfaces";

type RecipientModalProps = {
  isModalOpen: boolean;
  eventSource: string;
  callbackFunc: SubmitCallback;
  cancelFunc: CancelCallback;
  project?: Project;
};

export function RecipientModal({ isModalOpen, eventSource, callbackFunc, cancelFunc, project }: RecipientModalProps) {
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
    return _initialDepositAmount;
  };
  const [depositAmount, setDepositAmount] = useState(getInitialDepositAmount());
  const [isDepositAmountValid, setIsDepositAmountValid] = useState(_initialDepositAmountValid);
  const [isDepositAmountValidError, setIsDepositAmountValidError] = useState(_initialDepositAmountValidError);

  const getInitialWalletAddress = () => {
    return _initialWalletAddress;
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

  const handleModalInsideClick = (e: React.MouseEvent): void => {
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
  const sohmBalance: string = useSelector((state: DonationInfoState) => {
    return networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.balances && state.account.balances.mockSohm
      : state.account.balances && state.account.balances.sohm;
  });

  const giveAllowance: number = useSelector((state: DonationInfoState) => {
    return networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.mockGiving && state.account.mockGiving.sohmGive
      : state.account.giving && state.account.giving.sohmGive;
  });

  const isAccountLoading: boolean = useSelector((state: DonationInfoState) => {
    return state.account.loading;
  });

  const isGiveLoading: boolean = useSelector((state: DonationInfoState) => {
    return networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.mockGiving.loading
      : state.account.giving.loading;
  });

  const pendingTransactions: IPendingTxn[] = useSelector((state: DonationInfoState) => {
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
   * This is equal to the current wallet balance.
   *
   * @returns BigNumber
   */
  const getMaximumDepositAmount = (): BigNumber => {
    return new BigNumber(sohmBalance);
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
      setIsDepositAmountValidError(t`Value cannot be more than your sOHM balance of ${getMaximumDepositAmount()}`);
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

  const isProjectMode = (): boolean => {
    if (project) return true;

    return false;
  };

  const getTitle = (): string => {
    return t`Donate Yield`;
  };

  /**
   * Indicates whether the form can be submitted.
   *
   * This will return false if:
   * - the deposit amount is invalid
   * - the wallet address is invalid
   * - there is no sender address
   * - an add/edit transaction is pending
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

    return true;
  };

  /**
   * Indicates the amount retained in the user's wallet after a deposit to the vault.
   *
   * If a yield direction is being created, it returns the current sOHM balance minus the entered deposit.
   *
   * @returns BigNumber instance
   */
  const getRetainedAmountDiff = (): BigNumber => {
    return new BigNumber(sohmBalance).minus(getDepositAmount());
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

    callbackFunc(getWalletAddress(), eventSource, depositAmountBig, getDepositAmount());
  };

  const getRecipientElements = () => {
    // If project mode is enabled, the amount is editable, but the recipient is not
    if (isProjectMode()) {
      return (
        <>
          <div className="project-modal-top">
            <Typography variant="body1">
              <Trans>Recipient</Trans>
            </Typography>
          </div>
          <Input id="wallet-input" label={getRecipientTitle()} disabled={true} />
        </>
      );
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

  const getEscapeComponent = () => {
    // If on the confirmation screen, we provide a chevron to go back a step
    if (shouldShowConfirmationScreen()) {
      return (
        <Link onClick={() => handleGoBack()}>
          <SvgIcon color="primary" component={ChevronLeft} />
        </Link>
      );
    }

    // Otherwise an "x" to close the modal
    return (
      <Link onClick={() => cancelFunc()}>
        <SvgIcon color="primary" component={XIcon} />
      </Link>
    );
  };

  const getAmountScreen = () => {
    // If there is no connected wallet, then the user cannot proceed
    if (!address) {
      return (
        <>
          <FormHelperText>
            <Trans>
              You must be logged into your wallet to use this feature. Click on the "Connect Wallet" button and try
              again.
            </Trans>
          </FormHelperText>
          <FormControl className="ohm-modal-submit">
            <PrimaryButton onClick={handleConnect}>
              <Trans>Connect Wallet</Trans>
            </PrimaryButton>
          </FormControl>
        </>
      );
    }

    // If we are loading the state, add a placeholder
    if (isAccountLoading || isGiveLoading) return <Skeleton />;

    // If there is no approval
    if (!hasAllowance()) {
      return (
        <>
          <Box className="help-text">
            <Typography variant="h6" className="stream-note" color="textSecondary">
              <Trans>
                Is this your first time donating sOHM? Please approve OlympusDAO to use your sOHM for donating.
              </Trans>
            </Typography>
          </Box>
          <FormControl className="ohm-modal-submit">
            <PrimaryButton
              disabled={isPendingTxn(pendingTransactions, PENDING_TXN_GIVE_APPROVAL) || isAccountLoading}
              onClick={onSeekApproval}
            >
              {txnButtonText(pendingTransactions, PENDING_TXN_GIVE_APPROVAL, t`Approve`)}
            </PrimaryButton>
          </FormControl>
        </>
      );
    }

    // Otherwise we let the user enter the amount
    return (
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
                <TextButton onClick={() => handleSetDepositAmount(getMaximumDepositAmount().toFixed())}>
                  <Trans>Max</Trans>
                </TextButton>
              </InputAdornment>
            }
          />
          <FormHelperText>{isDepositAmountValidError}</FormHelperText>
          <div className="give-staked-balance">
            <Typography variant="body2" align="left">
              {`${t`Your current Staked Balance is `} ${getSOhmBalance().toFixed(2)} sOHM`}
            </Typography>
          </div>
        </FormControl>
        {getRecipientElements()}
        {
          /* We collapse the education graphics on mobile screens */
          !isSmallScreen ? (
            <div className={`give-education-graphics`}>
              <WalletGraphic quantity={getRetainedAmountDiff().toFixed()} />
              {!isSmallScreen && <ArrowGraphic />}
              <VaultGraphic quantity={getDepositAmount().toFixed()} small={false} />
              {!isSmallScreen && <ArrowGraphic />}
              <YieldGraphic quantity={getDepositAmount().toFixed()} />
            </div>
          ) : (
            <></>
          )
        }
        <FormControl className="ohm-modal-submit">
          <PrimaryButton disabled={!canSubmit()} onClick={handleContinue}>
            <Trans>Continue</Trans>
          </PrimaryButton>
        </FormControl>
      </>
    );
  };

  /**
   * Indicates whether the confirmation screen should be displayed.
   *
   * The confirmation screen is displayed if the amount is set.
   *
   * @returns boolean
   */
  const shouldShowConfirmationScreen = () => {
    return isAmountSet;
  };

  const getConfirmationScreen = () => {
    return (
      <>
        <Box
          className="give-confirmation-details"
          style={{ border: "1px solid #999999", borderRadius: "10px", padding: "20px" }}
        >
          <div className="details-row">
            <div className="sohm-allocation-col">
              <Typography variant="body1">
                <Trans>sOHM deposit</Trans>
              </Typography>
              <Typography variant="h6">{getDepositAmount().toFixed(2)} sOHM</Typography>
            </div>
            {!isSmallScreen && <ArrowGraphic />}
            <div className="recipient-address-col">
              <Typography variant="body1">
                <Trans>Recipient address</Trans>
              </Typography>
              <Typography variant="h6">
                <strong>{getRecipientTitle()}</strong>
              </Typography>
            </div>
          </div>
        </Box>{" "}
        <FormControl className="ohm-modal-submit">
          <PrimaryButton disabled={!canSubmit()} onClick={handleSubmit}>
            {txnButtonText(
              pendingTransactions,
              PENDING_TXN_GIVE,
              `${t`Confirm `} ${getDepositAmount().toFixed(2)} sOHM`,
            )}
          </PrimaryButton>
        </FormControl>
      </>
    );
  };

  // NOTE: the following warning is caused by the amount-input field:
  // Warning: `value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.%s
  // This is caused by this line (currently 423):
  // value={getDepositAmount().isEqualTo(0) ? null : getDepositAmount()}
  // If we set the value to an empty string instead of null, any decimal number that is entered will not be accepted
  // This appears to be due to the following bug (which is still not resolved);
  // https://github.com/facebook/react/issues/11877

  return (
    /* modal-container displays a background behind the ohm-card container, which means that if modal-container receives a click, we can close the modal */
    <Modal className="modal-container" open={isModalOpen} onClose={cancelFunc} onClick={cancelFunc} hideBackdrop={true}>
      <Paper className={`ohm-card ohm-modal ${isSmallScreen ? "smaller" : ""}`} onClick={handleModalInsideClick}>
        <div className="yield-header">
          {getEscapeComponent()}
          <Typography variant="h4">
            <strong>{getTitle()}</strong>
          </Typography>
        </div>
        {shouldShowConfirmationScreen() ? getConfirmationScreen() : getAmountScreen()}
      </Paper>
    </Modal>
  );
}
