import "react-step-progress-bar/styles.css";
// We import this AFTER the styles for react-step-progress-bar, so that we can override it
import "./GrantCard.scss";

import { t, Trans } from "@lingui/macro";
import { ChevronLeft } from "@mui/icons-material";
import { Box, Container, Grid, Link, Typography, useMediaQuery } from "@mui/material";
import { Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Icon, Paper, PrimaryButton } from "@olympusdao/component-library";
import MarkdownIt from "markdown-it";
import { useEffect, useMemo, useState } from "react";
import ReactGA from "react-ga";
import { ProgressBar, Step } from "react-step-progress-bar";
import { Grant, RecordType } from "src/components/GiveProject/project.type";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { isSupportedChain } from "src/helpers/GiveHelpers";
import { useAppDispatch } from "src/hooks";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useDonationInfo, useDonorNumbers } from "src/hooks/useGiveInfo";
import { useWeb3Context } from "src/hooks/web3Context";
import { ChangeAssetType } from "src/slices/interfaces";
import { error } from "src/slices/MessagesSlice";
import { GIVE_MAX_DECIMAL_FORMAT } from "src/views/Give/constants";
import { GetCorrectContractUnits } from "src/views/Give/helpers/GetCorrectUnits";
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

export enum GrantDetailsMode {
  Card = "Card",
  Page = "Page",
}

type GrantDetailsProps = {
  grant: Grant;
  giveAssetType: string;
  changeAssetType: ChangeAssetType;
  mode: GrantDetailsMode;
};

const NO_DONATION = -1;
const DECIMAL_PLACES = 4;
const ZERO_NUMBER: DecimalBigNumber = new DecimalBigNumber("0");
// We restrict DP to a reasonable number, but trim if unnecessary
const DEFAULT_FORMAT = { decimals: DECIMAL_PLACES, format: true };
const NO_DECIMALS_FORMAT = { decimals: 0, format: true };

