import { t, Trans } from "@lingui/macro";
import {
  Box,
  Button,
  Container,
  Grid,
  LinearProgress,
  Link,
  Paper,
  SvgIcon,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { ChevronLeft } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { Icon } from "@olympusdao/component-library";
import { BigNumber } from "bignumber.js";
import MarkdownIt from "markdown-it";
import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ReactComponent as GiveSohm } from "src/assets/icons/give_sohm.svg";
import { NetworkId } from "src/constants";
import { EnvHelper } from "src/helpers/Environment";
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
import { ManageDonationModal } from "src/views/Give/ManageDonationModal";
import { RecipientModal } from "src/views/Give/RecipientModal";
import { WithdrawSubmitCallback } from "src/views/Give/WithdrawDepositModal";

import { error } from "../../slices/MessagesSlice";
import { Grant } from "./project.type";
import { countDecimals, roundToDecimal, toInteger } from "./utils";

export enum GrantDetailsMode {
  Card = "Card",
  Page = "Page",
}

type GrantDetailsProps = {
  grant: Grant;
  mode: GrantDetailsMode;
};

type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
  app: IAppData;
};

export default function GrantCard({ grant, mode }: GrantDetailsProps) {
  const location = useLocation();
  const isVerySmallScreen = useMediaQuery("(max-width: 375px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px) and (min-width: 375px)") && !isVerySmallScreen;
  const isMediumScreen = useMediaQuery("(max-width: 960px) and (min-width: 600px)") && !isSmallScreen;
  const { provider, address, connected, connect, networkId } = useWeb3Context();
  const {
    title,
    owner,
    shortDescription,
    details,
    finishDate,
    photos,
    wallet,
    depositGoal,
    milestones,
    latestMilestoneCompleted,
  } = grant;
  const [recipientInfoIsLoading, setRecipientInfoIsLoading] = useState(true);
  const [donorCountIsLoading, setDonorCountIsLoading] = useState(true);
  const [totalDebt, setTotalDebt] = useState("");
  const [totalDonated, setTotalDonated] = useState("");
  const [donorCount, setDonorCount] = useState(0);
  const [isUserDonating, setIsUserDonating] = useState(false);
  const [donationId, setDonationId] = useState(0);

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

  useEffect(() => {
    const items = document.getElementsByClassName("project-container");
    if (items.length > 0) {
      items[0].scrollIntoView();
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

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
      })
      .catch(e => console.log(e));
  }, [connected, networkId, isGiveModalOpen]);

  useEffect(() => {
    for (let i = 0; i < donationInfo.length; i++) {
      if (donationInfo[i].recipient.toLowerCase() === wallet.toLowerCase()) {
        setIsUserDonating(true);
        setDonationId(i);
        break;
      }
    }
  }, [donationInfo]);

  useEffect(() => {
    setIsUserDonating(false);
    setDonationId(0);
  }, [networkId]);

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
                : `${totalDonated} of ${depositGoal} sOHM raised`
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
        <Grid container className="project-goal">
          <Grid item xs={5} className="project-donated">
            <div className="project-donated-icon">
              <SvgIcon component={GiveSohm} style={{ marginRight: "0.33rem" }} />
              <Typography variant="h6">
                <strong>{recipientInfoIsLoading ? <Skeleton /> : formattedTotalDonated}</strong>
              </Typography>
            </div>
            <div className="subtext">
              <Trans>sOHM Yield</Trans>
            </div>
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={5} className="project-completion">
            <div className="project-completion-icon">
              <Icon name="goal" style={{ marginRight: "0.33rem" }} />
              <Typography variant="h6">
                <strong>{new BigNumber(depositGoal).toFormat()}</strong>
              </Typography>
            </div>
            <div className="subtext">
              <Trans>sOHM Yield Goal</Trans>
            </div>
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
            <div className="project-data-icon">
              <Icon name="donors" style={{ marginRight: "0.33rem" }} />
              <Typography variant="h6">{donorCountIsLoading ? <Skeleton /> : <strong>{donorCount}</strong>}</Typography>
            </div>
            <div className="subtext">
              <Trans>Donors</Trans>
            </div>
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={5} className="project-deposits">
            <div className="project-data-icon">
              <SvgIcon component={GiveSohm} style={{ marginRight: "0.33rem" }} />
              <Typography variant="h6">
                {recipientInfoIsLoading ? <Skeleton /> : <strong>{parseFloat(totalDebt).toFixed(2)}</strong>}
              </Typography>
            </div>
            <div className="subtext">
              <Trans>Total Active sOHM</Trans>
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
        <Link href={`#/give/grants/${grant.slug}`} onClick={() => handleGrantDetailsButtonClick("Image")}>
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
  const handleGrantDetailsButtonClick = (source: string) => {
    ReactGA.event({
      category: "Olympus Give",
      action: "View Grants Project",
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
                      href={`#/give/grants/${grant.slug}`}
                      onClick={() => handleGrantDetailsButtonClick("Title Link")}
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
                  <Grid container direction="column" className="cause-misc-info grants">
                    <Grid
                      item
                      xs={6}
                      sm={12}
                      md={6}
                      className="give-button-grid"
                      style={{ justifyContent: "flex-end" }}
                    >
                      <Link
                        href={`#/give/grants/${grant.slug}`}
                        className="cause-link"
                        onClick={() => handleGrantDetailsButtonClick("View Details Button")}
                      >
                        <Button variant="contained" color="primary" className="grant-give-button">
                          <Typography variant="h6">
                            <Trans>View Details</Trans>
                          </Typography>
                        </Button>
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
                    href={`#/give/grants/${grant.slug}`}
                    onClick={() => handleGrantDetailsButtonClick("Title Link")}
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
                    <Grid item xs={12} className="give-button-grid" style={{ justifyContent: "flex-end" }}>
                      <Link
                        href={`#/give/grants/${grant.slug}`}
                        className="cause-link"
                        onClick={() => handleGrantDetailsButtonClick("View Details Button")}
                      >
                        <Button variant="contained" color="primary" className="grant-give-button">
                          <Typography variant="h6">
                            <Trans>View Details</Trans>
                          </Typography>
                        </Button>
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
          eventSource="Grants List"
          callbackFunc={handleGiveModalSubmit}
          cancelFunc={handleGiveModalCancel}
          project={grant}
          key={title}
        />
      </>
    );
  };

  const getPageContent = () => {
    return (
      <>
        <Container style={{ display: "flex", justifyContent: "center" }} className="project-container">
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
                    paddingRight: isMediumScreen || isSmallScreen || isVerySmallScreen ? "1rem" : 0,
                  }}
                >
                  <Paper className="project-sidebar">
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

                        <div className="project-give-button">
                          {connected ? (
                            isUserDonating ? (
                              <></>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleGiveButtonClick()}
                                disabled={!isSupportedChain(networkId)}
                              >
                                <Typography variant="h6">
                                  <Trans>Donate Yield</Trans>
                                </Typography>
                              </Button>
                            )
                          ) : (
                            <Button variant="contained" color="primary" onClick={connect}>
                              <Typography variant="h6">
                                <Trans>Connect wallet</Trans>
                              </Typography>
                            </Button>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                  </Paper>
                  {isUserDonating ? (
                    <Paper className="project-sidebar">
                      <div className="project-sidebar-header">
                        <Typography variant="h5">
                          <strong>
                            <Trans>Your Donations</Trans>
                          </strong>
                        </Typography>
                      </div>
                      <div className="project-donations">
                        <div className="project-donation-data">
                          <div className="project-deposited">
                            <Typography variant="h6">
                              <SvgIcon component={GiveSohm} style={{ marginRight: "0.33rem" }} />
                              <strong>{parseFloat(donationInfo[donationId].deposit).toFixed(2)} sOHM</strong>
                            </Typography>
                            <Typography variant="body1" className="subtext">
                              Deposited
                            </Typography>
                          </div>
                          <div className="project-yield-sent">
                            <Typography variant="h6" align="right">
                              <SvgIcon component={GiveSohm} style={{ marginRight: "0.33rem" }} />
                              <strong>{parseFloat(donationInfo[donationId].yieldDonated).toFixed(2)} sOHM</strong>
                            </Typography>
                            <Typography variant="body1" align="right" className="subtext">
                              Yield Sent
                            </Typography>
                          </div>
                        </div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEditButtonClick()}
                          disabled={!isSupportedChain(networkId)}
                        >
                          <Typography variant="h6">
                            <Trans>Edit Donation</Trans>
                          </Typography>
                        </Button>
                      </div>
                    </Paper>
                  ) : (
                    <></>
                  )}
                </Grid>
                <Grid item>
                  <Paper title="Milestone">TODO</Paper>
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
                        <Link href={grant.website} target="_blank">
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
          eventSource="Grant Details"
          callbackFunc={handleGiveModalSubmit}
          cancelFunc={handleGiveModalCancel}
          project={grant}
          key={title}
        />

        {isUserDonating ? (
          <ManageDonationModal
            isModalOpen={isManageModalOpen}
            eventSource={"Grant Details"}
            submitEdit={handleEditModalSubmit}
            submitWithdraw={handleWithdrawModalSubmit}
            cancelFunc={handleManageModalCancel}
            currentWalletAddress={donationInfo[donationId].recipient}
            currentDepositAmount={new BigNumber(donationInfo[donationId].deposit)}
            depositDate={donationInfo[donationId].date}
            yieldSent={donationInfo[donationId].yieldDonated}
            project={grant}
            key={"manage-modal-" + donationInfo[donationId].recipient}
          />
        ) : (
          <></>
        )}
      </>
    );
  };

  if (mode == GrantDetailsMode.Card) return getCardContent();
  else return getPageContent();
}
