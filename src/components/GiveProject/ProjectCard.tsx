import {
  Button,
  Typography,
  Grid,
  Paper,
  Tooltip,
  Link,
  LinearProgress,
  useMediaQuery,
  Container,
} from "@material-ui/core";
import Countdown from "react-countdown";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ClockIcon } from "../../assets/icons/clock.svg";
import { ReactComponent as CheckIcon } from "../../assets/icons/check-circle.svg";
import { ReactComponent as ArrowRight } from "../../assets/icons/arrow-right.svg";
import { ReactComponent as DonorsIcon } from "../../assets/icons/donors.svg";
import { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useAppDispatch } from "src/hooks";
import { getDonorNumbers, getRedemptionBalancesAsync } from "src/helpers/GiveRedemptionBalanceHelper";
import { unwrapResult } from "@reduxjs/toolkit";
import { useWeb3Context } from "src/hooks/web3Context";
import { Skeleton } from "@material-ui/lab";
import { BigNumber } from "bignumber.js";
import { RecipientModal, SubmitCallback, CancelCallback } from "src/views/Give/RecipientModal";
import { changeGive, ACTION_GIVE } from "src/slices/GiveThunk";
import { error } from "../../slices/MessagesSlice";
import { Project } from "./project.type";
import { countDecimals, roundToDecimal, toInteger } from "./utils";
import { ReactComponent as WebsiteIcon } from "../../assets/icons/website.svg";
import { ReactComponent as DonatedIcon } from "../../assets/icons/donated.svg";
import { ReactComponent as GoalIcon } from "../../assets/icons/goal.svg";
import MarkdownIt from "markdown-it";
import { shortenString } from "src/helpers";
import { t, Trans } from "@lingui/macro";
import { useAppSelector } from "src/hooks";

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

