import "./ProjectCard.scss";

import { t, Trans } from "@lingui/macro";
import { Container, Grid, LinearProgress, Link, Tooltip, Typography, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { ChevronLeft } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { Icon, Paper, PrimaryButton } from "@olympusdao/component-library";
import MarkdownIt from "markdown-it";
import { useEffect, useMemo, useState } from "react";
import Countdown from "react-countdown";
import ReactGA from "react-ga";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { isSupportedChain } from "src/helpers/GiveHelpers";
import { useAppDispatch } from "src/hooks";
import { useDonationInfo, useDonorNumbers, useRecipientInfo, useTotalYieldDonated } from "src/hooks/useGiveInfo";
import { useWeb3Context } from "src/hooks/web3Context";
import { useDecreaseGive, useIncreaseGive } from "src/views/Give/hooks/useEditGive";
import { useGive } from "src/views/Give/hooks/useGive";
import { CancelCallback, IUserDonationInfo, SubmitCallback } from "src/views/Give/Interfaces";
import { ManageDonationModal, WithdrawSubmitCallback } from "src/views/Give/ManageDonationModal";
import { RecipientModal } from "src/views/Give/RecipientModal";

import { error } from "../../slices/MessagesSlice";
import { Project } from "./project.type";

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
  mode: ProjectDetailsMode;
};

const NO_DONATION = -1;
const DECIMAL_PLACES = 2;
const ZERO_NUMBER: DecimalBigNumber = new DecimalBigNumber("0");
// We restrict DP to a reasonable number, but trim if unnecessary
const DEFAULT_FORMAT = { decimals: DECIMAL_PLACES, format: true };
const NO_DECIMALS_FORMAT = { decimals: 0, format: true };

