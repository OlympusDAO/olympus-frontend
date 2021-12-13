import { useMemo, useState } from "react";
import "./give.scss";
import { Button, Paper, Typography, Zoom, Grid, Container } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ProjectCard, { ProjectDetailsMode } from "src/components/GiveProject/ProjectCard";
import data from "./projects.json";
import { CancelCallback, RecipientModal, SubmitCallback } from "./RecipientModal";
import { BigNumber } from "bignumber.js";
import { error } from "../../slices/MessagesSlice";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { changeGive, ACTION_GIVE } from "src/slices/GiveThunk";
import { GiveInfo } from "./GiveInfo";
import { useUIDSeed } from "react-uid";
import { t, Trans } from "@lingui/macro";

export default function CausesDashboard() {
  const { provider, address } = useWeb3Context();
  const networkId = useAppSelector(state => state.network.networkId);
  const [isCustomGiveModalOpen, setIsCustomGiveModalOpen] = useState(false);
  const isVerySmallScreen = useMediaQuery("(max-width: 375px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px) and (min-width: 375px)") && !isVerySmallScreen;
  const isMediumScreen = useMediaQuery("(max-width: 980px) and (min-width: 600px)") && !isSmallScreen;
  const { projects } = data;

  // We use useAppDispatch here so the result of the AsyncThunkAction is typed correctly
  // See: https://stackoverflow.com/a/66753532
  const dispatch = useAppDispatch();
  const seed = useUIDSeed();

  const renderProjects = useMemo(() => {
    return projects.map(project => {
      return <ProjectCard key={seed(project.title)} project={project} mode={ProjectDetailsMode.Card} />;
    });
  }, [projects]);

  const handleCustomGiveButtonClick = () => {
    setIsCustomGiveModalOpen(true);
  };

  const handleCustomGiveModalSubmit: SubmitCallback = async (
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
      }),
    );

    setIsCustomGiveModalOpen(false);
  };

  const handleCustomGiveModalCancel: CancelCallback = () => {
    setIsCustomGiveModalOpen(false);
  };

  return (
    <Container
      style={{
        paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
        paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
      }}
    >
      <div className="give-view">
        <div
          className={`${isMediumScreen && "medium"}
            ${isSmallScreen && "smaller"}
            ${isVerySmallScreen && "very-small"}`}
        >
          <Zoom in={true}>
            <Paper className={`ohm-card secondary ${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
              <div className="card-header">
                <div>
                  <Typography variant="h5">
                    <Trans>Give</Trans>
                  </Typography>
                </div>
              </div>
              <div className="causes-body">
                <Grid container className="data-grid">
                  {renderProjects}
                </Grid>
              </div>
              <div className="custom-recipient">
                <Button
                  variant="contained"
                  color="primary"
                  className="custom-give-button"
                  onClick={() => handleCustomGiveButtonClick()}
                  disabled={!address}
                >
                  <Typography variant="h6" style={{ marginBottom: "0px" }}>
                    <Trans>Custom Recipient</Trans>
                  </Typography>
                </Button>
              </div>
              <RecipientModal
                isModalOpen={isCustomGiveModalOpen}
                callbackFunc={handleCustomGiveModalSubmit}
                cancelFunc={handleCustomGiveModalCancel}
              />
            </Paper>
          </Zoom>
          <Zoom in={true}>
            <GiveInfo />
          </Zoom>
        </div>
      </div>
    </Container>
  );
}