export default function GrantCard({ grant, giveAssetType, changeAssetType, mode }: GrantDetailsProps) {
  const { address, connected, connect, networkId } = useWeb3Context();
  const { title, owner, shortDescription, details, photos, wallet, milestones, latestMilestoneCompleted } = grant;
  const [isUserDonating, setIsUserDonating] = useState(false);
  const [donationId, setDonationId] = useState(NO_DONATION);

  const { data: currentIndex } = useCurrentIndex();

  const [isGiveModalOpen, setIsGiveModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // Pulls a user's donation info
  const rawDonationInfo = useDonationInfo().data;
  const donationInfo = useMemo(() => {
    return rawDonationInfo ? rawDonationInfo : [];
  }, [rawDonationInfo]);
  const isDonationInfoLoading = useDonationInfo().isLoading;

  // Gets the number of donors for a given grant's wallet
  const donorCount = useDonorNumbers(wallet).data;

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
    if (donationId == NO_DONATION) return null;

    return donationInfo[donationId];
  }, [donationInfo, donationId]);

  const userDeposit: DecimalBigNumber = useMemo(() => {
    if (!userDonation) return new DecimalBigNumber("0");

    return GetCorrectContractUnits(userDonation.deposit, giveAssetType, currentIndex);
  }, [currentIndex, giveAssetType, userDonation]);

  const userYieldDonated: DecimalBigNumber = useMemo(() => {
    if (!userDonation) return new DecimalBigNumber("0");

    return GetCorrectContractUnits(userDonation.yieldDonated, giveAssetType, currentIndex);
  }, [currentIndex, giveAssetType, userDonation]);

  // Determine if the current user is donating to the project whose page they are
  // currently viewing and if so tracks the index of the recipient in the user's
  // donationInfo array
  useEffect(() => {
    setIsUserDonating(false);
    setDonationId(NO_DONATION);
  }, [networkId]);

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
  }, [isDonationInfoLoading, donationInfo, userDonation, networkId, wallet]);

  // Reset donation states when user switches network
  useEffect(() => {
    if (isGiveModalOpen) setIsGiveModalOpen(false);
  }, [giveMutation.isSuccess]);

  useEffect(() => {
    if (isManageModalOpen) setIsManageModalOpen(false);
  }, [increaseMutation.isSuccess, decreaseMutation.isSuccess]);

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
                      {
                        // We want a compact number
                        new DecimalBigNumber(value.amount.toString()).toString(NO_DECIMALS_FORMAT)
                      }
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
              <Typography variant="h6">{t`Milestone ${index + 1}: ${new DecimalBigNumber(
                value.amount.toString(),
              ).toString(NO_DECIMALS_FORMAT)} sOHM`}</Typography>
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
    const totalMilestoneAmount: DecimalBigNumber = !milestones
      ? ZERO_NUMBER
      : milestones.reduce((total, value) => total.add(new DecimalBigNumber(value.amount.toString())), ZERO_NUMBER);

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
                    {isDonationInfoLoading || donorCount === undefined ? (
                      <Skeleton className="skeleton-inline" />
                    ) : (
                      donorCount.toString()
                    )}
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
                    {totalMilestoneAmount.toString(DEFAULT_FORMAT)}
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
    depositAmount: DecimalBigNumber,
  ) => {
    if (depositAmount.eq(ZERO_NUMBER)) {
      return dispatch(error(t`Please enter a value!`));
    }

    giveMutation.mutate({
      amount: depositAmount.toString(GIVE_MAX_DECIMAL_FORMAT),
      recipient: walletAddress,
      token: giveAssetType,
    });
  };

  const handleGiveModalCancel: CancelCallback = () => {
    setIsGiveModalOpen(false);
  };

  // We set the decimals amount to 9 to try to limit any precision issues with
  // sOHM and gOHM conversions on the contract side
  const handleEditModalSubmit: SubmitEditCallback = async (
    walletAddress,
    depositId,
    eventSource,
    depositAmount,
    depositAmountDiff,
  ) => {
    if (donationId == -1) {
      return dispatch(error(t`No wallet set or user is not donating to this recipient`));
    }

    if (!depositAmountDiff) {
      return dispatch(error(t`Please enter a value!`));
    }

    if (depositAmountDiff.eq(ZERO_NUMBER)) return;

    if (depositAmountDiff.gt(new DecimalBigNumber("0"))) {
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

  // We set the decimals amount to 9 to try to limit any precision issues with
  // sOHM and gOHM conversions on the contract side
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
          isMutationLoading={isMutating}
          eventSource="Grants List"
          callbackFunc={handleGiveModalSubmit}
          cancelFunc={handleGiveModalCancel}
          giveAssetType={giveAssetType}
          changeAssetType={changeAssetType}
          project={grant}
          key={"recipient-modal-" + title}
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
                                {isDonationInfoLoading ? <Skeleton /> : userYieldDonated.toString(DEFAULT_FORMAT)}
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item className="subtext">
                            {giveAssetType} <Trans>Yield Sent</Trans>
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
          isMutationLoading={isMutating}
          eventSource="Grant Details"
          callbackFunc={handleGiveModalSubmit}
          cancelFunc={handleGiveModalCancel}
          giveAssetType={giveAssetType}
          changeAssetType={changeAssetType}
          project={grant}
          key={"recipient-modal-" + title}
        />

        {isUserDonating && donationId != NO_DONATION && donationInfo[donationId] ? (
          <ManageDonationModal
            isModalOpen={isManageModalOpen}
            isMutationLoading={isMutating}
            eventSource={"Grant Details"}
            submitEdit={handleEditModalSubmit}
            submitWithdraw={handleWithdrawModalSubmit}
            cancelFunc={handleManageModalCancel}
            giveAssetType={giveAssetType}
            changeAssetType={changeAssetType}
            currentWalletAddress={donationInfo[donationId].recipient}
            currentDepositAmount={userDeposit.toString()}
            depositDate={donationInfo[donationId].date}
            yieldSent={donationInfo[donationId].yieldDonated}
            project={grant}
            currentDepositId={donationInfo[donationId].id}
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
