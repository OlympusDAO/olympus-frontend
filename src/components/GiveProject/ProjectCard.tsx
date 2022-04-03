import "./ProjectCard.scss";

import { t, Trans } from "@lingui/macro";
import {
  Box,
  Container,
  Grid,
  LinearProgress,
  Link,
  Paper as MuiPaper,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { ChevronLeft } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { Icon, Paper, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber } from "bignumber.js";
import MarkdownIt from "markdown-it";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import ReactGA from "react-ga";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { NetworkId } from "src/constants";
import { EnvHelper } from "src/helpers/Environment";
import { GetCorrectContractUnits, GetCorrectStaticUnits } from "src/helpers/GetCorrectUnits";
import { getTotalDonated } from "src/helpers/GetTotalDonated";
import { getDonorNumbers, getRedemptionBalancesAsync } from "src/helpers/GiveRedemptionBalanceHelper";
import { useAppDispatch } from "src/hooks";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
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
import { NEW_DEPOSIT } from "src/views/Give/constants";
import { CancelCallback, SubmitCallback, SubmitEditCallback } from "src/views/Give/Interfaces";
import { ManageDonationModal, WithdrawSubmitCallback } from "src/views/Give/ManageDonationModal";
import { RecipientModal } from "src/views/Give/RecipientModal";

import { error } from "../../slices/MessagesSlice";
import { Project } from "./project.type";
import { countDecimals, roundToDecimal, toInteger } from "./utils";

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
  changeAssetType: (checked: boolean) => void;
  mode: ProjectDetailsMode;
};

type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
  app: IAppData;
};