export default function ProjectCard({ project, mode }: ProjectDetailsProps) {
  const isVerySmallScreen = useMediaQuery("(max-width: 375px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px) and (min-width: 375px)") && !isVerySmallScreen;
  const isMediumScreen = useMediaQuery("(max-width: 960px) and (min-width: 600px)") && !isSmallScreen;
  const { provider, address, connected, connect } = useWeb3Context();
  const networkId = useAppSelector(state => state.network.networkId);
  const { title, owner, shortDescription, details, finishDate, photos, category, wallet, depositGoal } = project;
  const [recipientInfoIsLoading, setRecipientInfoIsLoading] = useState(true);
  const [donorCountIsLoading, setDonorCountIsLoading] = useState(true);
  const [totalDebt, setTotalDebt] = useState("");
  const [donorCount, setDonorCount] = useState(0);

  const [isGiveModalOpen, setIsGiveModalOpen] = useState(false);

  const theme = useTheme();
  // We use useAppDispatch here so the result of the AsyncThunkAction is typed correctly
  // See: https://stackoverflow.com/a/66753532
  const dispatch = useAppDispatch();

  const svgFillColour: string = theme.palette.type === "light" ? "black" : "white";

  // When the user's wallet is connected, we perform these actions
  useEffect(() => {
    if (!connected) return;
    if (networkId == -1) return;

    // We use dispatch to asynchronously fetch the results, and then update state variables so that the component refreshes
    // We DO NOT use dispatch here, because it will overwrite the state variables in the redux store, which then creates havoc
    // e.g. the redeem yield page will show someone else's deposited sOHM and redeemable yield
    getRedemptionBalancesAsync({
      networkID: networkId,
      provider: provider,
      address: wallet,
    }).then(resultAction => {
      setTotalDebt(resultAction.redeeming.recipientInfo.totalDebt);
      setRecipientInfoIsLoading(false);
    });

    getDonorNumbers({
      networkID: networkId,
      provider: provider,
      address: wallet,
    }).then(resultAction => {
      setDonorCount(!resultAction ? 0 : resultAction.length);
      setDonorCountIsLoading(false);
    });
  }, [connected, networkId, isGiveModalOpen]);

  // The JSON file returns a string, so we convert it
  const finishDateObject = finishDate ? new Date(finishDate) : null;
  const countdownRenderer = ({ completed, formatted }: CountdownProps) => {
    if (completed)
      return (
        <>
          <div className="cause-info-icon">
            <SvgIcon component={ClockIcon} fill={svgFillColour} />
          </div>
          <div>
            <div className="cause-info-main-text">
              <strong>00:00:00</strong>
            </div>
            <span className="cause-info-bottom-text">
              <Trans>Completed</Trans>
            </span>
          </div>
        </>
      );

    return (
      <>
        <div className="cause-info-icon">
          <SvgIcon component={ClockIcon} fill={svgFillColour} />
        </div>
        <div>
          <Tooltip
            title={!finishDateObject ? "" : t`Finishes at ` + finishDateObject.toLocaleString() + t` in your timezone`}
            arrow
          >
            <div>
              <div className="cause-info-main-text">
                <strong>
                  {formatted.days}:{formatted.hours}:{formatted.minutes}
                </strong>
              </div>
              <span className="cause-info-bottom-text">
                <Trans>Remaining</Trans>
              </span>
            </div>
          </Tooltip>
        </div>
      </>
    );
  };
  const countdownRendererDetailed = ({ completed, formatted }: CountdownProps) => {
    if (completed)
      return (
        <>
          <Grid container className="countdown-container">
            <Grid item xs={3}>
              <SvgIcon component={ClockIcon} fill={svgFillColour} />
            </Grid>
            <Grid item xs={9} className="project-countdown-text">
              <div>
                <div className="cause-info-main-text">
                  <strong>00:00:00</strong>
                </div>
                <span className="cause-info-bottom-text">
                  <Trans>Completed</Trans>
                </span>
              </div>
            </Grid>
          </Grid>
        </>
      );

    return (
      <>
        <>
          <Grid container className="countdown-container">
            <Tooltip
              title={
                !finishDateObject ? "" : t`Finishes at ` + finishDateObject.toLocaleString() + t` in your timezone`
              }
              arrow
            >
              <Grid item xs={12} className="countdown-object">
                <div>
                  <SvgIcon component={ClockIcon} fill={svgFillColour} />
                </div>
                <div className="project-countdown-text">
                  <div>
                    {" "}
                    <Typography variant="h6">
                      <strong>
                        {formatted.days}:{formatted.hours}:{formatted.minutes}
                      </strong>
                    </Typography>
                    <span className="cause-info-bottom-text">
                      <Trans> remaining</Trans>
                    </span>
                  </div>
                </div>
              </Grid>
            </Tooltip>
          </Grid>
        </>
      </>
    );
  };

  const getGoalCompletion = (): string => {
    if (!depositGoal) return "0";
    if (recipientInfoIsLoading) return "0"; // This shouldn't be needed, but just to be sure...
    if (!totalDebt) return "0";

    const totalDebtNumber = new BigNumber(totalDebt);

    return totalDebtNumber.div(depositGoal).multipliedBy(100).toFixed();
  };

  const renderGoalCompletion = (): JSX.Element => {
    const goalCompletion = getGoalCompletion();
    const formattedGoalCompletion =
      countDecimals(goalCompletion) === 0 ? toInteger(goalCompletion) : roundToDecimal(goalCompletion);

    return (
      <>
        <div className="cause-info-icon">
          <SvgIcon component={CheckIcon} fill={svgFillColour} />
        </div>
        <div>
          <Tooltip title={totalDebt + t` of ` + depositGoal + t` sOHM raised`} arrow>
            <div>
              <div className="cause-info-main-text">
                <strong>{recipientInfoIsLoading ? <Skeleton /> : formattedGoalCompletion}%</strong>
              </div>
              <span className="cause-info-bottom-text">
                <Trans>of goal</Trans>
              </span>
            </div>
          </Tooltip>
        </div>
      </>
    );
  };

  const renderGoalCompletionDetailed = (): JSX.Element => {
    const goalProgress = parseFloat(getGoalCompletion()) > 100 ? 100 : parseFloat(getGoalCompletion());
    const formattedTotalDebt = new BigNumber(totalDebt).toFormat();

    return (
      <>
        <Grid container className="project-goal">
          <Grid item xs={4} className="project-donated">
            <div className="project-donated-icon">
              <SvgIcon
                component={DonatedIcon}
                viewBox={"0 0 16 12"}
                style={{ marginRight: "0.33rem" }}
                fill={svgFillColour}
              />
              <Typography variant="h6">
                <strong>{recipientInfoIsLoading ? <Skeleton /> : formattedTotalDebt}</strong>
              </Typography>
            </div>
            <div className="subtext">
              <Trans>sOHM Donated</Trans>
            </div>
          </Grid>
          <Grid item xs={4} />
          <Grid item xs={4} className="project-completion">
            <div className="project-completion-icon">
              <SvgIcon
                component={GoalIcon}
                viewBox={"0 0 16 12"}
                style={{ marginRight: "0.33rem" }}
                fill={svgFillColour}
              />
              <Typography variant="h6">
                <strong>{new BigNumber(depositGoal).toFormat()}</strong>
              </Typography>
            </div>
            <div className="subtext">
              <Trans>sOHM Goal</Trans>
            </div>
          </Grid>
        </Grid>
        <div className="project-goal-progress">
          <LinearProgress variant="determinate" value={goalProgress} />
        </div>
      </>
    );
  };

  const getProjectImage = (): JSX.Element => {
    // We return an empty image with a set width, so that the spacing remains the same.
    if (!photos || photos.length < 1)
      return (
        <div className="cause-image">
          <img width="100%" src="" />
        </div>
      );

    // For the moment, we only display the first photo
    return (
      <div className="cause-image">
        <Link href={`#/give/projects/${project.slug}`}>
          <img width="100%" src={`${process.env.PUBLIC_URL}${photos[0]}`} />
        </Link>
      </div>
    );
  };

  const handleGiveButtonClick = () => {
    setIsGiveModalOpen(true);
  };

  const handleGiveModalSubmit: SubmitCallback = async (
    walletAddress: string,
    depositAmount: BigNumber,
    depositAmountDiff?: BigNumber,
  ) => {
    if (depositAmount.isEqualTo(new BigNumber(0))) {
      return dispatch(error(t`Please enter a value!`));
    }

    // Record segment user event

    // If reducing the amount of deposit, withdraw
    await dispatch(
      changeGive({
        action: ACTION_GIVE,
        value: depositAmount.toFixed(),
        recipient: walletAddress,
        provider,
        address,
        networkID: networkId,
        version2: false,
        rebase: false,
      }),
    );

    setIsGiveModalOpen(false);
  };

  const handleGiveModalCancel: CancelCallback = () => {
    setIsGiveModalOpen(false);
  };

  const getTitle = () => {
    if (!owner) return title;

    return owner + " - " + title;
  };

  const getRenderedDetails = (shorten: boolean) => {
    return {
      __html: MarkdownIt({ html: true }).render(shorten ? t`${shortDescription}` : t`${details}`),
    };
  };

  const getCardContent = () => {
    return (
      <>
        <Paper style={{ backdropFilter: "none", backgroundColor: "transparent" }}>
          <Grid item className="cause-card" key={title}>
            {getProjectImage()}
            <div className="cause-content">
              <Grid container className="cause-header">
                <Grid item className="cause-title">
                  <Link href={`#/give/projects/${project.slug}`}>
                    <Typography variant="h5">
                      <strong>{getTitle()}</strong>
                    </Typography>
                  </Link>
                </Grid>
                <Grid item className="view-details">
                  <Link href={`#/give/projects/${project.slug}`} className="cause-link">
                    <Typography variant="body1">
                      <Trans>View Details</Trans>
                    </Typography>
                    <SvgIcon
                      component={ArrowRight}
                      style={{ width: "30px", marginLeft: "0.33em" }}
                      viewBox={"0 0 57 24"}
                      fill={svgFillColour}
                    />
                  </Link>
                </Grid>
              </Grid>
              <div className="cause-body">
                <Typography variant="body1" style={{ lineHeight: "20px" }}>
                  <div dangerouslySetInnerHTML={getRenderedDetails(true)} />
                </Typography>
              </div>
              <Grid container direction="column" className="cause-misc-info">
                <Grid item xs={3} sm={6} md={3}>
                  {finishDateObject ? <Countdown date={finishDateObject} renderer={countdownRenderer} /> : <></>}
                </Grid>
                <Grid item xs={3} sm={6} md={3}>
                  {renderGoalCompletion()}
                </Grid>
                <Grid item xs={4} sm={12} md={6} className="give-button-grid">
                  <Button
                    variant="contained"
                    color="primary"
                    className="cause-give-button"
                    onClick={() => handleGiveButtonClick()}
                    disabled={!address}
                  >
                    <Typography variant="h6">
                      <Trans>Give Yield</Trans>
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Paper>
        <RecipientModal
          isModalOpen={isGiveModalOpen}
          callbackFunc={handleGiveModalSubmit}
          cancelFunc={handleGiveModalCancel}
          project={project}
          key={title}
        />
      </>
    );
  };

  const renderCountdownDetailed = () => {
    if (!finishDateObject) return <></>;

    return (
      <Grid container className="project-countdown">
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
          <Countdown date={finishDateObject} renderer={countdownRendererDetailed} />
        </Grid>{" "}
        <Grid item xs={3}></Grid>
      </Grid>
    );
  };

  const getPageContent = () => {
    return (
      <>
        <Container
          style={{
            paddingLeft: "3.3rem",
            paddingRight: "3.3rem",
          }}
          className="project-container"
        >
          <div
            className={`${isMediumScreen && "medium"}
              ${isSmallScreen && "smaller"}
              ${isVerySmallScreen && "very-small"}`}
          >
            <Grid container className="project">
              <Grid item xs={1}></Grid>
              <Grid item xs={12} md={4}>
                <Paper className="project-sidebar">
                  <Grid container className="project-intro" justifyContent="space-between">
                    <Grid item className="project-title">
                      <Typography variant="h5">
                        <strong>{getTitle()}</strong>
                      </Typography>
                    </Grid>
                    <Grid item className="project-link">
                      <Link href={project.website} target="_blank">
                        <SvgIcon component={WebsiteIcon} fill={svgFillColour} />
                      </Link>
                    </Grid>
                  </Grid>
                  <Grid item className="project-visual-info">
                    {getProjectImage()}
                    <Grid item className="goal-graphics">
                      {renderGoalCompletionDetailed()}

                      <div className="visual-info-bottom">
                        {renderCountdownDetailed()}

                        <div className="project-give-button">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleGiveButtonClick()}
                            disabled={!address}
                          >
                            <Typography variant="h6">
                              <Trans>Give Yield</Trans>
                            </Typography>
                          </Button>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Paper>
                <Paper className="project-sidebar">
                  <Grid container direction="column">
                    <Grid item className="donors-title">
                      <Typography variant="h5">
                        <strong>
                          <Trans>Donations</Trans>
                        </strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} className="project-goal">
                      <Grid container className="project-donated-icon">
                        <Grid item xs={1} md={2}>
                          <SvgIcon component={DonorsIcon} viewBox={"0 0 18 13"} fill={svgFillColour} />
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="h6">
                            {donorCountIsLoading ? <Skeleton /> : <strong>{donorCount}</strong>}
                          </Typography>
                          <div className="subtext">
                            <Trans>Donors</Trans>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className="project-info">
                  <Typography variant="h5" className="project-about-header">
                    <strong>
                      <Trans>About</Trans>
                    </strong>
                  </Typography>
                  <div dangerouslySetInnerHTML={getRenderedDetails(false)} />
                </Paper>
              </Grid>
            </Grid>
          </div>
        </Container>
        <RecipientModal
          isModalOpen={isGiveModalOpen}
          callbackFunc={handleGiveModalSubmit}
          cancelFunc={handleGiveModalCancel}
          project={project}
          key={title}
        />
      </>
    );
  };

  if (mode == ProjectDetailsMode.Card) return getCardContent();
  else return getPageContent();
}
