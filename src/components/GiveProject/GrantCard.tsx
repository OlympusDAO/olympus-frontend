import "react-step-progress-bar/styles.css";
// We import this AFTER the styles for react-step-progress-bar, so that we can override it
import "./GrantCard.scss";

import { t, Trans } from "@lingui/macro";
import { Box, Container, Grid, Link, Typography, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { ChevronLeft } from "@material-ui/icons";
import { Skeleton } from "@material-ui/lab";
import { Icon, Paper, PrimaryButton } from "@olympusdao/component-library";
import { BigNumber } from "bignumber.js";
import MarkdownIt from "markdown-it";
import { useEffect, useState } from "react";
import ReactGA from "react-ga";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ProgressBar, Step } from "react-step-progress-bar";
import { NetworkId } from "src/constants";
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
import { Grant, RecordType } from "./project.type";

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
  const { provider, address, connected, connect, networkId } = useWeb3Context();
  const { title, owner, shortDescription, details, photos, wallet, milestones, latestMilestoneCompleted } = grant;
  const [, setRecipientInfoIsLoading] = useState(true);
  const [donorCountIsLoading, setDonorCountIsLoading] = useState(true);
  const [, setTotalDebt] = useState("");
  const [, setTotalDonated] = useState("");
  const [donorCount, setDonorCount] = useState(0);
  const [isUserDonating, setIsUserDonating] = useState(false);
  const [donationId, setDonationId] = useState(0);

  const [isGiveModalOpen, setIsGiveModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

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

  /**
   * Returns the milestone completion:
   * - 0: no milestones completed
   * - Otherwise, the completed milestone is indexed from 1
   */
  const getLatestMilestoneCompleted = (): number => {
    return !latestMilestoneCompleted ? 0 : latestMilestoneCompleted;
  };

  const renderMilestoneCompletion = (): JSX.Element => {
    if (milestones === undefined || milestones.length === 0) {
      return <Typography>No milestones are defined for this grant.</Typography>;
    }

    // Expects a percentage between 0 and 100
    // Examples for 2 milestones:
    // Start: getLatestMilestoneCompleted() = 0, percentComplete should equal 0
    // Milestone 1 complete: getLatestMilestoneCompleted() = 1, percentComplete should equal 50
    const percentComplete = (100 * getLatestMilestoneCompleted()) / milestones.length;
    const accomplishedStyle = {
      color: `${theme.palette.text.primary}`,
    };
    const unaccomplishedStyle = {
      color: `${theme.palette.text.secondary}`,
    };

    return (
      <>
        <div className={`project-milestone-progress`}>
          <ProgressBar
            percent={percentComplete}
            unfilledBackground="rgb(172, 177, 185)"
            filledBackground="linear-gradient(269deg, rgba(112, 139, 150, 1) 0%, rgba(247, 251, 231, 1) 100%)"
          >
            {
              // We add a dummy step at the start, so that steps are right-aligned
              <Step key={`step-0`}>{({}) => <></>}</Step>
            }
            {milestones.map((value, index) => {
              const humanIndex: number = index + 1;
              const currentMilestonePercentage: number = (100 * humanIndex) / milestones.length;
              const milestoneAccomplished: boolean = percentComplete >= currentMilestonePercentage;

              return (
                <Step key={`step-${humanIndex}`}>
                  {({}) => (
                    <div className="step-label" style={milestoneAccomplished ? accomplishedStyle : unaccomplishedStyle}>
                      {new BigNumber(value.amount).toFormat(0)}
                    </div>
                  )}
                </Step>
              );
            })}
          </ProgressBar>
        </div>
      </>
    );
  };

  /**
   * Returns the details of the next milestone.
   *
   * If the last milestone has been completed, display that.
   */
  const renderMilestoneDetails = (): JSX.Element => {
    if (milestones === undefined || milestones.length === 0) {
      return <></>;
    }

    return (
      <div className="milestone-deliverables">
        {milestones.map((value, index) => {
          return (
            <div key={`milestone-${index}`}>
              <Typography variant="h6">{t`Milestone ${index + 1}: ${new BigNumber(value.amount).toFormat(
                0,
              )} sOHM`}</Typography>
              <div
                dangerouslySetInnerHTML={{
                  __html: MarkdownIt({ html: true }).render(
                    value.description ? value.description : "No milestone information.",
                  ),
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderDepositData = (): JSX.Element => {
    const totalMilestoneAmount: BigNumber = !milestones
      ? new BigNumber(0)
      : milestones.reduce((total, value) => total.plus(value.amount), new BigNumber(0));

    return (
      <>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={5}>
            <Grid container direction="column" alignItems="flex-start">
              <Grid item>
                <Grid container justifyContent="flex-start" alignItems="center" wrap="nowrap" spacing={1}>
                  <Grid item>
                    <Icon name="donors" />
                  </Grid>
                  <Grid item className="metric">
                    {donorCountIsLoading ? <Skeleton className="skeleton-inline" /> : donorCount}
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
                    {totalMilestoneAmount.toFormat(0)}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className="subtext">
                <Trans>Total Milestone Amount</Trans>
              </Grid>
            </Grid>
          </Grid>
          <Box width="100%" />
          <Grid item xs={12}>
            {renderMilestoneCompletion()}
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
        <Link href={`#/give/grants/${grant.slug}`} onClick={() => handleGrantDetailsButtonClick("Image")}>
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
    depositAmount: BigNumber,
  ) => {
    if (depositAmount.isEqualTo(new BigNumber(0))) {
      return dispatch(error(t`Please enter a value!`));
    }

    // If on Rinkeby and using Mock Sohm, use changeMockGive async thunk
    // Else use standard call
    if (networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)) {
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
    if (networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)) {
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
    if (networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)) {
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
    /**
     * NOTE: We want the project title to be positioned above the image when the breakpoint < "lg",
     * but to the right of the image when the breakpoint = "lg". There was no clear way to do this
     * using the Grid (flexbox) component, so we check for the breakpoint manually and show/hide
     * accordingly. Happy to be proven wrong.
     */
    return (
      <>
        <Box style={{ width: "100%", borderRadius: "10px", marginBottom: "60px" }}>
          <Grid container key={title} spacing={3}>
            {!isBreakpointLarge ? (
              <Grid item xs={12}>
                <Link href={`#/give/grants/${grant.slug}`} onClick={() => handleGrantDetailsButtonClick("Title Link")}>
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
            {/* We shove the title, details and buttons into another container, so they move together in relation to the image. */}
            <Grid item container xs alignContent="space-between">
              {isBreakpointLarge ? (
                <Grid item xs={12}>
                  <Link
                    href={`#/give/grants/${grant.slug}`}
                    onClick={() => handleGrantDetailsButtonClick("Title Link")}
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
                <Typography variant="body1" style={{ lineHeight: "20px" }}>
                  <div dangerouslySetInnerHTML={getRenderedDetails(true)} />
                </Typography>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs />
                <Grid item xs={12} lg={4}>
                  <Link
                    href={`#/give/grants/${grant.slug}`}
                    onClick={() => handleGrantDetailsButtonClick("View Details Button")}
                  >
                    <PrimaryButton fullWidth>
                      <Trans>View Details</Trans>
                    </PrimaryButton>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
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
        <Container>
          <Grid container spacing={3} alignItems="flex-start">
            <Grid container item xs={12} lg={5}>
              <Grid item xs={12}>
                <Paper
                  topLeft={
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Link href={"#/give/grants"}>
                          <ChevronLeft viewBox="6 6 12 12" style={{ width: "12px", height: "12px" }} />
                        </Link>
                      </Grid>
                      <Grid item>
                        <Typography variant="h5">{getTitle()}</Typography>
                      </Grid>
                    </Grid>
                  }
                  fullWidth
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} lg={12}>
                      {getProjectImage()}
                    </Grid>
                    <Grid item container xs>
                      <Grid item xs={12}>
                        {renderDepositData()}
                      </Grid>
                      <Grid item xs={12} style={{ paddingTop: "45px" }}>
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
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                {!isUserDonating ? (
                  <></>
                ) : (
                  <Paper headerText={t`Your Donations`} fullWidth>
                    <Grid container alignItems="flex-end">
                      <Grid item xs={6}>
                        <Grid container direction="column" alignItems="flex-start">
                          <Grid item container justifyContent="flex-start" alignItems="center" spacing={1}>
                            <Grid item>
                              <Icon name="deposited" />
                            </Grid>
                            <Grid item>
                              <Typography className="metric">
                                {donationInfo[donationId]
                                  ? parseFloat(donationInfo[donationId].deposit).toFixed(2)
                                  : "0"}
                              </Typography>
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
                              <Grid item>
                                <Typography className="metric">
                                  {donationInfo[donationId]
                                    ? parseFloat(donationInfo[donationId].yieldDonated).toFixed(2)
                                    : "0"}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item className="subtext">
                            <Trans>sOHM Yield Sent</Trans>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Box width="100%" />
                      <Grid item xs={12}>
                        <PrimaryButton
                          onClick={() => handleEditButtonClick()}
                          disabled={!isSupportedChain(networkId)}
                          style={{ marginTop: "24px" }}
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
            <Grid container item xs={12} lg={7}>
              <Grid item xs={12}>
                <Paper headerText="Milestones" fullWidth>
                  {renderMilestoneDetails()}
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper
                  headerText="About"
                  topRight={
                    <Link href={grant.website} target="_blank">
                      <Icon name="website" />
                    </Link>
                  }
                  fullWidth
                >
                  <div className="project-content" dangerouslySetInnerHTML={getRenderedDetails(false)} />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
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
            recordType={RecordType.GRANT}
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
