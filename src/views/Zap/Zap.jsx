import { useState, useRef, useEffect, useMemo } from "react";
import { Box, Button, Fade, Paper, Tab, Tabs, Typography, Zoom, Grid } from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import "./zap.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import ZapStakeAction from "./ZapStakeAction";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { ReactComponent as CircleZapIcon } from "../../assets/icons/circle-zap.svg";
import ZapBondAction from "./ZapBondAction";
import HeaderLogo from "./HeaderLogo";
import { useSelector } from "react-redux";
import { Slide } from "@mui/material";

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

  const inputTokenImages = useMemo(
    () =>
      Object.entries(tokens)
        .filter(token => token[0] !== "sohm")
        .map(token => token[1].img)
        .slice(0, 3),
    [tokens],
  );

  const transitionEffect = children =>
    initialTab == null ? (
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        {children}
      </Zoom>
    ) : (
      <Slide in={true} direction="right">
        {children}
      </Slide>
    );
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
      {transitionEffect(
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
                  <TabPanel value={view} index={1} className="stake-tab-panel">
                    <ZapBondAction />
                  </TabPanel>
                </Box>
              </>
            )}
          </div>
        </Paper>,
      )}
      {transitionEffect(
        <Paper className="ohm-card" id="olyzaps-info">
          <Grid container direction="row" wrap spacing={4}>
            <Grid item xs={12} sm={4}>
              <Box alignItems="center" display="flex" flexDirection="column" className="oly-info-header-box">
                <HeaderLogo images={inputTokenImages} />
                <Typography color="textSecondary">You Give</Typography>
              </Box>
              <Box>
                <Typography variant="body1" className="oly-info-body-header">
                  Zap is a swap
                </Typography>
                <Typography align="left" variant="body2">
                  A zap swap is a series of smart contracts that deploys one asset to another a protocol to handle a
                  trusted transaction.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box alignItems="center" display="flex" flexDirection="column" className="oly-info-header-box">
                <HeaderLogo icons={[CircleZapIcon]} />
                <Typography color="textSecondary">All-in-one zap contracts</Typography>
              </Box>
              <Box>
                <Typography variant="body1" className="oly-info-body-header">
                  Save up to 75% on gas
                </Typography>
                <Typography align="left" variant="body2">
                  Our All-In-One easy zap and stake reduces the complexity of smart contracts to save you on gas fees.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box alignItems="center" display="flex" flexDirection="column" className="oly-info-header-box">
                <HeaderLogo
                  images={[
                    "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f.png",
                  ]}
                />
                <Typography color="textSecondary">You Get sOHM </Typography>
              </Box>
              <Box>
                <Typography variant="body1" className="oly-info-body-header">
                  Staking
                </Typography>
                <Typography align="left" variant="body2">
                  Staking is the primary value accrual strategy of Olympus. When you stake, you lock OHM and receive an
                  equal amount of sOHM.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>,
      )}
    </div>

    // </div>
  );
}

export default Zap;
