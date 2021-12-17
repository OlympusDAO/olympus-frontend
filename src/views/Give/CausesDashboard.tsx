import { useMemo, useState, useCallback } from "react";
import "./give.scss";
import { NavLink, useLocation } from "react-router-dom";
import { Button, Box, Link, Paper, Typography, Zoom, Grid, Container } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ProjectCard, { ProjectDetailsMode } from "src/components/GiveProject/ProjectCard";
import data from "./projects.json";
import { CancelCallback, RecipientModal, SubmitCallback } from "./RecipientModal";
import { BigNumber } from "bignumber.js";
import { error } from "../../slices/MessagesSlice";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { changeGive, changeMockGive, ACTION_GIVE } from "src/slices/GiveThunk";
import { GiveInfo } from "./GiveInfo";
import { useUIDSeed } from "react-uid";
import { useSelector } from "react-redux";
import { t, Trans } from "@lingui/macro";
import { IAccountSlice } from "src/slices/AccountSlice";
import { IAppData } from "src/slices/AppSlice";
import { IPendingTxn } from "src/slices/PendingTxnsSlice";
import { EnvHelper } from "src/helpers/Environment";

type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
  app: IAppData;
};
export default function CausesDashboard() {
  const location = useLocation();
  const { provider, address } = useWeb3Context();
  const networkId = useAppSelector(state => state.network.networkId);
  const [isCustomGiveModalOpen, setIsCustomGiveModalOpen] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isMediumScreen = useMediaQuery("(max-width: 980px)") && !isSmallScreen;
  const { projects } = data;

  // We use useAppDispatch here so the result of the AsyncThunkAction is typed correctly
  // See: https://stackoverflow.com/a/66753532
  const dispatch = useAppDispatch();
  const seed = useUIDSeed();

  const donationInfo = useSelector((state: State) => {
    return networkId === 4 && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.mockGiving && state.account.mockGiving.donationInfo
      : state.account.giving && state.account.giving.donationInfo;
  });

  const redeemableBalance = useSelector((state: State) => {
    return state.account.redeeming && state.account.redeeming.sohmRedeemable;
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
    if (networkId === 4 && EnvHelper.isMockSohmEnabled(location.search)) {
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
      }}
    >
      <Box className={`give-subnav ${isSmallScreen && "smaller"}`}>
        {Object.keys(donationInfo).length > 0 ? (
          <Link component={NavLink} id="give-sub-donations" to="/give/donations" className="give-option">
            <Typography variant="h6">My Donations</Typography>
          </Link>
        ) : (
          <></>
        )}

        {new BigNumber(redeemableBalance).gt(new BigNumber(0)) ? (
          <Link component={NavLink} id="give-sub-redeem" to="/give/redeem" className="give-option">
            <Typography variant="h6">Redeem</Typography>
          </Link>
        ) : (
          <></>
        )}
      </Box>
      <div
        id="give-view"
        className={`${isMediumScreen && "medium"}
          ${isSmallScreen && "smaller"}`}
      >
        <Zoom in={true}>
          <Paper className={`ohm-card secondary`}>
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
    </Container>
  );
}
