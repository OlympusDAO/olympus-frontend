import { isAddress } from "@ethersproject/address";
import { t, Trans } from "@lingui/macro";
import { ChevronLeft } from "@mui/icons-material";
import { Grid, Link, SvgIcon, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataRow, InfoTooltip, Input, Modal, PrimaryButton, TertiaryButton } from "@olympusdao/component-library";
import { useEffect, useMemo, useState } from "react";
import { ArrowGraphic } from "src/components/EducationCard";
import { TopBottomGiveBox } from "src/components/GiveProject/GiveBox";
import { Project, RecordType } from "src/components/GiveProject/project.type";
import { isChainEthereum, shorten } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useGohmBalance, useSohmBalance } from "src/hooks/useBalance";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useRecipientInfo } from "src/hooks/useGiveInfo";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { ChangeAssetType } from "src/slices/interfaces";
import { GIVE_MAX_DECIMAL_FORMAT, GIVE_MAX_DECIMALS } from "src/views/Give/constants";
import { GohmToggle } from "src/views/Give/GohmToggle";
import { checkDecimalLength, removeTrailingZeros } from "src/views/Give/helpers/checkDecimalLength";
import { GetCorrectContractUnits, GetCorrectStaticUnits } from "src/views/Give/helpers/GetCorrectUnits";
import { CancelCallback, SubmitEditCallback, WithdrawSubmitCallback } from "src/views/Give/Interfaces";
import { useAccount, useNetwork } from "wagmi";

type ManageModalProps = {
  isModalOpen: boolean;
  isMutationLoading: boolean;
  eventSource: string;
  submitEdit: SubmitEditCallback;
  submitWithdraw: WithdrawSubmitCallback;
  cancelFunc: CancelCallback;
  project?: Project;
  currentDepositId: string;
  currentWalletAddress: string;
  currentDepositAmount: string; // As per IUserDonationInfo
  depositDate: string;
  giveAssetType: string;
  changeAssetType: ChangeAssetType;
  rebasesSent: string;
  recordType?: string;
};

const DECIMAL_PLACES = 4;
const ZERO_NUMBER: DecimalBigNumber = new DecimalBigNumber("0");
const DECIMAL_FORMAT = { decimals: DECIMAL_PLACES, format: true };
const PERCENT_FORMAT = { decimals: 0, format: true };
const EXACT_FORMAT = { decimals: GIVE_MAX_DECIMALS, format: true };

