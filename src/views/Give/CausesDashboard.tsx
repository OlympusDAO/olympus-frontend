import "./Give.scss";

import { t, Trans } from "@lingui/macro";
import { Container, Grid, Typography, Zoom } from "@material-ui/core";
import { Paper, TertiaryButton } from "@olympusdao/component-library";
import { BigNumber } from "bignumber.js";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUIDSeed } from "react-uid";
import ProjectCard, { ProjectDetailsMode } from "src/components/GiveProject/ProjectCard";
import { NetworkId } from "src/constants";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useAppDispatch } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { ACTION_GIVE, changeGive, changeMockGive } from "src/slices/GiveThunk";
import { CancelCallback, SubmitCallback } from "src/views/Give/Interfaces";
import { RecipientModal } from "src/views/Give/RecipientModal";

import { error } from "../../slices/MessagesSlice";
import data from "./projects.json";

export default function CausesDashboard() {
  const location = useLocation();
  const { provider, address, networkId } = useWeb3Context();
  const [isCustomGiveModalOpen, setIsCustomGiveModalOpen] = useState(false);
  const { projects } = data;

  // We use useAppDispatch here so the result of the AsyncThunkAction is typed correctly
  // See: https://stackoverflow.com/a/66753532
  const dispatch = useAppDispatch();
  const seed = useUIDSeed();

  const renderProjects = useMemo(() => {
    return projects.map(project => {
      return (
        <>
          <Grid item xs={12}>
            <ProjectCard key={seed(project.title)} project={project} mode={ProjectDetailsMode.Card} />
          </Grid>
        </>
      );
    });
  }, [projects]);

  const handleCustomGiveButtonClick = () => {
    setIsCustomGiveModalOpen(true);
  };

  const handleCustomGiveModalSubmit: SubmitCallback = async (
    walletAddress: string,
    eventSource: string,
    depositAmount: BigNumber,
  ) => {
    if (depositAmount.isEqualTo(new BigNumber(0))) {
      return dispatch(error(t`Please enter a value!`));
    }

    // If on Rinkeby and using Mock Sohm, use the changeMockGive async thunk
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

    setIsCustomGiveModalOpen(false);
  };

  const handleCustomGiveModalCancel: CancelCallback = () => {
    setIsCustomGiveModalOpen(false);
  };

  return (
    <Zoom in={true}>
      <Container>
        <Grid container justifyContent="center" alignItems="center" spacing={4}>
          {renderProjects}
          <Grid item xs={12}>
            <Paper fullWidth>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4" align="center">
                    <Trans>Want to give to a different cause?</Trans>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" align="center">
                    <Trans>You can direct your yield to a recipient of your choice</Trans>
                  </Typography>
                </Grid>
                <Grid item xs={12} container justifyContent="center">
                  <TertiaryButton onClick={() => handleCustomGiveButtonClick()} disabled={!address}>
                    <Trans>Custom Recipient</Trans>
                  </TertiaryButton>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <RecipientModal
          isModalOpen={isCustomGiveModalOpen}
          eventSource="Custom Recipient Button"
          callbackFunc={handleCustomGiveModalSubmit}
          cancelFunc={handleCustomGiveModalCancel}
        />
      </Container>
    </Zoom>
  );
}
