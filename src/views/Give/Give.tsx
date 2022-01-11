import { useState } from "react";
import "./give.scss";
import DepositYield from "./DepositYield";
import RedeemYield from "./RedeemYield";
import { Button, Paper, Typography, Zoom, Tab, Tabs } from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import { useWeb3Context } from "src/hooks/web3Context";
import { isSupportedChain } from "src/slices/GiveThunk";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { t, Trans } from "@lingui/macro";
import CausesDashboard from "./CausesDashboard";
import { GiveInfo } from "./GiveInfo";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Give() {
  const { provider, address, networkId, connect } = useWeb3Context();
  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isMediumScreen = useMediaQuery("(max-width: 980px)") && !isSmallScreen;
  let connectButton = [];
  connectButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      <Trans>Connect Wallet</Trans>
    </Button>,
  );

  const changeView = (_event: React.ChangeEvent<{}>, newView: number) => {
    setView(newView);
  };

  return (
    <>
      <div
        id="give-view"
        className={`${isMediumScreen && "medium"}
        ${isSmallScreen && "smaller"}`}
      >
        {!address ? (
          <Zoom in={true}>
            <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
              <div className="stake-wallet-notification">
                <div className="wallet-menu" id="wallet-menu">
                  {connectButton}
                </div>
                <Typography variant="h6">
                  <Trans>Connect your wallet to give or redeem OHM</Trans>
                </Typography>
              </div>
            </Paper>
          </Zoom>
        ) : (
          <Zoom in={true} onEntered={() => setZoomed(true)}>
            <Paper className={`ohm-card secondary causes-container`}>
              <div className="card-header">
                <Typography variant="h5">Give</Typography>
              </div>
              {!isSupportedChain(networkId) ? (
                <Typography variant="h6">
                  Note: You are currently using an unsupported network. Please switch to Ethereum to experience the full
                  functionality.
                </Typography>
              ) : (
                <></>
              )}
              <Tabs
                key={String(zoomed)}
                centered
                value={view}
                textColor="primary"
                indicatorColor="primary"
                className="give-tab-buttons"
                onChange={changeView}
                aria-label="stake tabs"
                //hides the tab underline sliding animation in while <Zoom> is loading
                TabIndicatorProps={!zoomed ? { style: { display: "none" } } : undefined}
              >
                <Tab label={t`Causes`} {...a11yProps(0)} />
                <Tab label={t`My Donations`} {...a11yProps(1)} />
                <Tab label={t`Redeem`} {...a11yProps(2)} />
              </Tabs>

              <TabPanel value={view} index={0} className="stake-tab-panel">
                <CausesDashboard />
              </TabPanel>
              <TabPanel value={view} index={1} className="donations-tab-panel">
                <DepositYield />
              </TabPanel>
              <TabPanel value={view} index={2} className="redeem-tab-panel">
                <RedeemYield />
              </TabPanel>
            </Paper>
          </Zoom>
        )}
        <Zoom in={true}>
          <GiveInfo />
        </Zoom>
      </div>
    </>
  );
}

export default Give;