export default function ProjectCard({ project, giveAssetType, changeAssetType, mode }: ProjectDetailsProps) {
  const location = useLocation();
  const isVerySmallScreen = useMediaQuery("(max-width: 375px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px) and (min-width: 375px)") && !isVerySmallScreen;
  const isMediumScreen = useMediaQuery("(max-width: 960px) and (min-width: 600px)") && !isSmallScreen;
  const { provider, address, connected, connect, networkId } = useWeb3Context();
  const { title, owner, shortDescription, details, finishDate, photos, wallet, depositGoal } = project;
  const [recipientInfoIsLoading, setRecipientInfoIsLoading] = useState(true);
  const [donorCountIsLoading, setDonorCountIsLoading] = useState(true);
  const [totalDebt, setTotalDebt] = useState("");
  const [totalDonated, setTotalDonated] = useState("");
  const [donorCount, setDonorCount] = useState(0);
  const [isUserDonating, setIsUserDonating] = useState(false);
  const [donationId, setDonationId] = useState(0);

  const { data: currentIndex } = useCurrentIndex();

  const [isGiveModalOpen, setIsGiveModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const donationInfo = useSelector((state: State) => {
    return networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.mockGiving && state.account.mockGiving.donationInfo
      : state.account.giving && state.account.giving.donationInfo;
  });

  const theme = useTheme();
  // We use useAppDispatch here so the result of the AsyncThunkAction is typed correctly
  // See: https://stackoverflow.com/a/66753532
  const dispatch = useAppDispatch();

  const svgFillColour: string = theme.palette.type === "light" ? "black" : "white";

  // Resets the viewport to the top of the page when pathnames change rather than
  // preserving vertical position of the page you are coming from
  useEffect(() => {
    const item = document.getElementById("outer-container");
    item?.scrollIntoView();
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Reset donation states when user switches network
  useEffect(() => {
    setIsUserDonating(false);
    setDonationId(0);
  }, [networkId]);

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
        const correctUnitDebt = GetCorrectStaticUnits(
          resultAction.redeeming.recipientInfo.totalDebt,
          giveAssetType,
          currentIndex,
        );

        setTotalDebt(correctUnitDebt);
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
        const correctUnitDonated = GetCorrectContractUnits(donatedAmount, giveAssetType, currentIndex);

        setTotalDonated(correctUnitDonated);
      })
      .catch(e => console.log(e));
  }, [connected, networkId, isGiveModalOpen, donationInfo]);

  // Determine if the current user is donating to the project whose page they are
  // currently viewing and if so tracks the index of the recipient in the user's
  // donationInfo array
  useEffect(() => {
    if (!donationInfo) {
      return;
    }

    for (let i = 0; i < donationInfo.length; i++) {
      if (donationInfo[i].recipient.toLowerCase() === wallet.toLowerCase()) {
        setIsUserDonating(true);
        setDonationId(i);
        break;
      }
    }
  }, [donationInfo, location.pathname]);

  const getUserDeposit = () => {
    const correctUnitDeposit = GetCorrectContractUnits(donationInfo[donationId].deposit, giveAssetType, currentIndex);

    return new BigNumber(correctUnitDeposit);
  };

  const getUserYieldSent = () => {
    const correctUnitYield = GetCorrectContractUnits(
      donationInfo[donationId].yieldDonated,
      giveAssetType,
      currentIndex,
    );

    return new BigNumber(correctUnitYield);
  };

  // The JSON file returns a string, so we convert it
  const finishDateObject = finishDate ? new Date(finishDate) : null;

  // Removed for now. Will leave this function in for when we re-add this feature
  const countdownRendererDetailed = ({ completed, formatted }: CountdownProps) => {
    if (completed)
      return (
        <>
          <Grid container className="countdown-container">
            <Grid item xs={3}>
              <Icon name="clock" />
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
            <Grid item className="countdown-object">
              <Icon name="time-remaining" />
            </Grid>
            <Grid item className="project-countdown-text">
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
            <Grid item className="cause-info-bottom-text">
              <Typography variant="body1">
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
    if (!totalDonated) return "0";

    const totalDonatedNumber = new BigNumber(totalDonated);

    return totalDonatedNumber.div(depositGoal).multipliedBy(100).toFixed();
  };

  const renderGoalCompletion = (): JSX.Element => {
    const goalCompletion = getGoalCompletion();
    const formattedGoalCompletion =
      countDecimals(goalCompletion) === 0 ? toInteger(goalCompletion) : roundToDecimal(goalCompletion);

    if (depositGoal === 0) return <></>;

    return (
      <>
        <div className="cause-info-icon">
          <Icon name="check-circle" style={{ marginRight: "0.33rem" }} />
        </div>
        <div>
          <Tooltip
            title={
              !address
                ? t`Connect your wallet to view the fundraising progress`
                : `${totalDonated} of ${depositGoal} ${giveAssetType} raised`
            }
            arrow
          >
            <div>
              <div className="cause-info-main-text">
                <Typography variant="body1">
                  <strong>{recipientInfoIsLoading ? <Skeleton /> : formattedGoalCompletion}% </strong>
                  of goal
                </Typography>
              </div>
            </div>
          </Tooltip>
        </div>
      </>
    );
  };

  const renderGoalCompletionDetailed = (): JSX.Element => {
    const goalProgress = parseFloat(getGoalCompletion()) > 100 ? 100 : parseFloat(getGoalCompletion());
    const formattedTotalDonated = new BigNumber(parseFloat(totalDonated).toFixed(2)).toFormat();

    if (depositGoal === 0) return <></>;

    return (
      <>
        <Grid container alignItems="flex-end" className="project-goal">
          <Grid item xs={5} className="project-donated">
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              wrap="nowrap"
              className="project-data-icon"
              spacing={1}
            >
              <Grid item>
                <Icon name="sohm-yield" />
              </Grid>
              <Grid item className="metric">
                <strong>{recipientInfoIsLoading ? <Skeleton /> : formattedTotalDonated}</strong>
              </Grid>
            </Grid>
            <Grid item className="subtext">
              <Trans>{giveAssetType} Yield</Trans>
            </Grid>
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={5} className="project-donated">
            <Grid container direction="column" alignItems="flex-end">
              <Grid item>
                <Grid
                  container
                  justifyContent="flex-end"
                  alignItems="center"
                  wrap="nowrap"
                  className="project-data-icon"
                  spacing={1}
                >
                  <Grid item>
                    <Icon name="sohm-yield-goal" />
                  </Grid>
                  <Grid item className="metric">
                    {new BigNumber(GetCorrectStaticUnits(depositGoal.toString(), giveAssetType, currentIndex)).toFormat(
                      2,
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className="subtext">
                <Trans>{giveAssetType} Yield Goal</Trans>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <div className={`project-goal-progress ${isUserDonating ? "donating" : ""}`}>
          <LinearProgress variant="determinate" value={goalProgress} />
        </div>
      </>
    );
  };

  const renderDepositData = (): JSX.Element => {
    return (
      <>
        <Grid container className="project-top-data">
          <Grid item xs={5} className="project-donors">
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              wrap="nowrap"
              className="project-data-icon"
              spacing={1}
            >
              <Grid item>
                <Icon name="donors" />
              </Grid>
              <Grid item className="metric">
                {donorCountIsLoading ? <Skeleton /> : donorCount}
              </Grid>
            </Grid>
            <div className="subtext">
              <Trans>Donors</Trans>
            </div>
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={5} className="project-deposits">
            <Grid
              container
              justifyContent="flex-start"
              alignItems="center"
              wrap="nowrap"
              className="project-data-icon"
              spacing={1}
            >
              <Grid item>
                <Icon name="sohm-total" />
              </Grid>
              <Grid item className="metric">
                {recipientInfoIsLoading ? <Skeleton /> : <strong>{new BigNumber(totalDebt).toFixed(2)}</strong>}
              </Grid>
            </Grid>
            <div className="subtext">
              <Trans>Total Active {giveAssetType}</Trans>
            </div>
          </Grid>
        </Grid>
      </>
    );
  };

  const getProjectImage = (): JSX.Element => {
    // We return an empty image with a set width, so that the spacing remains the same.
    if (!photos || photos.length < 1)
      return (
        <div className="cause-image">
          <img height="100%" src="" />
        </div>
      );

    // For the moment, we only display the first photo
    return (
      <div className={`cause-image ${isUserDonating ? "donating" : ""}`}>
        <Link href={`#/give/projects/${project.slug}`} onClick={() => handleProjectDetailsButtonClick("Image")}>
          <img width="100%" src={`${process.env.PUBLIC_URL}${photos[0]}`} />
        </Link>
      </div>
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
    depositAmount: BigNumber,
  ) => {
    if (depositAmount.isEqualTo(new BigNumber(0))) {
      return dispatch(error(t`Please enter a value!`));
    }

    // If on Rinkeby and using Mock Sohm, use changeMockGive async thunk
    // Else use standard call
    if (networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)) {
      await dispatch(
        changeMockGive({
          action: ACTION_GIVE,
          value: depositAmount.toFixed(),
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
          value: depositAmount.toFixed(),
          token: giveAssetType,
          recipient: walletAddress,
          id: NEW_DEPOSIT,
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

    if (depositAmountDiff.isEqualTo(new BigNumber(0))) return;

    // If on Rinkeby and using Mock Sohm, use changeMockGive async thunk
    // Else use standard call
    if (networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)) {
      await dispatch(
        changeMockGive({
          action: ACTION_GIVE_EDIT,
          value: depositAmountDiff.toFixed(),
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
          value: depositAmountDiff.toFixed(),
          token: giveAssetType,
          recipient: walletAddress,
          id: depositId,
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

  const handleWithdrawModalSubmit: WithdrawSubmitCallback = async (
    walletAddress,
    depositId,
    eventSource,
    depositAmount,
  ) => {
    // If on Rinkeby and using Mock Sohm, use changeMockGive async thunk
    // Else use standard call
    if (networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)) {
      await dispatch(
        changeMockGive({
          action: ACTION_GIVE_WITHDRAW,
          value: depositAmount.toFixed(),
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
          value: depositAmount.toFixed(),
          token: giveAssetType,
          recipient: walletAddress,
          id: depositId,
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
        <Box style={{ width: "100%", borderRadius: "10px" }}>
          {!isMediumScreen && !isSmallScreen && !isVerySmallScreen ? (
            <Grid item className={isVerySmallScreen ? "cause-card very-small" : "cause-card"} key={title}>
              <div style={{ display: "flex", width: "100%" }}>
                {getProjectImage()}
                <div className="cause-content">
                  <div className="cause-title">
                    <Link
                      href={`#/give/projects/${project.slug}`}
                      onClick={() => handleProjectDetailsButtonClick("Title Link")}
                    >
                      <Typography variant="h4">
                        <strong>{getTitle()}</strong>
                      </Typography>
                    </Link>
                  </div>
                  <div className="cause-body">
                    <Typography variant="body1" style={{ lineHeight: "20px" }}>
                      <div dangerouslySetInnerHTML={getRenderedDetails(true)} />
                    </Typography>
                  </div>
                  <Grid container direction="column" className="cause-misc-info">
                    <Grid item xs={6} sm={12} md={6}>
                      {renderGoalCompletion()}
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sm={12}
                      md={6}
                      className="give-button-grid"
                      style={{ justifyContent: "flex-end" }}
                    >
                      <Link
                        href={`#/give/projects/${project.slug}`}
                        className="cause-link"
                        onClick={() => handleProjectDetailsButtonClick("View Details Button")}
                      >
                        <PrimaryButton className="cause-give-button">
                          <Trans>View Details</Trans>
                        </PrimaryButton>
                      </Link>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </Grid>
          ) : (
            <Grid
              item
              className={isVerySmallScreen ? "cause-card very-small" : "cause-card"}
              key={title}
              style={{ flexDirection: "column" }}
            >
              <Grid container className="cause-header">
                <Grid item className="cause-title smaller-size">
                  <Link
                    href={`#/give/projects/${project.slug}`}
                    onClick={() => handleProjectDetailsButtonClick("Title Link")}
                  >
                    <Typography variant="h4">
                      <strong>{getTitle()}</strong>
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
              <div style={{ display: "flex", width: "100%" }} className="small-screen-cause">
                {getProjectImage()}
                <div className="cause-content">
                  <div className="cause-body">
                    <Typography variant="body1" style={{ lineHeight: "20px" }}>
                      <div dangerouslySetInnerHTML={getRenderedDetails(true)} />
                    </Typography>
                  </div>
                  <Grid container direction="column" className="cause-misc-info">
                    <Grid item xs={12} md={6}>
                      {renderGoalCompletion()}
                    </Grid>
                    <Grid item xs={12} md={6} className="give-button-grid" style={{ justifyContent: "flex-end" }}>
                      <Link
                        href={`#/give/projects/${project.slug}`}
                        className="cause-link"
                        onClick={() => handleProjectDetailsButtonClick("View Details Button")}
                      >
                        <PrimaryButton className="cause-give-button">
                          <Trans>View Details</Trans>
                        </PrimaryButton>
                      </Link>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </Grid>
          )}
        </Box>
        <RecipientModal
          isModalOpen={isGiveModalOpen}
          eventSource="Project List"
          callbackFunc={handleGiveModalSubmit}
          cancelFunc={handleGiveModalCancel}
          giveAssetType={giveAssetType}
          changeAssetType={changeAssetType}
          project={project}
          key={title}
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
        <Container style={{ display: "flex", justifyContent: "center" }} id="outer-container">
          <div
            className={`${isMediumScreen ? "medium" : ""}
            ${isSmallScreen ? "smaller" : ""}
            ${isVerySmallScreen ? "very-small" : ""}`}
          >
            <Box className="project-content-container">
              <Grid container className="project">
                <Grid
                  item
                  xs={12}
                  md={5}
                  style={{
                    paddingLeft: "1rem",
                  }}
                >
                  <MuiPaper className="project-sidebar">
                    <Grid container className="project-intro" justifyContent="space-between">
                      <Grid item className="project-title">
                        <Link href={"#/give"}>
                          <ChevronLeft
                            className="back-to-causes"
                            viewBox="6 6 12 12"
                            style={{ width: "12px", height: "12px" }}
                          />
                        </Link>
                        <Typography variant="h5">
                          <strong>{getTitle()}</strong>
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item className="project-visual-info">
                      {getProjectImage()}
                      <Grid item className="goal-graphics">
                        {renderDepositData()}
                        {renderGoalCompletionDetailed()}
                        {connected ? (
                          isUserDonating ? (
                            <></>
                          ) : (
                            <div className="project-give-button">
                              <PrimaryButton
                                onClick={() => handleGiveButtonClick()}
                                disabled={!isSupportedChain(networkId)}
                              >
                                <Trans>Donate Yield</Trans>
                              </PrimaryButton>
                            </div>
                          )
                        ) : (
                          <div className="project-give-button">
                            <PrimaryButton onClick={connect}>
                              <Trans>Connect Wallet</Trans>
                            </PrimaryButton>
                          </div>
                        )}
                        {renderCountdownDetailed()}
                      </Grid>
                    </Grid>
                  </MuiPaper>
                  {!isUserDonating ? (
                    <></>
                  ) : (
                    <MuiPaper className="project-sidebar">
                      <div className="project-sidebar-header">
                        <Typography variant="h5">
                          <strong>
                            <Trans>Your Donations</Trans>
                          </strong>
                        </Typography>
                      </div>
                      <div className="project-donations">
                        <Grid container className="project-donation-data">
                          <Grid item xs={5} className="project-deposited">
                            <Grid
                              container
                              justifyContent="flex-start"
                              alignItems="center"
                              wrap="nowrap"
                              className="project-data-icon"
                              spacing={1}
                            >
                              <Grid item>
                                <Icon name="deposited" />
                              </Grid>
                              <Grid item className="metric">
                                {!donationInfo[donationId] ? "0" : getUserDeposit().toFixed(2)}
                              </Grid>
                            </Grid>
                            <Grid item className="subtext">
                              <Trans>{giveAssetType} Deposited</Trans>
                            </Grid>
                          </Grid>
                          <Grid item xs={5} className="project-donated">
                            <Grid container direction="column" alignItems="flex-end">
                              <Grid item>
                                <Grid
                                  container
                                  justifyContent="flex-end"
                                  alignItems="center"
                                  wrap="nowrap"
                                  className="project-data-icon"
                                  spacing={1}
                                >
                                  <Grid item>
                                    <Icon name="sohm-yield-sent" />
                                  </Grid>
                                  <Grid item className="metric">
                                    {!donationInfo[donationId] ? "0" : getUserYieldSent().toFixed(2)}
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item className="subtext">
                                <Trans>{giveAssetType} Yield Sent</Trans>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        <div className="project-edit-button">
                          <PrimaryButton
                            onClick={() => handleEditButtonClick()}
                            disabled={!isSupportedChain(networkId)}
                          >
                            <Trans>Edit Donation</Trans>
                          </PrimaryButton>
                        </div>
                      </div>
                    </MuiPaper>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={6}
                  style={{
                    marginBottom: isMediumScreen || isSmallScreen || isVerySmallScreen ? "1rem" : 0,
                    paddingRight: isMediumScreen || isSmallScreen || isVerySmallScreen ? "1rem" : 0,
                    paddingLeft: isMediumScreen || isSmallScreen || isVerySmallScreen ? "1rem" : 0,
                  }}
                >
                  <Paper className="project-info">
                    <div className="project-info-header">
                      <Typography variant="h5" className="project-about-header">
                        <strong>
                          <Trans>About</Trans>
                        </strong>
                      </Typography>
                      <Grid item className="project-link">
                        <Link href={project.website} target="_blank">
                          <Icon name="website" fill={svgFillColour} />
                        </Link>
                      </Grid>
                    </div>
                    <div className="project-content" dangerouslySetInnerHTML={getRenderedDetails(false)} />
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </div>
        </Container>
        <RecipientModal
          isModalOpen={isGiveModalOpen}
          eventSource="Project Details"
          callbackFunc={handleGiveModalSubmit}
          cancelFunc={handleGiveModalCancel}
          giveAssetType={giveAssetType}
          changeAssetType={changeAssetType}
          project={project}
          key={title}
        />

        {isUserDonating ? (
          <ManageDonationModal
            isModalOpen={isManageModalOpen}
            eventSource={"Project Details"}
            submitEdit={handleEditModalSubmit}
            submitWithdraw={handleWithdrawModalSubmit}
            cancelFunc={handleManageModalCancel}
            giveAssetType={giveAssetType}
            changeAssetType={changeAssetType}
            currentWalletAddress={donationInfo[donationId].recipient}
            currentDepositId={donationInfo[donationId].id}
            currentDepositAmount={new BigNumber(donationInfo[donationId].deposit)}
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
