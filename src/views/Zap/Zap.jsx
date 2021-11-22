import { useState, useRef, useEffect, useMemo } from "react";
import { Box, Button, Fade, Paper, Tab, Tabs, Typography, Zoom } from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import "./zap.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import ZapStakeAction from "./ZapStakeAction";
import ZapInfo from "./ZapInfo";
import { useAppSelector } from "src/hooks";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const infoTokenIcons = [
  "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png",
  "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png",
];

function Zap() {
  const { address, connect, chainID, provider } = useWeb3Context();

  const tokens = useAppSelector(state => state.zap.balances);

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
      <Zoom in={true}>
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
                  <ZapStakeAction />
                </Box>
              </>
            )}
          </div>
        </Paper>
      </Zoom>
      <Zoom in={true}>
        <ZapInfo tokens={inputTokenImages} />
      </Zoom>
    </div>
  );
}

export default Zap;
