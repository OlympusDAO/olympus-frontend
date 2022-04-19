import { isAddress } from "@ethersproject/address";
import { t, Trans } from "@lingui/macro";
import { Grid, Link, SvgIcon, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ChevronLeft } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { InfoTooltip, Input, Modal, PrimaryButton } from "@olympusdao/component-library";
import { useEffect, useMemo, useState } from "react";
import { Project } from "src/components/GiveProject/project.type";
import { GiveTokenAllowanceGuard } from "src/components/TokenAllowanceGuard/TokenAllowanceGuard";
import { NetworkId } from "src/constants";
import { GIVE_ADDRESSES, SOHM_ADDRESSES } from "src/constants/addresses";
import { shorten } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useSohmBalance } from "src/hooks/useBalance";
import { useWeb3Context } from "src/hooks/web3Context";

import { ArrowGraphic, CompactVault, CompactWallet, CompactYield } from "../../components/EducationCard";
import { CancelCallback, SubmitCallback } from "./Interfaces";

type RecipientModalProps = {
  isModalOpen: boolean;
  isMutationLoading: boolean;
  eventSource: string;
  callbackFunc: SubmitCallback;
  cancelFunc: CancelCallback;
  project?: Project;
};

const DECIMAL_PLACES = 2;
const ZERO_NUMBER = new DecimalBigNumber("0");
const EXACT_FORMAT = { format: true };

