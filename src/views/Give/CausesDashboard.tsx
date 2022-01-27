import "./Give.scss";

import { t, Trans } from "@lingui/macro";
import { Box, Button, Container, Typography, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { BigNumber } from "bignumber.js";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useUIDSeed } from "react-uid";
import { GiveHeader } from "src/components/GiveProject/GiveHeader";
import ProjectCard, { ProjectDetailsMode } from "src/components/GiveProject/ProjectCard";
import { NetworkId } from "src/constants";
import { EnvHelper } from "src/helpers/Environment";
import { useAppDispatch } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { IAccountSlice } from "src/slices/AccountSlice";
import { IAppData } from "src/slices/AppSlice";
import { ACTION_GIVE, changeGive, changeMockGive, isSupportedChain } from "src/slices/GiveThunk";
import { IPendingTxn } from "src/slices/PendingTxnsSlice";
import { CancelCallback, SubmitCallback } from "src/views/Give/Interfaces";
import { RecipientModal } from "src/views/Give/RecipientModal";

import { error } from "../../slices/MessagesSlice";
import { GiveInfo } from "./GiveInfo";
import data from "./projects.json";

type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
  app: IAppData;
};
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

  const donationInfo = useSelector((state: State) => {
    return networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.mockGiving && state.account.mockGiving.donationInfo
      : state.account.giving && state.account.giving.donationInfo;
  });

  const totalDebt = useSelector((state: State) => {
    return networkId === NetworkId.TESTNET_RINKEBY && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.mockRedeeming && state.account.mockRedeeming.recipientInfo.totalDebt
      : state.account.redeeming && state.account.redeeming.recipientInfo.totalDebt;
  });

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

    // If reducing the amount of deposit, withdraw
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
        }),
      );
    }

    setIsCustomGiveModalOpen(false);
  };

  const handleCustomGiveModalCancel: CancelCallback = () => {
    setIsCustomGiveModalOpen(false);
  };

  return (
    <Container
      style={{
        paddingLeft: isSmallScreen ? "0" : "3.3rem",
        paddingRight: isSmallScreen ? "0" : "3.3rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box className={isSmallScreen ? "subnav-paper mobile" : "subnav-paper"}>
        <GiveHeader
          isSmallScreen={isSmallScreen}
          isVerySmallScreen={false}
          totalDebt={new BigNumber(totalDebt)}
          networkId={networkId}
        />
        <div
          id="give-view"
          className={`${isMediumScreen && "medium"}
          ${isSmallScreen && "smaller"}`}
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
              <div className={isSmallScreen ? "custom-recipient smaller" : "custom-recipient"}>
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
            </Box>
          </Zoom>
          <Zoom in={true}>
            <GiveInfo />
          </Zoom>
        </div>
      </Box>
    </Container>
  );
}
