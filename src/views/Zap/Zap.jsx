import { useState, useRef, useEffect, useMemo } from "react";
import { Box, Button, Fade, Paper, Tab, Tabs, Typography, Zoom } from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import "./zap.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import ZapStakeAction from "./ZapStakeAction";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Zap({ initialTab }) {
  const { address, connect } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(initialTab ?? 0);
  const tokens = useSelector(state => state.zap.balances);

  const changeView = (event, newView) => {
    setView(newView);
  };

  // const hasAllowance = useCallback(
  //   token => {
  //     if (token === "ohm") return stakeAllowance > 0;
  //     if (token === "sohm") return unstakeAllowance > 0;
  //     return 0;
  //   },
  //   [stakeAllowance, unstakeAllowance],
  // );

  // const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  return (
    <div id="zap-view">
      {/* <Box flexDirection="row" minWidth="350px">
        <Tabs
          key={String(zoomed)}
          centered
          value={view}
          textColor="primary"
          indicatorColor="primary"
          className="stake-tab-buttons"
          onChange={changeView}
          aria-label="stake tabs"
          variant="fullWidth"
          wrapped
        >
          <Tab
            label={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                Zap-Stake
                <FlashOnIcon />
              </div>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                Zap-Bond
              </div>
            }
            {...a11yProps(1)}
          />
        </Tabs>
      </Box> */}
      <Paper className="ohm-card">
        <div className="staking-area">
          {!address ? (
            <div className="stake-wallet-notification">
              <div className="wallet-menu" id="wallet-menu">
                <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
                  Connect Wallet
                </Button>
              </div>
              <Typography variant="h6">Connect your wallet to use Zap</Typography>
            </div>
          ) : (
            <>
              <Box className="stake-action-area">
                <Box alignSelf="center" minWidth="420px" width="80%"></Box>

                <TabPanel value={view} index={0} className="stake-tab-panel">
                  <ZapStakeAction address={address} />
                </TabPanel>
              </Box>
            </>
          )}
        </div>
      </Paper>
    </div>
  );
}

export default Zap;
