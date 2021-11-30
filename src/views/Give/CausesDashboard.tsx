import { useMemo, useState } from "react";
import "./give.scss";
import { Button, Paper, Typography, Zoom, Grid } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ProjectDetails from "src/components/GiveProject/ProjectDetails";
import data from "./projects.json";
import { CancelCallback, RecipientModal, SubmitCallback } from "./RecipientModal";
import { BigNumber } from "bignumber.js";
import { error } from "../../slices/MessagesSlice";
import { useAppDispatch } from "src/hooks";
import { changeGive, ACTION_GIVE } from "src/slices/GiveThunk";
import { DepositSohm, LockInVault, ReceivesYield } from "../../components/EducationCard";
import { GiveInfo } from "./GiveInfo";

export default function CausesDashboard() {
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const [zoomed, setZoomed] = useState(false);
  const [isCustomGiveModalOpen, setIsCustomGiveModalOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  const { projects } = data;

  // We use useAppDispatch here so the result of the AsyncThunkAction is typed correctly
  // See: https://stackoverflow.com/a/66753532
  const dispatch = useAppDispatch();

  const renderProjects = useMemo(() => {
    return projects.map(project => {
      return <ProjectDetails project={project} />;
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
      return dispatch(error("Please enter a value!"));
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
        networkID: chainID,
      }),
    );

    setIsCustomGiveModalOpen(false);
  };

  const handleCustomGiveModalCancel: CancelCallback = () => {
    setIsCustomGiveModalOpen(false);
  };

  return (
    <>
      <div className="give-view">
        <Zoom in={true}>
          <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
            <div className="card-header">
              <div className="give-yield-title">
                <Typography variant="h5">Causes Dashboard</Typography>
              </div>
              <div className="give-education">
                <DepositSohm />
                <LockInVault />
                <ReceivesYield />
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
                onClick={() => handleCustomGiveButtonClick()}
                disabled={!address}
              >
                Custom Recipient
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
    </>
  );
}
