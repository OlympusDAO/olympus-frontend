import "src/components/GiveProject/ProjectCard.scss";

import { t, Trans } from "@lingui/macro";
import { ChevronLeft } from "@mui/icons-material";
import { Container, Grid, LinearProgress, Link, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { Skeleton } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Icon, Paper, PrimaryButton, TertiaryButton } from "@olympusdao/component-library";
import { useEffect, useMemo, useState } from "react";
import Countdown from "react-countdown";
import ReactGA from "react-ga";
import ReactMarkdown from "react-markdown";
import { Link as RouterLink } from "react-router-dom";
import { Project } from "src/components/GiveProject/project.type";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { isSupportedChain } from "src/helpers/GiveHelpers";
import { useAppDispatch } from "src/hooks";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import {
  IUserRecipientInfo,
  useDonationInfo,
  useDonorNumbers,
  useRecipientInfo,
  useTotalDonated,
} from "src/hooks/useGiveInfo";
import { ChangeAssetType } from "src/slices/interfaces";
import { error } from "src/slices/MessagesSlice";
import { GIVE_MAX_DECIMAL_FORMAT, GIVE_MAX_DECIMALS } from "src/views/Give/constants";
import { GetCorrectContractUnits, GetCorrectStaticUnits } from "src/views/Give/helpers/GetCorrectUnits";
import { useDecreaseGive, useIncreaseGive } from "src/views/Give/hooks/useEditGive";
import { useGive } from "src/views/Give/hooks/useGive";
import {
  CancelCallback,
  IUserDonationInfo,
  SubmitCallback,
  SubmitEditCallback,
  WithdrawSubmitCallback,
} from "src/views/Give/Interfaces";
import { ManageDonationModal } from "src/views/Give/ManageDonationModal";
import { RecipientModal } from "src/views/Give/RecipientModal";
import { useAccount, useConnect, useNetwork } from "wagmi";

const PREFIX = "ProjectCard";

const classes = {
  progress: `${PREFIX}-progress`,
};

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  [`& .${classes.progress}`]: {
    backgroundColor: theme.palette.mode === "dark" ? theme.colors.primary[300] : theme.colors.gray[700],
  },
}));

type CountdownProps = {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  completed: boolean;
  formatted: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
};

export enum ProjectDetailsMode {
  Card = "Card",
  Page = "Page",
}

type ProjectDetailsProps = {
  project: Project;
  giveAssetType: string;
  changeAssetType: ChangeAssetType;
  mode: ProjectDetailsMode;
};

const NO_DONATION = -1;
const DECIMAL_PLACES = 4;
const ZERO_NUMBER: DecimalBigNumber = new DecimalBigNumber("0");
// We restrict DP to a reasonable number, but trim if unnecessary
const DEFAULT_FORMAT = { decimals: DECIMAL_PLACES, format: true };
const NO_DECIMALS_FORMAT = { decimals: 0, format: true };

