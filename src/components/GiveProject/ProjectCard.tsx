import "./ProjectCard.scss";

import { t, Trans } from "@lingui/macro";
import { Container, Grid, LinearProgress, Link, Tooltip, Typography, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { ChevronLeft } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { Icon, Paper, PrimaryButton } from "@olympusdao/component-library";
import MarkdownIt from "markdown-it";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import ReactGA from "react-ga";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { NetworkId } from "src/constants";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { getTotalDonated } from "src/helpers/GetTotalDonated";
import { getDonorNumbers, getRedemptionBalancesAsync } from "src/helpers/GiveRedemptionBalanceHelper";
import { useAppDispatch } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { IAccountSlice } from "src/slices/AccountSlice";
import { IAppData } from "src/slices/AppSlice";
import {
  ACTION_GIVE,
  ACTION_GIVE_EDIT,
  ACTION_GIVE_WITHDRAW,
  changeGive,
  changeMockGive,
  isSupportedChain,
} from "src/slices/GiveThunk";
import { IPendingTxn } from "src/slices/PendingTxnsSlice";
import { CancelCallback, SubmitCallback } from "src/views/Give/Interfaces";
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

type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
  app: IAppData;
};

const DECIMAL_PLACES = 2;
const ZERO_NUMBER: DecimalBigNumber = new DecimalBigNumber("0");
// We restrict DP to a reasonable number, but trim if unnecessary
const DEFAULT_FORMAT = { decimals: DECIMAL_PLACES, format: true };
const NO_DECIMALS_FORMAT = { decimals: 0, format: true };

