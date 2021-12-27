import { useState, useRef, useEffect, useMemo } from "react";
import { Box, Fade, Tab, Tabs, Typography, Zoom } from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import "./zap.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import ZapStakeAction from "./ZapStakeAction";
import ZapInfo from "./ZapInfo";
import { useAppSelector } from "src/hooks";
import { Trans } from "@lingui/macro";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useHistory } from "react-router";
import { PrimaryButton, Paper } from "@olympusdao/component-library";

function Zap() {
  const { address, connect } = useWeb3Context();
  const history = useHistory();
  const networkId = useAppSelector(state => state.network.networkId);
  usePathForNetwork({ pathName: "zap", networkID: networkId, history });

  const tokens = useAppSelector(state => state.zap.balances);
  const inputTokenImages = useMemo(
    () =>
      Object.entries(tokens)
        .filter(token => token[0] !== "sohm")
        .map(token => token[1].img)
        .slice(0, 3),
    [tokens],
  );

  return (
    <div id="zap-view">
      <Paper>
        <div className="staking-area">
          {!address ? (
            <div className="stake-wallet-notification">
              <div className="wallet-menu" id="wallet-menu">
                <PrimaryButton size="large" onClick={connect} key={1}>
                  <Trans>Connect Wallet</Trans>
                </PrimaryButton>
              </div>
              <Typography variant="h6">
                <Trans>Connect your wallet to use Zap</Trans>
              </Typography>
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
      <Zoom in={true}>
        <ZapInfo tokens={inputTokenImages} address={address} />
      </Zoom>
    </div>
  );
}

export default Zap;