export default function ProjectCard({ project, mode }: ProjectDetailsProps) {
  const { address, connected, connect, networkId } = useWeb3Context();
  const { title, owner, shortDescription, details, finishDate, photos, wallet, depositGoal } = project;
  const [isUserDonating, setIsUserDonating] = useState(false);
  const [donationId, setDonationId] = useState(NO_DONATION);

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
  const totalDebt: DecimalBigNumber = useMemo(() => {
    if (_useRecipientInfo.isLoading || _useRecipientInfo.data === undefined) return new DecimalBigNumber("0");

    return new DecimalBigNumber(_useRecipientInfo.data.totalDebt);
  }, [_useRecipientInfo]);
  const recipientInfoIsLoading = _useRecipientInfo.isLoading;
  const donorCount = useDonorNumbers(wallet).data;

  const _useTotalYieldDonated = useTotalYieldDonated(wallet);
  const totalYieldDonated: DecimalBigNumber = useMemo(() => {
    if (_useTotalYieldDonated.isLoading || _useTotalYieldDonated.data === undefined) return new DecimalBigNumber("0");

    return new DecimalBigNumber(_useTotalYieldDonated.data);
  }, [_useTotalYieldDonated]);
  const totalDonatedIsLoading = useTotalYieldDonated(wallet).isLoading;

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

    return new DecimalBigNumber(userDonation.deposit);
  }, [userDonation]);

  const userYieldDonated: DecimalBigNumber = useMemo(() => {
    if (!userDonation) return new DecimalBigNumber("0");

    return new DecimalBigNumber(userDonation.yieldDonated);
  }, [userDonation]);

  useEffect(() => {
    setIsUserDonating(false);
    setDonationId(NO_DONATION);
  }, [networkId]);

  useEffect(() => {
    if (isDonationInfoLoading || !donationInfo) return;

    for (let i = 0; i < donationInfo.length; i++) {
      if (donationInfo[i].recipient.toLowerCase() === wallet.toLowerCase()) {
        setIsUserDonating(true);
        setDonationId(i);
        break;
      }
    }
  }, [isDonationInfoLoading, donationInfo, networkId, wallet]);

  useEffect(() => {
    if (isGiveModalOpen) setIsGiveModalOpen(false);
  }, [giveMutation.isSuccess]);

  useEffect(() => {
    if (isManageModalOpen) setIsManageModalOpen(false);
  }, [increaseMutation.isSuccess, decreaseMutation.isSuccess]);

  const goalCompletion: DecimalBigNumber = useMemo(() => {
    // We calculate the level of goal completion here, so that it is updated whenever one of the dependencies change
    if (recipientInfoIsLoading || _useRecipientInfo.isLoading || !totalDebt) return ZERO_NUMBER;

    return totalDebt.mul(new DecimalBigNumber("100")).div(new DecimalBigNumber(depositGoal.toString()));
  }, [recipientInfoIsLoading, _useRecipientInfo.isLoading, totalDebt, depositGoal]);

  // The JSON file returns a string, so we convert it
  const finishDateObject = finishDate ? new Date(finishDate) : null;

  const remainingStyle = { color: "#999999" };

  // Removed for now. Will leave this function in for when we re-add this feature
  const countdownRendererDetailed = ({ completed, formatted }: CountdownProps) => {
    if (completed)
      return (
        <>
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item>
              <Icon name="time-remaining" />
            </Grid>
            <Grid item>
              <Typography variant="h6">
                <strong>00:00:00</strong>
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="body1" style={remainingStyle}>
                <Trans>Completed</Trans>
              </Typography>
            </Grid>
          </Grid>
        </>
      );

    return (
      <>
        <>
          <Grid container spacing={1} alignItems="center" justifyContent="center">
            <Grid item>
              <Icon name="time-remaining" />
            </Grid>
            <Grid item>
              <Tooltip
                title={!finishDateObject ? "" : t`Finishes at ${finishDateObject.toLocaleString()} in your timezone`}
                arrow
              >
                <Typography variant="h6">
                  <strong>
                    {formatted.days}:{formatted.hours}:{formatted.minutes}
                  </strong>
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item>
              <Typography variant="body1" style={remainingStyle}>
                <Trans>Remaining</Trans>
              </Typography>
            </Grid>
          </Grid>
        </>
      </>
    );
  };

  const renderGoalCompletion = (): JSX.Element => {
    // No point in displaying decimals in the progress bar
    const formattedGoalCompletion = goalCompletion.toString(NO_DECIMALS_FORMAT);

    if (depositGoal === 0) return <></>;

    return (
      <>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Icon name="sohm-yield-goal" />
          </Grid>
          <Grid item>
            <Tooltip
              title={
                !address
                  ? t`Connect your wallet to view the fundraising progress`
                  : `${totalDebt} of ${depositGoal} sOHM raised`
              }
              arrow
            >
              <Typography variant="body1">
                <strong>
                  {_useRecipientInfo.isLoading ? (
                    <Skeleton className="skeleton-inline" width={20} />
                  ) : (
                    formattedGoalCompletion
                  )}
                </strong>
                <Trans>% of goal</Trans>
              </Typography>
            </Tooltip>
          </Grid>
        </Grid>
      </>
    );
  };

  const renderGoalCompletionDetailed = (): JSX.Element => {
    const goalProgress: number = goalCompletion.gt(new DecimalBigNumber("100")) ? 100 : goalCompletion.toApproxNumber();

    if (depositGoal === 0) return <></>;

    return (
      <>
        <Grid container alignItems="flex-end">
          <Grid item xs={5}>
            <Grid container justifyContent="flex-start" alignItems="center" spacing={1}>
              <Grid item>
                <Icon name="sohm-yield" />
              </Grid>
              <Grid item className="metric">
                {totalDonatedIsLoading ? <Skeleton /> : totalYieldDonated.toString(DEFAULT_FORMAT)}
              </Grid>
            </Grid>
            <Grid item className="subtext">
              <Trans>sOHM Yield</Trans>
            </Grid>
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={5}>
            <Grid container direction="column" alignItems="flex-end">
              <Grid item>
                <Grid container justifyContent="flex-end" alignItems="center" spacing={1}>
                  <Grid item>
                    <Icon name="sohm-yield-goal" />
                  </Grid>
                  <Grid item className="metric">
                    {new DecimalBigNumber(depositGoal.toString()).toString(DEFAULT_FORMAT)}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className="subtext">
                <Trans>sOHM Yield Goal</Trans>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} className="project-goal-progress">
            <LinearProgress variant="determinate" value={goalProgress} />
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
                    <Icon name="donors" />
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
                    <Icon name="sohm-total" />
                  </Grid>
                  <Grid item className="metric">
                    {recipientInfoIsLoading ? <Skeleton /> : <strong>{totalDebt.toString(DEFAULT_FORMAT)}</strong>}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className="subtext">
                <Trans>Total Active sOHM</Trans>
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
        <Link href={`#/give/projects/${project.slug}`} onClick={() => handleProjectDetailsButtonClick("Image")}>
          <img width="100%" src={`${process.env.PUBLIC_URL}${photos[0]}`} />
        </Link>
      );
    }

    return (
      <Grid container alignContent="center" style={{ maxHeight: "184px", overflow: "hidden", borderRadius: "16px" }}>
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

    await giveMutation.mutate({ amount: depositAmount.toString(), recipient: walletAddress });
  };

  const handleGiveModalCancel: CancelCallback = () => {
    setIsGiveModalOpen(false);
  };

  const handleEditModalSubmit: SubmitCallback = async (
    walletAddress,
    eventSource,
    depositAmount,
    depositAmountDiff,
  ) => {
    if (!depositAmountDiff) {
      return dispatch(error(t`Please enter a value!`));
    }

    if (depositAmountDiff.eq(ZERO_NUMBER)) return;

    if (depositAmountDiff.gt(ZERO_NUMBER)) {
      await increaseMutation.mutate({ amount: depositAmountDiff.toString(), recipient: walletAddress });
    } else {
      const subtractionAmount = depositAmountDiff.mul(new DecimalBigNumber("-1"));
      await decreaseMutation.mutate({ amount: subtractionAmount.toString(), recipient: walletAddress });
    }
  };

  const handleWithdrawModalSubmit: WithdrawSubmitCallback = async (walletAddress, eventSource, depositAmount) => {
    await decreaseMutation.mutate({ amount: depositAmount.toString(), recipient: walletAddress });

    setIsManageModalOpen(false);
  };

  const handleManageModalCancel = () => {
    setIsManageModalOpen(false);
  };

  const getTitle = () => {
    if (!owner) return title;

    return owner + " - " + title;
  };

  const getRenderedDetails = (shorten: boolean) => {
    return {
      __html: MarkdownIt({ html: true }).render(shorten ? `${shortDescription}` : `${details}`),
    };
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
                href={`#/give/projects/${project.slug}`}
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
                  href={`#/give/projects/${project.slug}`}
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
                <div dangerouslySetInnerHTML={getRenderedDetails(true)} />
              </Typography>
            </Grid>
            <Grid item xs />
            <Grid item container xs={12} alignItems="flex-end">
              <Grid item xs={12} lg={8}>
                {renderGoalCompletion()}
              </Grid>
              <Grid item xs={12} lg={4}>
                <Link
                  href={`#/give/projects/${project.slug}`}
                  onClick={() => handleProjectDetailsButtonClick("View Details Button")}
                >
                  <PrimaryButton fullWidth>
                    <Trans>View Details</Trans>
                  </PrimaryButton>
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
                        <Link href={"#/give/"}>
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
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          {renderDepositData()}
                        </Grid>
                        <Grid item xs={12}>
                          {renderGoalCompletionDetailed()}
                        </Grid>
                        <Grid item xs={12}>
                          {!connected ? (
                            <PrimaryButton onClick={connect} fullWidth>
                              <Trans>Connect Wallet</Trans>
                            </PrimaryButton>
                          ) : isUserDonating ? (
                            <></>
                          ) : (
                            <PrimaryButton
                              onClick={() => handleGiveButtonClick()}
                              disabled={!isSupportedChain(networkId)}
                              fullWidth
                            >
                              <Trans>Donate Yield</Trans>
                            </PrimaryButton>
                          )}
                        </Grid>
                        <Grid item xs={12}>
                          {renderCountdownDetailed()}
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
                              {isDonationInfoLoading ? (
                                <Skeleton />
                              ) : (
                                // This amount is deliberately specific
                                userDeposit.toString({
                                  format: true,
                                })
                              )}
                            </Grid>
                          </Grid>
                          <Grid item className="subtext">
                            <Trans>sOHM Deposited</Trans>
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
                                {isDonationInfoLoading ? <Skeleton /> : userYieldDonated.toString(DEFAULT_FORMAT)}
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item className="subtext">
                            <Trans>sOHM Yield Sent</Trans>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <PrimaryButton
                          onClick={() => handleEditButtonClick()}
                          disabled={!isSupportedChain(networkId)}
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
                  <Link href={project.website} target="_blank">
                    <Icon name="website" />
                  </Link>
                }
              >
                <div className="project-content" dangerouslySetInnerHTML={getRenderedDetails(false)} />
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
            currentWalletAddress={userDonation.recipient}
            currentDepositAmount={userDeposit}
            depositDate={userDonation.date}
            yieldSent={userDonation.yieldDonated}
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
