import "./Give.scss";

import { t, Trans } from "@lingui/macro";
import { Typography, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Paper, PrimaryButton, Tab, TabPanel, Tabs } from "@olympusdao/component-library";
import { useState } from "react";
import { useHistory } from "react-router";
import { useWeb3Context } from "src/hooks/web3Context";
import { isSupportedChain } from "src/slices/GiveThunk";

import CausesDashboard from "./CausesDashboard";
import { GiveInfo } from "./GiveInfo";
import RedeemYield from "./RedeemYield";
import YieldRecipients from "./YieldRecipients";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

/**
 * selectedIndex values:
 *
 * 0: project list
 * 1: my donations
 * 2: redeem
 */
type GiveProps = {
  selectedIndex?: number;
};

function Give({ selectedIndex }: GiveProps) {
  const { networkId, connect } = useWeb3Context();
  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(selectedIndex || 0);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const isMediumScreen = useMediaQuery("(max-width: 980px)") && !isSmallScreen;
  const connectButton = [];
  const history = useHistory();

  connectButton.push(
    <PrimaryButton className="connect-button" onClick={connect} key={1}>
      <Trans>Connect Wallet</Trans>
    </PrimaryButton>,
  );

  const changeView: any = (_event: React.ChangeEvent<unknown>, newView: number) => {
    buttonChangeView(newView);
  };

  /**
   * Handler for changing the selected tab from other files
   *
   * @param newView the index of the newly-selected tab
   */
  const buttonChangeView = (newView: number) => {
    setView(newView);

    if (newView === 0) {
      history.push("/give/");
    } else if (newView === 1) {
      history.push("/give/donations/");
    } else {
      history.push("/give/redeem/");
    }
  };

  return (
    <>
      <div
        id="give-view"
        className={`${isMediumScreen ? "medium" : ""}
        ${isSmallScreen ? "smaller" : ""}`}
      >
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
              className="give-tab-buttons"
              onChange={changeView}
              aria-label="stake tabs"
            >
              <Tab label={t`Causes`} {...a11yProps(0)} />
              <Tab label={t`My Donations`} {...a11yProps(1)} />
              <Tab label={t`Redeem`} {...a11yProps(2)} />
            </Tabs>

            <TabPanel value={view} index={0}>
              <CausesDashboard />
            </TabPanel>
            <TabPanel value={view} index={1}>
              {/* We have a button to switch tabs in this child component, so need to pass the handler. */}
              <YieldRecipients changeView={buttonChangeView} />
            </TabPanel>
            <TabPanel value={view} index={2}>
              <RedeemYield />
            </TabPanel>
          </Paper>
        </Zoom>
        <Zoom in={true}>
          <GiveInfo />
        </Zoom>
      </div>
    </>
  );
}

export default Give;