export function ManageDonationModal({
  isModalOpen,
  isMutationLoading,
  eventSource,
  submitEdit,
  submitWithdraw,
  cancelFunc,
  project,
  currentDepositId,
  currentDepositAmount,
  depositDate,
  giveAssetType,
  changeAssetType,
  rebasesSent,
  recordType = RecordType.PROJECT,
}: ManageModalProps) {
  const { address = "" } = useAccount();
  const { chain = { id: 1 } } = useNetwork();
  const networks = useTestableNetworks();
  const [isEditing, setIsEditing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const { data: currentIndex } = useCurrentIndex();

  const _useRecipientInfo = useRecipientInfo(project ? project.wallet : "");
  const totalDebt: DecimalBigNumber = useMemo(() => {
    if (_useRecipientInfo.isLoading || !_useRecipientInfo.data) return new DecimalBigNumber("0");

    return GetCorrectContractUnits(_useRecipientInfo.data.gohmDebt, giveAssetType, currentIndex);
  }, [_useRecipientInfo, giveAssetType, currentIndex]);

  useEffect(() => {
    checkIsWalletAddressValid(getWalletAddress());
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      // When we close the modal, we ensure button click states are reset
      setIsEditing(false);
      setIsWithdrawing(false);
      setIsAmountSet(false);
    }
  }, [isModalOpen]);

  /**
   * _initialDepositAmount is kept as a string, to avoid unnecessary application of number rules while being edited
   */
  const _initialDepositAmount = "";
  const _initialWalletAddress = "";
  const _initialDepositAmountValid = false;
  const _initialDepositAmountValidError = "";
  const _initialWalletAddressValid = false;
  const _initialIsAmountSet = false;

  const getInitialDepositAmount = (): string => {
    return currentDepositAmount
      ? GetCorrectContractUnits(currentDepositAmount.toString(), giveAssetType, currentIndex).toString(
          GIVE_MAX_DECIMAL_FORMAT,
        )
      : _initialDepositAmount;
  };
  const [depositAmount, setDepositAmount] = useState(removeTrailingZeros(getInitialDepositAmount()));
  const [isDepositAmountValid, setIsDepositAmountValid] = useState(_initialDepositAmountValid);
  const [isDepositAmountValidError, setIsDepositAmountValidError] = useState(_initialDepositAmountValidError);

  const [walletAddress] = useState(_initialWalletAddress);
  const [isWalletAddressValid, setIsWalletAddressValid] = useState(_initialWalletAddressValid);

  const [isAmountSet, setIsAmountSet] = useState(_initialIsAmountSet);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const themedArrow =
    theme.palette.mode === "dark" && theme.colors.primary[300]
      ? theme.colors.primary[300]
      : theme.palette.text.secondary;
  const boxBorder = theme.palette.grey[500];

  const _useSohmBalance =
    useSohmBalance()[isChainEthereum({ chainId: chain.id, includeTestnets: true }) ? networks.MAINNET : 1];
  const sohmBalance: DecimalBigNumber = useMemo(() => {
    if (_useSohmBalance.isLoading || _useSohmBalance.data === undefined) return new DecimalBigNumber("0");

    return _useSohmBalance.data;
  }, [_useSohmBalance]);

  // Setting this to only read Ethereum or Ethereum testnet balances, but not sure if that is the right behavior
  const _useGohmBalance =
    useGohmBalance()[isChainEthereum({ chainId: chain.id, includeTestnets: true }) ? networks.MAINNET : 1];

  const gohmBalance: DecimalBigNumber = useMemo(() => {
    if (_useGohmBalance.isLoading || _useGohmBalance.data == undefined) return new DecimalBigNumber("0");

    return _useGohmBalance.data;
  }, [_useGohmBalance]);

  useEffect(() => {
    setDepositAmount(getInitialDepositAmount());
  }, [giveAssetType]);

  /**
   * Returns the wallet address. If a project is defined, it uses the
   * project wallet, else what was passed in as a parameter.
   */
  const getWalletAddress = (): string => {
    if (project) return project.wallet;

    return walletAddress;
  };

  const getDepositAmount = (): DecimalBigNumber => {
    if (!depositAmount) return ZERO_NUMBER;

    return new DecimalBigNumber(depositAmount);
  };

  const getCurrentDepositAmount = (): DecimalBigNumber => {
    if (!currentDepositAmount) return ZERO_NUMBER;

    const correctUnitCurrDeposit = GetCorrectContractUnits(
      currentDepositAmount.toString(),
      giveAssetType,
      currentIndex,
    );
    return correctUnitCurrDeposit;
  };

  const getDepositAmountDiff = (): DecimalBigNumber => {
    // We can't trust the accuracy of floating point arithmetic of standard JS libraries, so we use BigNumber
    return getDepositAmount().sub(getCurrentDepositAmount());
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
      return;
    }

    if (value == address) {
      setIsWalletAddressValid(false);
      return;
    }

    setIsWalletAddressValid(true);
  };

  const handleEditSubmit = () => {
    submitEdit(getWalletAddress(), currentDepositId, eventSource, getCurrentDepositAmount(), getDepositAmountDiff());
  };

  const handleWithdrawSubmit = () => {
    submitWithdraw(getWalletAddress(), currentDepositId, eventSource, getCurrentDepositAmount());
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

    // The wallet address is only set when a project is not given
    if (!project && !isWalletAddressValid) return false;

    if (!address) return false;
    if (getDepositAmountDiff().eq(ZERO_NUMBER)) return false;

    if (isMutationLoading) return false;

    return true;
  };

  const canWithdraw = () => {
    if (!address) return false;

    if (isMutationLoading) return false;

    return true;
  };

  const getBalance = (): DecimalBigNumber => {
    return giveAssetType === "sOHM" ? sohmBalance : gohmBalance;
  };

  const getRebasesSent = (): DecimalBigNumber => {
    return GetCorrectContractUnits(rebasesSent, giveAssetType, currentIndex);
  };

  /**
   * Returns the maximum deposit that can be directed to the recipient.
   *
   * This is equal to the current wallet balance and the current deposit amount (in the vault).
   *
   * @returns DecimalBigNumber
   */
  const getMaximumDepositAmount = (): DecimalBigNumber => {
    return getBalance().add(currentDepositAmount ? getCurrentDepositAmount() : ZERO_NUMBER);
  };

  const handleSetDepositAmount = (value: string) => {
    const value_ = checkDecimalLength(value);

    checkIsDepositAmountValid(value);

    setDepositAmount(value_);
  };

  const checkIsDepositAmountValid = (value: string) => {
    const valueNumber = new DecimalBigNumber(value);

    if (!value || value == "" || valueNumber.eq(ZERO_NUMBER)) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError(t`Please enter a value`);
      return;
    }

    if (valueNumber.lt(ZERO_NUMBER)) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError(t`Value must be positive`);
      return;
    }

    if (getBalance().eq(ZERO_NUMBER)) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError(t`You must have a balance of ${giveAssetType} to continue`);
    }

    if (getDepositAmountDiff().gt(getBalance())) {
      setIsDepositAmountValid(false);
      setIsDepositAmountValidError(
        t`Value cannot be more than your ${giveAssetType} balance of ${getMaximumDepositAmount().toString(
          EXACT_FORMAT,
        )}`,
      );
      return;
    }

    setIsDepositAmountValid(true);
    setIsDepositAmountValidError("");
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

  const getModalTitle = (): string => {
    if (isEditing) {
      return "Edit";
    } else if (isWithdrawing) {
      return "Stop";
    } else {
      return "Manage";
    }
  };

  const handleGoBack = () => {
    if (isAmountSet) {
      setIsAmountSet(false);
    } else if (isEditing) {
      setIsEditing(false);
    } else if (isWithdrawing) {
      setIsWithdrawing(false);
    }
  };

  const handleClose = () => {
    // Reset state
    setIsAmountSet(false);
    setIsEditing(false);
    setIsWithdrawing(false);

    // Fire callback
    cancelFunc();
  };

  const getEscapeComponent = () => {
    // If on the edit/stop/confirmation screen, we provide a chevron to go back a step
    if (shouldShowEditConfirmationScreen() || shouldShowEditScreen() || shouldShowStopScreen()) {
      return (
        <Link onClick={() => handleGoBack()}>
          <SvgIcon color="primary" component={ChevronLeft} />
        </Link>
      );
    }

    // Don't display on the first screen
    return <></>;
  };

  /**
   * Content for initial screen (not editing or withdrawing)
   */
  const getInitialScreen = () => {
    return (
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <GohmToggle giveAssetType={giveAssetType} changeAssetType={changeAssetType} />
          {getRecipientDetails()}
        </Grid>
        {recordType === RecordType.PROJECT ? (
          <Grid item xs={12}>
            {getProjectStats()}
          </Grid>
        ) : (
          <></>
        )}
        <Grid item xs={12}>
          {getDonationDetails()}
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs />
            <Grid item xs={5}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <PrimaryButton data-testid="edit-donation" size="medium" onClick={() => setIsEditing(true)} fullWidth>
                    <Trans>Edit Donation</Trans>
                  </PrimaryButton>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TertiaryButton
                    data-testid="stop-donation"
                    size="medium"
                    onClick={() => setIsWithdrawing(true)}
                    fullWidth
                  >
                    <Trans>Stop Donation</Trans>
                  </TertiaryButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  /**
   * Elements to display project statistics, such as donation sOHM, rebases and goal achievement.
   */
  const getProjectStats = () => {
    // Has to have a default value of 1 because it is used in division
    const depositGoalNumber =
      project && currentIndex
        ? GetCorrectStaticUnits(project.depositGoal.toString(), giveAssetType, currentIndex)
        : new DecimalBigNumber("1", GIVE_MAX_DECIMALS);

    return (
      <TopBottomGiveBox borderColor={boxBorder}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h6" align="center" className="subtext">
              {isSmallScreen ? "Goal" : `${giveAssetType} ${t` Goal`}`}
            </Typography>
            <Typography data-testid="goal" variant="h5" align="center">
              {project
                ? GetCorrectStaticUnits(project.depositGoal.toString(), giveAssetType, currentIndex).toString(
                    DECIMAL_FORMAT,
                  )
                : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" align="center" className="subtext">
              {isSmallScreen ? `${t`Total `} ${giveAssetType}` : `${t`Total `} ${giveAssetType} ${t` Donated`}`}
            </Typography>
            <Typography data-testid="total-donated" variant="h5" align="center">
              {project ? totalDebt.toString(DECIMAL_FORMAT) : "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6" align="center" className="subtext">
              {isSmallScreen ? "% of Goal" : `% of ${giveAssetType} Goal`}
            </Typography>
            <Typography data-testid="goal-completion" variant="h5" align="center">
              {project
                ? totalDebt
                    .mul(new DecimalBigNumber("100"))
                    .div(depositGoalNumber, GIVE_MAX_DECIMALS)
                    .toString(PERCENT_FORMAT) + "%"
                : "N/A"}
            </Typography>
          </Grid>
        </Grid>
      </TopBottomGiveBox>
    );
  };

  /**
   * Returns elements detailing the user's donation
   */
  const getDonationDetails = () => {
    return (
      <>
        <Typography variant="h5">Donation Details</Typography>
        <DataRow title={t`Date`} balance={depositDate} />
        <DataRow title={t`Recipient`} balance={getRecipientTitle()} />
        <DataRow
          title={t`Deposited`}
          id="deposited"
          balance={`${getCurrentDepositAmount().toString(DECIMAL_FORMAT)} ${giveAssetType}`}
        />
        <DataRow
          title={t`Donated`}
          id="rebases-sent"
          balance={`${getRebasesSent().toString(DECIMAL_FORMAT)} ${giveAssetType}`}
        />
      </>
    );
  };

  /**
   * Renders the details of the recipient, whether a project or custom recipient.
   */
  const getRecipientDetails = () => {
    if (project) {
      return (
        <Grid container spacing={2} style={{ paddingTop: "5px" }}>
          <Grid item xs={3}>
            <Grid
              container
              alignContent="center"
              style={{ maxHeight: "72px", overflow: "hidden", borderRadius: "16px" }}
            >
              <Grid item xs>
                <img width="100%" src={`${process.env.PUBLIC_URL}${project.photos[0]}`} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h5">{getRecipientTitle()}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">{project.shortDescription}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <Typography variant="h6">Custom Recipient</Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="body2">{walletAddress}</Typography>
        </Grid>
      </Grid>
    );
  };

  /**
   * Indicates whether the edit confirmation screen should be displayed.
   *
   * The edit confirmation screen is displayed if the amount is set.
   *
   * @returns boolean
   */
  const shouldShowEditConfirmationScreen = () => {
    return isAmountSet;
  };

  /**
   * Edit screen before altering the amount
   */
  const shouldShowEditScreen = () => {
    return isEditing && !isAmountSet;
  };

  /**
   * Stop/withdraw screen
   */
  const shouldShowStopScreen = () => {
    return isWithdrawing;
  };

  const getEditDonationScreen = () => {
    return (
      <Grid container spacing={1}>
        <GohmToggle giveAssetType={giveAssetType} changeAssetType={changeAssetType} />
        <Grid item xs={6}>
          <Typography variant="body1" className="subtext">
            <Trans>New</Trans> {giveAssetType} <Trans>Amount</Trans>
            <InfoTooltip
              message={`${t`Your `} ${giveAssetType} ${t` will be tansferred into the vault when you submit. You will need to approve the transaction and pay for gas fees.`}`}
              children={null}
            />
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography align="right" variant="body1" className="subtext">{t`Balance: ${getBalance().toString({
            decimals: DECIMAL_PLACES,
            format: true,
          })} ${giveAssetType}`}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Input
            id="amount-input"
            inputProps={{ "data-testid": "amount-input" }}
            type="number"
            placeholder={t`Enter an amount`}
            value={depositAmount}
            // We need to inform the user about their deposit, so this is a specific value
            helperText={
              isDepositAmountValid
                ? `${`${t`Your current deposit is `} ${getCurrentDepositAmount().toString(
                    EXACT_FORMAT,
                  )} ${giveAssetType}`}`
                : isDepositAmountValidError
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: any) => handleSetDepositAmount(e.target.value)}
            error={!isDepositAmountValid}
            startAdornment={giveAssetType === "sOHM" ? "sOHM" : giveAssetType === "gOHM" ? "gOHM" : "placeholder"}
            endString={t`Max`}
            // This uses toFixed() as it is a specific value and not formatted
            endStringOnClick={() => handleSetDepositAmount(getMaximumDepositAmount().toString())}
          />
        </Grid>
        <Grid item xs={12}>
          <PrimaryButton size="medium" disabled={!canSubmit()} onClick={() => setIsAmountSet(true)} fullWidth>
            <Trans>Continue</Trans>
          </PrimaryButton>
        </Grid>
      </Grid>
    );
  };

  const getDonationConfirmationElement = () => {
    return (
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12} sm={4}>
          <Typography variant="body1" className="grey-text">
            <Trans>Current</Trans> {giveAssetType} <Trans>deposit</Trans>
          </Typography>
          {/* Referring to the current deposit, so we need to be specific */}
          <Typography variant="h6">
            {getCurrentDepositAmount().toString(EXACT_FORMAT)} {giveAssetType}
          </Typography>
        </Grid>
        <Grid item sm={4}>
          <ArrowGraphic fill={themedArrow} marginTop="0px" />
        </Grid>
        <Grid item xs={12} sm={4}>
          {/* On small screens, the current and new sOHM deposit numbers are stacked and left-aligned,
                whereas on larger screens, the numbers are on opposing sides of the box. This adjusts the
                alignment accordingly. */}
          <Grid container direction="column" alignItems={isSmallScreen ? "flex-start" : "flex-end"}>
            <Grid item xs={12}>
              <Typography variant="body1" className="grey-text">
                <Trans>New</Trans> {giveAssetType} <Trans>deposit</Trans>
              </Typography>
              {/* Referring to the new deposit, so we need to be specific */}
              <Typography variant="h6">
                {isWithdrawing ? 0 : getDepositAmount().toString(EXACT_FORMAT)} {giveAssetType}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const getStopDonationScreen = () => {
    return (
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {getRecipientDetails()}
        </Grid>
        {recordType === RecordType.PROJECT ? (
          <Grid item xs={12}>
            {getProjectStats()}
          </Grid>
        ) : (
          <></>
        )}
        <Grid item xs={12}>
          {getDonationConfirmationElement()}
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs />
            <Grid item xs={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <PrimaryButton size="medium" disabled={!canWithdraw()} onClick={handleWithdrawSubmit} fullWidth>
                    {isMutationLoading
                      ? `${`${t`Withdrawing `} ${giveAssetType}`}`
                      : `${`${t`Approve 0.00 `} ${giveAssetType}`}`}
                  </PrimaryButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs />
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const getEditConfirmationScreen = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {getDonationConfirmationElement()}
        </Grid>
        <Grid item xs={12}>
          <PrimaryButton size="medium" disabled={!canSubmit()} onClick={handleEditSubmit} fullWidth>
            {isMutationLoading
              ? `${`${t`Editing `} ${giveAssetType}`}`
              : `${`${t`Approve `} ${depositAmount.toString()} ${giveAssetType}`}`}
          </PrimaryButton>
        </Grid>
      </Grid>
    );
  };

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      headerText={getModalTitle() + " Donation"}
      closePosition="right"
      topLeft={getEscapeComponent()}
      minHeight="200px"
    >
      {shouldShowEditScreen()
        ? getEditDonationScreen()
        : shouldShowStopScreen()
        ? getStopDonationScreen()
        : shouldShowEditConfirmationScreen()
        ? getEditConfirmationScreen()
        : getInitialScreen()}
    </Modal>
  );
}