export function RecipientModal({
  isModalOpen,
  isMutationLoading,
  eventSource,
  callbackFunc,
  cancelFunc,
  project,
}: RecipientModalProps) {
  const { address, networkId } = useWeb3Context();

  const _initialDepositAmount = "0";
  const _initialWalletAddress = "";
  const _initialDepositAmountValid = false;
  const _initialDepositAmountValidError = "";
  const _initialWalletAddressValid = false;
  const _initialWalletAddressValidError = "";
  const _initialIsAmountSet = false;

  /**
   * depositAmount is kept as a string, to avoid unnecessary application of number rules while being edited
   */
  const [depositAmount, setDepositAmount] = useState(_initialDepositAmount);
  const [isDepositAmountValid, setIsDepositAmountValid] = useState(_initialDepositAmountValid);
  const [isDepositAmountValidError, setIsDepositAmountValidError] = useState(_initialDepositAmountValidError);

  const [walletAddress, setWalletAddress] = useState(_initialWalletAddress);
  const [isWalletAddressValid, setIsWalletAddressValid] = useState(_initialWalletAddressValid);
  const [isWalletAddressValidError, setIsWalletAddressValidError] = useState(_initialWalletAddressValidError);

  const [isAmountSet, setIsAmountSet] = useState(_initialIsAmountSet);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const themedArrow =
    theme.palette.type === "dark" && theme.colors.primary[300]
      ? theme.colors.primary[300]
      : theme.palette.text.secondary;

  useEffect(() => {
    checkIsDepositAmountValid(getDepositAmount().toString());
    checkIsWalletAddressValid(getWalletAddress());
  }, []);

  useEffect(() => {
    // When we close the modal, we ensure that the state is also reset to default
    if (!isModalOpen) {
      handleSetDepositAmount(_initialDepositAmount);
      handleSetWallet(_initialWalletAddress);
      setIsAmountSet(_initialIsAmountSet);
    }
  }, [isModalOpen]);

  const _useSohmBalance =
    useSohmBalance()[networkId == NetworkId.MAINNET ? NetworkId.MAINNET : NetworkId.TESTNET_RINKEBY];
  const sohmBalance: DecimalBigNumber = useMemo(() => {
    if (_useSohmBalance.isLoading || _useSohmBalance.data === undefined) return new DecimalBigNumber("0");

    return _useSohmBalance.data;
  }, [_useSohmBalance]);
  const isBalanceLoading = _useSohmBalance.isLoading;

  /**
   * Returns the maximum deposit that can be directed to the recipient.
   *
   * This is equal to the current wallet balance.
   *
   * @returns DecimalBigNumber
   */
  const getMaximumDepositAmount = (): DecimalBigNumber => {
    return sohmBalance;
  };

  const handleSetDepositAmount = (value: string) => {
    checkIsDepositAmountValid(value);
    setDepositAmount(value);
  };

  const checkIsDepositAmountValid = (value: string) => {
    const valueNumber = new DecimalBigNumber(value);
    const zeroNumber = ZERO_NUMBER;

    if (!value || value == "" || valueNumber.eq(zeroNumber)) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError(t`Please enter a value`);
      return;
    }

    if (valueNumber.lt(zeroNumber)) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError(t`Value must be positive`);
      return;
    }

    if (sohmBalance.eq(zeroNumber)) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError(t`You must have a balance of sOHM (staked OHM) to continue`);
    }

    if (valueNumber.gt(getMaximumDepositAmount())) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError(
        t`Value cannot be more than your sOHM balance of ${getMaximumDepositAmount().toString(EXACT_FORMAT)}`,
      );
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

    if (isBalanceLoading) return false;

    // The wallet address is only set when a project is not given
    if (!isProjectMode() && !isWalletAddressValid) return false;

    if (!address) return false;

    if (isMutationLoading) return false;

    return true;
  };

  /**
   * Indicates the amount retained in the user's wallet after a deposit to the vault.
   *
   * If a yield direction is being created, it returns the current sOHM balance minus the entered deposit.
   *
   * @returns DecimalBigNumber instance
   */
  const getRetainedAmountDiff = (): DecimalBigNumber => {
    return sohmBalance.sub(getDepositAmount());
  };

  /**
   * Ensures that the depositAmount returned is a valid number.
   *
   * @returns
   */
  const getDepositAmount = (): DecimalBigNumber => {
    if (!depositAmount) return ZERO_NUMBER;

    return new DecimalBigNumber(depositAmount);
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
    const depositAmountBig = new DecimalBigNumber(depositAmount);

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
    if (isBalanceLoading) return <Skeleton />;

    // Let the user enter the amount, but implement allowance guard
    return (
      <>
        <Grid container alignItems="center" spacing={2}>
          <GiveTokenAllowanceGuard
            tokenAddressMap={SOHM_ADDRESSES}
            spenderAddressMap={GIVE_ADDRESSES}
            message={
              <>
                <Trans>Is this your first time donating</Trans> <b>sOHM</b>?{" "}
                <Trans>Please approve Olympus DAO to use your</Trans> <b>sOHM</b> <Trans>for donating</Trans>.
              </>
            }
          >
            <Grid item xs={6} style={{ paddingBottom: "0px" }}>
              <Typography variant="body2" className="subtext">
                <Trans>sOHM Deposit</Trans>
                <InfoTooltip
                  message={t`Your sOHM will be tansferred into the vault when you submit. You will need to approve the transaction and pay for gas fees.`}
                  children={null}
                />
              </Typography>
            </Grid>
            <Grid item xs={6} style={{ paddingBottom: "0px" }}>
              <Typography align="right" variant="body2" className="subtext">{t`Balance: ${sohmBalance.toString({
                decimals: DECIMAL_PLACES,
                format: true,
              })} sOHM`}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Input
                id="amount-input"
                placeholder={t`Enter an amount`}
                type="number"
                // We used to use BigNumber/DecimalBigNumber here, but it behaves
                // weirdly and would refuse to recognise some numbers, e.g. 100
                // Better to keep it simple
                value={depositAmount}
                helperText={
                  isDepositAmountValid
                    ? `${t`Your current Staked Balance is`} ${sohmBalance.toString(EXACT_FORMAT)} sOHM`
                    : isDepositAmountValidError
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e: any) => handleSetDepositAmount(e.target.value)}
                error={!isDepositAmountValid}
                startAdornment="sOHM"
                endString={t`Max`}
                endStringOnClick={() => handleSetDepositAmount(getMaximumDepositAmount().toString())}
              />
            </Grid>
            <Grid item xs={12} style={{ paddingBottom: "0px" }}>
              <Typography variant="body2" className="subtext">
                <Trans>Recipient Address</Trans>
                <InfoTooltip
                  message={t`The rebase rewards from the sOHM that you deposit will be redirected to the wallet address that you specify`}
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
                    {/**
                     * Wallet balances are rarely whole numbers, so we give an approximate number here.
                     *
                     * For the numbers related to what the user is depositing, we give exact numbers.
                     */}
                    <CompactWallet
                      quantity={getRetainedAmountDiff().toString({
                        decimals: DECIMAL_PLACES,
                        format: true,
                      })}
                      isQuantityExact={false}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <ArrowGraphic fill={themedArrow} />
                  </Grid>
                  <Grid item xs={3}>
                    {/* This is deliberately a specific value */}
                    <CompactVault quantity={getDepositAmount().toString(EXACT_FORMAT)} isQuantityExact={true} />
                  </Grid>
                  <Grid item xs={1}>
                    <ArrowGraphic fill={themedArrow} />
                  </Grid>
                  <Grid item xs={3}>
                    {/* This is deliberately a specific value */}
                    <CompactYield quantity={getDepositAmount().toString(EXACT_FORMAT)} isQuantityExact={true} />
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
          </GiveTokenAllowanceGuard>
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
            <Grid container spacing={2} alignItems="center">
              <Grid item container xs={12} sm={4} alignItems="center">
                <Grid xs={12}>
                  <Typography variant="body1" className="grey-text">
                    <Trans>sOHM Deposit</Trans>
                    <InfoTooltip
                      message={t`Your sOHM will be tansferred into the vault when you submit. You will need to approve the transaction and pay for gas fees.`}
                      children={null}
                    />
                  </Typography>
                </Grid>
                <Grid xs={12}>
                  <Typography variant="h6">
                    {/* As this is the amount being deposited, the user needs to see the exact amount. */}
                    <strong>{getDepositAmount().toString(EXACT_FORMAT)}</strong>
                  </Typography>
                </Grid>
              </Grid>
              {!isSmallScreen ? (
                <Grid item xs={4}>
                  <ArrowGraphic fill={themedArrow} />
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
                    <Typography variant="body1" className="grey-text">
                      <Trans>Recipient Address</Trans>
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
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs />
              <Grid item xs={8}>
                <PrimaryButton disabled={!canSubmit()} onClick={handleSubmit} fullWidth>
                  {/* We display the exact amount being deposited. */}
                  {isMutationLoading
                    ? t`Depositing sOHM`
                    : `${t`Confirm `} ${getDepositAmount().toString(EXACT_FORMAT)} sOHM`}
                </PrimaryButton>
              </Grid>
              <Grid item xs />
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      headerText={getTitle()}
      closePosition="right"
      topLeft={getEscapeComponent()}
      minHeight="300px"
    >
      {shouldShowConfirmationScreen() ? getConfirmationScreen() : getAmountScreen()}
    </Modal>
  );
}