export default function ProjectCard({ project, mode }: ProjectDetailsProps) {
  const location = useLocation();
  const { provider, address, connected, connect, networkId } = useWeb3Context();
  const { title, owner, shortDescription, details, finishDate, photos, wallet, depositGoal } = project;
  const [recipientInfoIsLoading, setRecipientInfoIsLoading] = useState(true);
  const [donorCountIsLoading, setDonorCountIsLoading] = useState(true);
  const [totalDonatedIsLoading, setTotalDonatedIsLoading] = useState(true);
  const [donationInfoIsLoading, setDonationInfoIsLoading] = useState(true);
  const [totalDebt, setTotalDebt] = useState("");
  const [totalDonated, setTotalDonated] = useState("");
  const [donorCount, setDonorCount] = useState(0);
  const [isUserDonating, setIsUserDonating] = useState(false);
  const [donationId, setDonationId] = useState(0);

  const [isGiveModalOpen, setIsGiveModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const [goalCompletion, setGoalCompletion] = useState(new DecimalBigNumber("0"));

  const donationInfo = useSelector((state: State) => {
    return networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)
      ? state.account.mockGiving && state.account.mockGiving.donationInfo
      : state.account.giving && state.account.giving.donationInfo;
  });

  const theme = useTheme();
  const isBreakpointLarge = useMediaQuery(theme.breakpoints.up("lg"));

  // We use useAppDispatch here so the result of the AsyncThunkAction is typed correctly
  // See: https://stackoverflow.com/a/66753532
  const dispatch = useAppDispatch();

  useEffect(() => {
    // We use dispatch to asynchronously fetch the results, and then update state variables so that the component refreshes
    // We DO NOT use dispatch here, because it will overwrite the state variables in the redux store, which then creates havoc
    // e.g. the redeem yield page will show someone else's deposited sOHM and redeemable yield
    getRedemptionBalancesAsync({
      networkID: networkId,
      provider: provider,
      address: wallet,
    })
      .then(resultAction => {
        setTotalDebt(resultAction.redeeming.recipientInfo.totalDebt);
        setRecipientInfoIsLoading(false);
      })
      .catch(e => console.log(e));

    getDonorNumbers({
      networkID: networkId,
      provider: provider,
      address: wallet,
    })
      .then(resultAction => {
        setDonorCount(!resultAction ? 0 : resultAction.length);
        setDonorCountIsLoading(false);
      })
      .catch(e => console.log(e));

    getTotalDonated({
      networkID: networkId,
      provider: provider,
      address: wallet,
    })
      .then(donatedAmount => {
        setTotalDonated(donatedAmount);
        setTotalDonatedIsLoading(false);
      })
      .catch(e => console.log(e));
  }, [connected, networkId, isGiveModalOpen]);

  useEffect(() => {
    setDonationInfoIsLoading(false);

    for (let i = 0; i < donationInfo.length; i++) {
      if (donationInfo[i].recipient.toLowerCase() === wallet.toLowerCase()) {
        setIsUserDonating(true);
        setDonationId(i);
        break;
      }
    }
  }, [donationInfo]);

  useEffect(() => {
    // We calculate the level of goal completion here, so that it is updated whenever one of the dependencies change
    if (recipientInfoIsLoading || totalDonatedIsLoading) {
      setGoalCompletion(ZERO_NUMBER);
      return;
    }

    const totalDonatedNumber = new DecimalBigNumber(totalDonated);

    setGoalCompletion(
      totalDonatedNumber.mul(new DecimalBigNumber("100")).div(new DecimalBigNumber(depositGoal.toString())),
    );
  }, [recipientInfoIsLoading, totalDonatedIsLoading, totalDonated, depositGoal]);

  useEffect(() => {
    setIsUserDonating(false);
    setDonationId(0);
  }, [networkId]);

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
                  : `${totalDonated} of ${depositGoal} sOHM raised`
              }
              arrow
            >
              <Typography variant="body1">
                <strong>{recipientInfoIsLoading ? <Skeleton width={20} /> : formattedGoalCompletion}</strong>
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
                {totalDonatedIsLoading ? <Skeleton /> : new DecimalBigNumber(totalDonated).toString(DEFAULT_FORMAT)}
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
                    {donorCountIsLoading ? <Skeleton /> : donorCount}
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
                    {recipientInfoIsLoading ? (
                      <Skeleton />
                    ) : (
                      <strong>{new DecimalBigNumber(totalDebt).toString(DEFAULT_FORMAT)}</strong>
                    )}
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

    // If on Rinkeby and using Mock Sohm, use changeMockGive async thunk
    // Else use standard call
    if (networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)) {
      await dispatch(
        changeMockGive({
          action: ACTION_GIVE,
          value: depositAmount.toString(),
          recipient: walletAddress,
          provider,
          address,
          networkID: networkId,
          version2: false,
          rebase: false,
          eventSource: eventSource,
        }),
      );
    } else {
      await dispatch(
        changeGive({
          action: ACTION_GIVE,
          value: depositAmount.toString(),
          recipient: walletAddress,
          provider,
          address,
          networkID: networkId,
          version2: false,
          rebase: false,
          eventSource: eventSource,
        }),
      );
    }

    setIsGiveModalOpen(false);
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

    // If on Rinkeby and using Mock Sohm, use changeMockGive async thunk
    // Else use standard call
    if (networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)) {
      await dispatch(
        changeMockGive({
          action: ACTION_GIVE_EDIT,
          value: depositAmountDiff.toString(),
          recipient: walletAddress,
          provider,
          address,
          networkID: networkId,
          version2: false,
          rebase: false,
          eventSource,
        }),
      );
    } else {
      await dispatch(
        changeGive({
          action: ACTION_GIVE_EDIT,
          value: depositAmountDiff.toString(),
          recipient: walletAddress,
          provider,
          address,
          networkID: networkId,
          version2: false,
          rebase: false,
          eventSource,
        }),
      );
    }

    setIsManageModalOpen(false);
  };

  const handleWithdrawModalSubmit: WithdrawSubmitCallback = async (walletAddress, eventSource, depositAmount) => {
    // If on Rinkeby and using Mock Sohm, use changeMockGive async thunk
    // Else use standard call
    if (networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)) {
      await dispatch(
        changeMockGive({
          action: ACTION_GIVE_WITHDRAW,
          value: depositAmount.toString(),
          recipient: walletAddress,
          provider,
          address,
          networkID: networkId,
          version2: false,
          rebase: false,
          eventSource,
        }),
      );
    } else {
      await dispatch(
        changeGive({
          action: ACTION_GIVE_WITHDRAW,
          value: depositAmount.toString(),
          recipient: walletAddress,
          provider,
          address,
          networkID: networkId,
          version2: false,
          rebase: false,
          eventSource,
        }),
      );
    }

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
                              {donationInfoIsLoading ? (
                                <Skeleton />
                              ) : donationInfo[donationId] ? (
                                // This amount is deliberately specific
                                new DecimalBigNumber(donationInfo[donationId].deposit).toString({
                                  format: true,
                                })
                              ) : (
                                "0"
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
                                {donationInfoIsLoading ? (
                                  <Skeleton />
                                ) : donationInfo[donationId] ? (
                                  new DecimalBigNumber(donationInfo[donationId].yieldDonated).toString(DEFAULT_FORMAT)
                                ) : (
                                  "0"
                                )}
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
          eventSource="Project Details"
          callbackFunc={handleGiveModalSubmit}
          cancelFunc={handleGiveModalCancel}
          project={project}
          key={"recipient-modal-" + title}
        />
        {isUserDonating && donationInfo[donationId] ? (
          <ManageDonationModal
            isModalOpen={isManageModalOpen}
            eventSource={"Project Details"}
            submitEdit={handleEditModalSubmit}
            submitWithdraw={handleWithdrawModalSubmit}
            cancelFunc={handleManageModalCancel}
            currentWalletAddress={donationInfo[donationId].recipient}
            currentDepositAmount={new DecimalBigNumber(donationInfo[donationId].deposit)}
            depositDate={donationInfo[donationId].date}
            yieldSent={donationInfo[donationId].yieldDonated}
            project={project}
            key={"manage-modal-" + donationInfo[donationId].recipient}
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