export default function ProjectCard({ project, giveAssetType, changeAssetType, mode }: ProjectDetailsProps) {
  const { address = "", isConnected } = useAccount();
  const { connect } = useConnect();
  const { chain = { id: 1 } } = useNetwork();
  const { title, owner, shortDescription, details, finishDate, photos, wallet, depositGoal } = project;
  const [isUserDonating, setIsUserDonating] = useState(false);
  const [donationId, setDonationId] = useState(NO_DONATION);

  const { data: currentIndex } = useCurrentIndex();

  const [isGiveModalOpen, setIsGiveModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // Pull a user's donation info
  const _useDonationInfo = useDonationInfo();
  const donationInfo: IUserDonationInfo[] | null = useMemo(() => {
    return _useDonationInfo.data === undefined ? null : _useDonationInfo.data;
  }, [_useDonationInfo]);
  const isDonationInfoLoading = useDonationInfo().isLoading;

  // Pull data for a specific partner's wallet
  const _useRecipientInfo = useRecipientInfo(wallet);
  const recipientInfo: IUserRecipientInfo | null = useMemo(() => {
    return _useRecipientInfo.data === undefined ? null : _useRecipientInfo.data;
  }, [_useRecipientInfo]);

  const totalDebt: DecimalBigNumber = useMemo(() => {
    if (_useRecipientInfo.isLoading || _useRecipientInfo.data === undefined) return new DecimalBigNumber("0");

    return GetCorrectContractUnits(_useRecipientInfo.data.gohmDebt, giveAssetType, currentIndex);
  }, [_useRecipientInfo.data, _useRecipientInfo.isLoading, currentIndex, giveAssetType]);
  const recipientInfoIsLoading = _useRecipientInfo.isLoading;

  const donorCount = useDonorNumbers(wallet).data;

  const _useTotalDonated = useTotalDonated(wallet);
  const totalDonated: DecimalBigNumber = useMemo(() => {
    if (_useTotalDonated.isLoading || _useTotalDonated.data === undefined) return new DecimalBigNumber("0");

    return GetCorrectContractUnits(_useTotalDonated.data, giveAssetType, currentIndex);
  }, [_useTotalDonated.data, _useTotalDonated.isLoading, currentIndex, giveAssetType]);
  const totalDonatedIsLoading = useTotalDonated(wallet).isLoading;

  // Contract interactions: new donation, increase donation, decrease donation
  const giveMutation = useGive();
  const increaseMutation = useIncreaseGive();
  const decreaseMutation = useDecreaseGive();

  const isMutating = giveMutation.isLoading || increaseMutation.isLoading || decreaseMutation.isLoading;

  const theme = useTheme();
  const isBreakpointLarge = useMediaQuery(theme.breakpoints.up("lg"));

  // We use useAppDispatch here so the result of the AsyncThunkAction is typed correctly
  // See: https://stackoverflow.com/a/66753532
  const dispatch = useAppDispatch();

  const userDonation: IUserDonationInfo | null = useMemo(() => {
    if (donationId == NO_DONATION || _useDonationInfo.isLoading || !donationInfo) return null;

    return donationInfo[donationId];
  }, [donationInfo, _useDonationInfo.isLoading, donationId]);

  const userDeposit: DecimalBigNumber = useMemo(() => {
    if (!userDonation) return new DecimalBigNumber("0");

    return GetCorrectContractUnits(userDonation.deposit, giveAssetType, currentIndex);
  }, [currentIndex, giveAssetType, userDonation]);

  const userDonated: DecimalBigNumber = useMemo(() => {
    if (!userDonation) return new DecimalBigNumber("0");

    return GetCorrectContractUnits(userDonation.donated, giveAssetType, currentIndex);
  }, [currentIndex, giveAssetType, userDonation]);

  useEffect(() => {
    setIsUserDonating(false);
    setDonationId(NO_DONATION);
  }, [chain.id]);

  // Determine if the current user is donating to the project whose page they are
  // currently viewing and if so tracks the index of the recipient in the user's
  // donationInfo array
  useEffect(() => {
    if (isDonationInfoLoading || !donationInfo) return;

    if (!userDonation) {
      setIsUserDonating(false);
      setDonationId(NO_DONATION);
    }

    for (let i = 0; i < donationInfo.length; i++) {
      if (donationInfo[i].recipient.toLowerCase() === wallet.toLowerCase()) {
        setIsUserDonating(true);
        setDonationId(i);
        break;
      }
    }
  }, [isDonationInfoLoading, donationInfo, userDonation, chain.id, wallet]);

  useEffect(() => {
    if (isGiveModalOpen) setIsGiveModalOpen(false);
  }, [giveMutation.isSuccess]);

  useEffect(() => {
    if (isManageModalOpen) setIsManageModalOpen(false);
  }, [increaseMutation.isSuccess, decreaseMutation.isSuccess]);

  const goalCompletion: DecimalBigNumber = useMemo(() => {
    // We calculate the level of goal completion here, so that it is updated whenever one of the dependencies change
    if (recipientInfoIsLoading || _useRecipientInfo.isLoading || !totalDebt) return ZERO_NUMBER;

    const sohmDebt = recipientInfo ? new DecimalBigNumber(recipientInfo.sohmDebt) : new DecimalBigNumber("0");

    return sohmDebt
      .mul(new DecimalBigNumber("100"))
      .div(new DecimalBigNumber(depositGoal.toString()), GIVE_MAX_DECIMALS);
  }, [recipientInfoIsLoading, _useRecipientInfo.isLoading, totalDebt, depositGoal]);

  // The JSON file returns a string, so we convert it
  const finishDateObject = finishDate ? new Date(finishDate) : null;

  // Removed for now. Will leave this function in for when we re-add this feature
  const countdownRendererDetailed = ({ completed, formatted }: CountdownProps) => {
    if (completed)
      return (
        <Grid container spacing={1} alignItems="center" justifyContent="flex-start">
          <Grid item>
            <Typography variant="body2">00:00:00</Typography>
          </Grid>
          <Grid>
            <Typography variant="body2">
              <Trans>Completed</Trans>
            </Typography>
          </Grid>
        </Grid>
      );

    return (
      <>
        <>
          <Grid container spacing={1} alignItems="center" justifyContent="flex-start">
            <Grid item>
              <Tooltip
                title={!finishDateObject ? "" : t`Finishes at ${finishDateObject.toLocaleString()} in your timezone`}
                arrow
              >
                <Typography variant="body2">
                  {formatted.days}:{formatted.hours}:{formatted.minutes}
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                <Trans>Remaining</Trans>
              </Typography>
            </Grid>
          </Grid>
        </>
      </>
    );
  };

  const getGoalCompletion = (): string => {
    if (!depositGoal) return "0";
    if (recipientInfoIsLoading) return "0"; // This shouldn't be needed, but just to be sure...

    const sohmDebt = recipientInfo ? new DecimalBigNumber(recipientInfo.sohmDebt) : new DecimalBigNumber("0");
    const depositGoalNumber = new DecimalBigNumber(depositGoal.toString(), GIVE_MAX_DECIMALS);

    return sohmDebt
      .mul(new DecimalBigNumber("100"))
      .div(depositGoalNumber, GIVE_MAX_DECIMALS)
      .toString({ decimals: 2 });
  };

  const renderGoalCompletion = (): JSX.Element => {
    // No point in displaying decimals in the progress bar
    const formattedGoalCompletion = goalCompletion.toString(NO_DECIMALS_FORMAT);
    const goalProgress: number = goalCompletion.gt(new DecimalBigNumber("100")) ? 100 : goalCompletion.toApproxNumber();

    return (
      <>
        <Grid container alignItems="center" spacing={1} style={{ paddingBottom: "8px" }}>
          <Grid item xs={12} className="subtext">
            {renderCountdownDetailed()}
          </Grid>
          <Grid item xs={11} sm={9} className="project-goal-progress">
            <StyledLinearProgress
              classes={{ barColorPrimary: classes.progress }}
              variant="determinate"
              value={goalProgress}
            />
          </Grid>
          <Grid item xs={1} sm={3} className="subtext">
            {_useRecipientInfo.isLoading ? (
              <Skeleton className="skeleton-inline" width={20} />
            ) : (
              formattedGoalCompletion
            )}
            %
          </Grid>
        </Grid>
      </>
    );
  };

  const renderGoalCompletionDetailed = (): JSX.Element => {
    const goalProgress = parseFloat(getGoalCompletion()) > 100 ? 100 : parseFloat(getGoalCompletion());

    return (
      <>
        <Grid container alignItems="flex-end">
          <Grid item xs={5}>
            <Grid container justifyContent="flex-start" alignItems="center" spacing={1}>
              <Grid item>
                <Icon name="sohm-yield-sent" sx={{ width: "20px", height: "18px" }} />
              </Grid>
              <Grid item className="metric">
                {totalDonatedIsLoading ? <Skeleton /> : totalDonated.toString(DEFAULT_FORMAT)}
              </Grid>
            </Grid>
            <Grid item className="subtext">
              {giveAssetType} <Trans>Sent</Trans>
            </Grid>
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={5}>
            <Grid container direction="column" alignItems="flex-end">
              <Grid item>
                <Grid container justifyContent="flex-end" alignItems="center" spacing={1}>
                  <Grid item>
                    <Icon name="sohm-yield-goal" sx={{ width: "21px", height: "18px" }} />
                  </Grid>
                  <Grid item className="metric">
                    {GetCorrectStaticUnits(depositGoal.toString(), giveAssetType, currentIndex).toString(
                      DEFAULT_FORMAT,
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className="subtext">
                {giveAssetType} <Trans>Deposit Goal</Trans>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} className="project-goal-progress">
            <StyledLinearProgress
              classes={{ barColorPrimary: classes.progress }}
              variant="determinate"
              value={goalProgress}
            />
          </Grid>
        </Grid>
      </>
    );
  };

  const renderDepositData = (): JSX.Element => {
    return (
      <>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={5}>
            <Grid container direction="column" alignItems="flex-start">
              <Grid item>
                <Grid container justifyContent="flex-start" alignItems="center" spacing={1}>
                  <Grid item>
                    <Icon name="donors" sx={{ width: "21px", height: "19px" }} />
                  </Grid>
                  <Grid item className="metric">
                    {isDonationInfoLoading ? <Skeleton /> : donorCount}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className="subtext">
                <Trans>Donors</Trans>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={7}>
            <Grid container direction="column" alignItems="flex-end">
              <Grid item>
                <Grid container justifyContent="flex-end" alignItems="center" spacing={1}>
                  <Grid item>
                    <Icon name="deposited" sx={{ width: "18px", height: "19px" }} />
                  </Grid>
                  <Grid item className="metric">
                    {recipientInfoIsLoading ? <Skeleton /> : <strong>{totalDebt.toString(DEFAULT_FORMAT)}</strong>}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className="subtext">
                {giveAssetType} <Trans>Deposited</Trans>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  };

  const getProjectImage = (): JSX.Element => {
    let imageElement;
    // We return an empty image with a set width, so that the spacing remains the same.
    if (!photos || photos.length < 1) {
      imageElement = <img height="100%" src="" />;
    }
    // For the moment, we only display the first photo
    else {
      imageElement = (
        <Link
          to={`/give/projects/${project.slug}`}
          component={RouterLink}
          onClick={() => handleProjectDetailsButtonClick("Image")}
        >
          <img width="100%" src={`${process.env.PUBLIC_URL}${photos[0]}`} />
        </Link>
      );
    }

    return (
      <Grid container alignContent="center" style={{ maxHeight: "187px", overflow: "hidden", borderRadius: "16px" }}>
        <Grid item xs>
          {imageElement}
        </Grid>
      </Grid>
    );
  };

  const handleGiveButtonClick = () => {
    setIsGiveModalOpen(true);
  };

  const handleEditButtonClick = () => {
    setIsManageModalOpen(true);
  };

  const handleGiveModalSubmit: SubmitCallback = async (
    walletAddress: string,
    eventSource: string,
    depositAmount: DecimalBigNumber,
  ) => {
    if (depositAmount.eq(ZERO_NUMBER)) {
      return dispatch(error(t`Please enter a value!`));
    }

    await giveMutation.mutate({
      amount: depositAmount.toString(GIVE_MAX_DECIMAL_FORMAT),
      recipient: walletAddress,
      token: giveAssetType,
    });
  };

  const handleGiveModalCancel: CancelCallback = () => {
    setIsGiveModalOpen(false);
  };

  const handleEditModalSubmit: SubmitEditCallback = async (
    walletAddress,
    depositId,
    eventSource,
    depositAmount,
    depositAmountDiff,
  ) => {
    if (!depositAmountDiff) {
      return dispatch(error(t`Please enter a value!`));
    }

    if (depositAmountDiff.eq(ZERO_NUMBER)) return;

    if (depositAmountDiff.gt(ZERO_NUMBER)) {
      await increaseMutation.mutate({
        id: depositId,
        amount: depositAmountDiff.toString(GIVE_MAX_DECIMAL_FORMAT),
        recipient: walletAddress,
        token: giveAssetType,
      });
    } else {
      const subtractionAmount = depositAmountDiff.mul(new DecimalBigNumber("-1"));
      await decreaseMutation.mutate({
        id: depositId,
        amount: subtractionAmount.toString(GIVE_MAX_DECIMAL_FORMAT),
        recipient: walletAddress,
        token: giveAssetType,
      });
    }
  };

  const handleWithdrawModalSubmit: WithdrawSubmitCallback = async (
    walletAddress,
    depositId,
    eventSource,
    depositAmount,
  ) => {
    await decreaseMutation.mutate({
      id: depositId,
      amount: depositAmount.toString(GIVE_MAX_DECIMAL_FORMAT),
      recipient: walletAddress,
      token: "gOHM",
    });
  };

  const handleManageModalCancel = () => {
    setIsManageModalOpen(false);
  };

  const getTitle = () => {
    if (!owner) return title;

    return owner + " - " + title;
  };

  const RenderedDetails = ({ shorten = false }) => {
    const description = shorten ? shortDescription : <ReactMarkdown children={details} />;
    return <>{description}</>;
  };

  /**
   * Handles the onClick event for the project details button.
   *
   * Primarily, this will record the event in Google Analytics.
   */
  const handleProjectDetailsButtonClick = (source: string) => {
    ReactGA.event({
      category: "Olympus Give",
      action: "View Project",
      label: title,
      dimension1: address ?? "unknown",
      dimension2: source,
    });
  };

  const getCardContent = () => {
    return (
      <>
        <Grid container key={title} spacing={3}>
          {!isBreakpointLarge ? (
            <Grid item xs={12}>
              <Link
                to={`/give/projects/${project.slug}`}
                component={RouterLink}
                onClick={() => handleProjectDetailsButtonClick("Title Link")}
              >
                <Typography variant="h4">
                  <strong>{getTitle()}</strong>
                </Typography>
              </Link>
            </Grid>
          ) : (
            <></>
          )}
          <Grid item xs={12} sm={5} lg={4}>
            {getProjectImage()}
          </Grid>
          <Grid item container xs alignContent="space-between">
            {isBreakpointLarge ? (
              <Grid item xs={12}>
                <Link
                  to={`/give/projects/${project.slug}`}
                  component={RouterLink}
                  onClick={() => handleProjectDetailsButtonClick("Title Link")}
                >
                  <Typography variant="h4">
                    <strong>{getTitle()}</strong>
                  </Typography>
                </Link>
              </Grid>
            ) : (
              <></>
            )}
            <Grid item xs={12}>
              <Typography variant="body1" className="project-content">
                <RenderedDetails shorten />
              </Typography>
            </Grid>
            <Grid item xs />
            <Grid item container xs={12} alignItems="flex-end">
              <Grid item xs={12} sm={6} lg={8}>
                {renderGoalCompletion()}
              </Grid>
              <Grid item xs={12} sm={6} lg={4}>
                <Link
                  to={`projects/${project.slug}`}
                  component={RouterLink}
                  onClick={() => handleProjectDetailsButtonClick("View Details Button")}
                >
                  <TertiaryButton size="medium" fullWidth>
                    <Trans>View Details</Trans>
                  </TertiaryButton>
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <RecipientModal
          isModalOpen={isGiveModalOpen}
          isMutationLoading={isMutating}
          eventSource="Project List"
          callbackFunc={handleGiveModalSubmit}
          cancelFunc={handleGiveModalCancel}
          giveAssetType={giveAssetType}
          changeAssetType={changeAssetType}
          project={project}
          key={"recipient-modal-" + title}
        />
      </>
    );
  };

  const renderCountdownDetailed = () => {
    if (!finishDateObject) return <></>;

    return (
      <div className="project-countdown">
        <Countdown date={finishDateObject} renderer={countdownRendererDetailed} />
      </div>
    );
  };

  const getPageContent = () => {
    return (
      <>
        <Container>
          <Grid container spacing={3} alignItems="flex-start">
            <Grid container item xs={12} lg={5}>
              <Grid item xs={12}>
                <Paper
                  topLeft={
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Link to={"/give"} component={RouterLink}>
                          <ChevronLeft viewBox="6 6 12 12" style={{ width: "12px", height: "12px" }} />
                        </Link>
                      </Grid>
                      <Grid item>
                        <Typography variant="h5">{getTitle()}</Typography>
                      </Grid>
                    </Grid>
                  }
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} lg={12}>
                      {getProjectImage()}
                    </Grid>
                    <Grid item xs>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          {renderDepositData()}
                        </Grid>
                        <Grid item xs={12}>
                          {renderGoalCompletionDetailed()}
                        </Grid>
                        <Grid item xs={12} style={{ paddingTop: "30px" }}>
                          {!isConnected ? (
                            <PrimaryButton size="medium" onClick={connect} fullWidth>
                              <Trans>Connect Wallet</Trans>
                            </PrimaryButton>
                          ) : isUserDonating ? (
                            <></>
                          ) : (
                            <PrimaryButton
                              size="medium"
                              onClick={() => handleGiveButtonClick()}
                              disabled={!isSupportedChain(chain.id)}
                              fullWidth
                            >
                              <Trans>Donate Rebases</Trans>
                            </PrimaryButton>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                {!isUserDonating ? (
                  <></>
                ) : (
                  <Paper headerText={t`Your Donations`}>
                    <Grid container alignItems="flex-end" spacing={2}>
                      <Grid item xs={6}>
                        <Grid container direction="column" alignItems="flex-start">
                          <Grid item container justifyContent="flex-start" alignItems="center" spacing={1}>
                            <Grid item>
                              <Icon name="deposited" />
                            </Grid>
                            <Grid item className="metric">
                              {isDonationInfoLoading ? <Skeleton /> : userDeposit.toString(DEFAULT_FORMAT)}
                            </Grid>
                          </Grid>
                          <Grid item className="subtext">
                            {giveAssetType} <Trans>Deposited</Trans>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <Grid container direction="column" alignItems="flex-end">
                          <Grid item>
                            <Grid container justifyContent="flex-end" alignItems="center" spacing={1}>
                              <Grid item>
                                <Icon name="sohm-yield-sent" />
                              </Grid>
                              <Grid item className="metric">
                                {isDonationInfoLoading ? <Skeleton /> : userDonated.toString(DEFAULT_FORMAT)}
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item className="subtext">
                            {giveAssetType} <Trans>Sent</Trans>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <PrimaryButton
                          size="medium"
                          onClick={() => handleEditButtonClick()}
                          disabled={!isSupportedChain(chain.id)}
                          fullWidth
                        >
                          <Trans>Edit Donation</Trans>
                        </PrimaryButton>
                      </Grid>
                    </Grid>
                  </Paper>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} lg={7}>
              <Paper
                headerText="About"
                topRight={
                  <Link href={project.website} target="_blank" rel="noopener noreferrer">
                    <Icon name="website" />
                  </Link>
                }
              >
                <Typography variant="body1" className="project-content">
                  <RenderedDetails />
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <RecipientModal
          isModalOpen={isGiveModalOpen}
          isMutationLoading={isMutating}
          eventSource="Project Details"
          callbackFunc={handleGiveModalSubmit}
          cancelFunc={handleGiveModalCancel}
          giveAssetType={giveAssetType}
          changeAssetType={changeAssetType}
          project={project}
          key={"recipient-modal-" + title}
        />
        {isUserDonating && userDonation ? (
          <ManageDonationModal
            isModalOpen={isManageModalOpen}
            isMutationLoading={isMutating}
            eventSource={"Project Details"}
            submitEdit={handleEditModalSubmit}
            submitWithdraw={handleWithdrawModalSubmit}
            cancelFunc={handleManageModalCancel}
            giveAssetType={giveAssetType}
            changeAssetType={changeAssetType}
            currentWalletAddress={userDonation.recipient}
            currentDepositId={userDonation.id}
            currentDepositAmount={userDonation.deposit.toString()}
            depositDate={userDonation.date}
            rebasesSent={userDonation.donated}
            project={project}
            key={"manage-modal-" + userDonation.recipient}
          />
        ) : (
          <></>
        )}
      </>
    );
  };

  if (mode == ProjectDetailsMode.Card) return getCardContent();
  else return getPageContent();
}
