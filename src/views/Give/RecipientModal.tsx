import { isAddress } from "@ethersproject/address";
import { t, Trans } from "@lingui/macro";
import { Grid, Link, SvgIcon, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ChevronLeft } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { InfoTooltip, Input, Modal, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber } from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { GiveBox as Box } from "src/components/GiveProject/GiveBox";
import { Project } from "src/components/GiveProject/project.type";
import { NetworkId } from "src/constants";
import { shorten } from "src/helpers";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useWeb3Context } from "src/hooks/web3Context";
import {
  changeApproval,
  changeMockApproval,
  hasPendingGiveTxn,
  PENDING_TXN_GIVE,
  PENDING_TXN_GIVE_APPROVAL,
} from "src/slices/GiveThunk";

import { ArrowGraphic, CompactVault, CompactWallet, CompactYield } from "../../components/EducationCard";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../slices/PendingTxnsSlice";
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
  const { provider, address, networkId } = useWeb3Context();

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

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));

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

  /**
   * Returns the user's sOHM balance
   *
   * Copied from Stake.jsx
   *
   * TODO consider extracting this into a helper file
   */
  const sohmBalance: string = useSelector((state: DonationInfoState) => {
    return networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)
      ? state.account.balances && state.account.balances.mockSohm
      : state.account.balances && state.account.balances.sohm;
  });

  const giveAllowance: number = useSelector((state: DonationInfoState) => {
    return networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)
      ? state.account.mockGiving && state.account.mockGiving.sohmGive
      : state.account.giving && state.account.giving.sohmGive;
  });

  const isAccountLoading: boolean = useSelector((state: DonationInfoState) => {
    return state.account.loading;
  });

  const isGiveLoading: boolean = useSelector((state: DonationInfoState) => {
    return networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)
      ? state.account.mockGiving.loading
      : state.account.giving.loading;
  });

  const pendingTransactions: IPendingTxn[] = useSelector((state: DonationInfoState) => {
    return state.pendingTransactions;
  });

  const onSeekApproval = async () => {
    if (networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)) {
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

  const getRecipientInputField = () => {
    if (isProjectMode()) {
      return <Input id="wallet-input" placeholder={getRecipientTitle()} disabled={true} />;
    }

    return (
      <Input
        id="wallet-input"
        placeholder={t`Enter a wallet address in the form of 0x ...`}
        value={walletAddress}
        error={!isWalletAddressValid}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(e: any) => handleSetWallet(e.target.value)}
        helperText={!isWalletAddressValid ? isWalletAddressValidError : ""}
      />
    );
  };

  const handleClose = () => {
    // Reset state
    setIsAmountSet(false);

    // Fire callback
    cancelFunc();
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

    // Don't display on the first screen
    return <></>;
  };

  const getAmountScreen = () => {
    // If we are loading the state, add a placeholder
    if (isAccountLoading || isGiveLoading) return <Skeleton />;

    // If there is no approval
    if (!hasAllowance()) {
      return (
        <>
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item xs={12}>
              <Typography variant="h6" className="stream-note" color="textSecondary">
                <Trans>
                  Is this your first time donating sOHM? Please approve OlympusDAO to use your sOHM for donating.
                </Trans>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container alignItems="center">
                <Grid item xs />
                <Grid item xs={8}>
                  <PrimaryButton
                    disabled={
                      isPendingTxn(pendingTransactions, PENDING_TXN_GIVE_APPROVAL) || isAccountLoading || !address
                    }
                    onClick={onSeekApproval}
                    fullWidth
                  >
                    {txnButtonText(pendingTransactions, PENDING_TXN_GIVE_APPROVAL, t`Approve`)}
                  </PrimaryButton>
                </Grid>
                <Grid item xs />
              </Grid>
            </Grid>
          </Grid>
        </>
      );
    }

    // Otherwise we let the user enter the amount
    return (
      <>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">
              <Trans>sOHM Allocation</Trans>
              <InfoTooltip
                message={t`Your sOHM will be tansferred into the vault when you submit. You will need to approve the transaction and pay for gas fees.`}
                children={null}
              />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Input
              id="amount-input"
              placeholder={t`Enter an amount`}
              type="number"
              value={getDepositAmount().isEqualTo(0) ? null : getDepositAmount()}
              helperText={
                isDepositAmountValid
                  ? `${t`Your current Staked Balance is`} ${getSOhmBalance().toFixed(2)} sOHM`
                  : isDepositAmountValidError
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => handleSetDepositAmount(e.target.value)}
              error={!isDepositAmountValid}
              startAdornment="sOHM"
              endString={t`Max`}
              endStringOnClick={() => handleSetDepositAmount(getMaximumDepositAmount().toFixed())}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <Trans>Recipient</Trans>
              <InfoTooltip
                message={t`The specified wallet address will receive the rebase yield from the amount that you deposit.`}
                children={null}
              />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {getRecipientInputField()}
          </Grid>
          {!isSmallScreen ? (
            <Grid item xs={12}>
              <Grid container justifyContent="center" alignItems="flex-start" wrap="nowrap">
                <Grid item xs={3}>
                  <CompactWallet quantity={getRetainedAmountDiff().toFixed()} />
                </Grid>
                <Grid item xs={1}>
                  <ArrowGraphic />
                </Grid>
                <Grid item xs={3}>
                  <CompactVault quantity={getDepositAmount().toFixed()} />
                </Grid>
                <Grid item xs={1}>
                  <ArrowGraphic />
                </Grid>
                <Grid item xs={3}>
                  <CompactYield quantity={getDepositAmount().toFixed()} />
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
          <Grid item xs={12}>
            <Grid container justifyContent="center" alignContent="center">
              <Grid item xs />
              <Grid item xs={8}>
                <PrimaryButton disabled={!canSubmit()} onClick={handleContinue} fullWidth>
                  <Trans>Continue</Trans>
                </PrimaryButton>
              </Grid>
              <Grid item xs />
            </Grid>
          </Grid>
        </Grid>
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
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box>
              <Grid container spacing={2} alignItems="center">
                <Grid item container xs={12} sm={4}>
                  <Grid xs={12}>
                    <Typography variant="body1" className="modal-confirmation-title">
                      <Trans>sOHM deposit</Trans>
                      <InfoTooltip
                        message={t`Your sOHM will be tansferred into the vault when you submit. You will need to approve the transaction and pay for gas fees.`}
                        children={null}
                      />
                    </Typography>
                  </Grid>
                  <Grid xs={12}>
                    <Typography variant="h6">
                      <strong>{getDepositAmount().toFixed(2)} sOHM</strong>
                    </Typography>
                  </Grid>
                </Grid>
                {!isSmallScreen ? (
                  <Grid item xs={4}>
                    <ArrowGraphic />
                  </Grid>
                ) : (
                  <></>
                )}
                <Grid item xs={12} sm={4}>
                  {/* On small screens, the current and new sOHM deposit numbers are stacked and left-aligned,
                      whereas on larger screens, the numbers are on opposing sides of the box. This adjusts the
                      alignment accordingly. */}
                  <Grid container direction="column" alignItems={isSmallScreen ? "flex-start" : "flex-end"}>
                    <Grid item xs={12}>
                      <Typography variant="body1" className="modal-confirmation-title">
                        <Trans>Recipient address</Trans>
                        <InfoTooltip
                          message={t`The specified wallet address will receive the rebase yield from the amount that you deposit.`}
                          children={null}
                        />
                      </Typography>
                    </Grid>
                    <Grid xs={12}>
                      {/* 5px to align with the padding on the tooltip */}
                      <Typography variant="h6" style={{ paddingRight: "5px" }}>
                        <strong>{getRecipientTitle()}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs />
              <Grid item xs={8}>
                <PrimaryButton disabled={!canSubmit()} onClick={handleSubmit} fullWidth>
                  {txnButtonText(
                    pendingTransactions,
                    PENDING_TXN_GIVE,
                    `${t`Confirm `} ${getDepositAmount().toFixed(2)} sOHM`,
                  )}
                </PrimaryButton>
              </Grid>
              <Grid item xs />
            </Grid>
          </Grid>
        </Grid>
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
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      headerText={getTitle()}
      closePosition="right"
      topLeft={getEscapeComponent()}
      className={`ohm-modal ${isSmallScreen ? "smaller" : ""}`}
      minHeight="300px"
    >
      {shouldShowConfirmationScreen() ? getConfirmationScreen() : getAmountScreen()}
    </Modal>
  );
}
