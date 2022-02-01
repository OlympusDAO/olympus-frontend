import "./Give.scss";

import { t, Trans } from "@lingui/macro";
import { Box, Button, Paper, Typography, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { BigNumber } from "bignumber.js";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useUIDSeed } from "react-uid";
import ProjectCard, { ProjectDetailsMode } from "src/components/GiveProject/ProjectCard";
import { NetworkId } from "src/constants";
import { EnvHelper } from "src/helpers/Environment";
import { useAppDispatch } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { ACTION_GIVE, changeGive, changeMockGive, isSupportedChain } from "src/slices/GiveThunk";
import { CancelCallback, SubmitCallback } from "src/views/Give/Interfaces";
import { RecipientModal } from "src/views/Give/RecipientModal";

import { error } from "../../slices/MessagesSlice";
import data from "./projects.json";

export default function CausesDashboard() {
  const location = useLocation();
  const { provider, address, networkId } = useWeb3Context();
  const [isCustomGiveModalOpen, setIsCustomGiveModalOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isMediumScreen = useMediaQuery("(max-width: 980px)") && !isSmallScreen;
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
    eventSource: string,
    depositAmount: BigNumber,
  ) => {
    if (depositAmount.isEqualTo(new BigNumber(0))) {
      return dispatch(error(t`Please enter a value!`));
    }

    // If on Rinkeby and using Mock Sohm, use the changeMockGive async thunk
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

    setIsCustomGiveModalOpen(false);
  };

  const handleCustomGiveModalCancel: CancelCallback = () => {
    setIsCustomGiveModalOpen(false);
  };

  return (
    <div
      id="give-view"
      className={`${isMediumScreen ? "medium" : ""}
      ${isSmallScreen ? "smaller" : ""}}`}
    >
      <Zoom in={true}>
        <Box className={`ohm-card secondary causes-container`}>
          {!isSupportedChain(networkId) ? (
            <Typography variant="h6">
              Note: You are currently using an unsupported network. Please switch to Ethereum to experience the full
              functionality.
            </Typography>
          ) : (
            <></>
          )}
          <div className="causes-body">
            <Box className="data-grid">{renderProjects}</Box>
          </div>
          <Paper
            className={isSmallScreen ? "custom-recipient smaller" : "custom-recipient"}
            style={{ borderRadius: "10px" }}
          >
            <Typography variant="h4" align="center" className="custom-recipient-headline">
              Want to give to a different cause?
            </Typography>
            <Typography
              variant="body1"
              align="center"
              className="custom-recipient-body"
              style={{ marginBottom: "30px" }}
            >
              You can direct your yield to a recipient of your choice
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              className="custom-give-button"
              onClick={() => handleCustomGiveButtonClick()}
              disabled={!address}
            >
              <Typography variant="body1" style={{ marginBottom: "0px" }}>
                <Trans>Custom Recipient</Trans>
              </Typography>
            </Button>
          </Paper>
          <RecipientModal
            isModalOpen={isCustomGiveModalOpen}
            eventSource="Custom Recipient Button"
            callbackFunc={handleCustomGiveModalSubmit}
            cancelFunc={handleCustomGiveModalCancel}
          />
        </Box>
      </Zoom>
    </div>
  );
}
