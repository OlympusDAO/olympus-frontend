import "./Zap.scss";

import { Trans } from "@lingui/macro";
import { Box, Typography, Zoom } from "@material-ui/core";
import { Paper } from "@olympusdao/component-library";
import React, { useMemo } from "react";
import { useHistory } from "react-router";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import { useAppSelector } from "src/hooks";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useWeb3Context } from "src/hooks/web3Context";

import ZapInfo from "./ZapInfo";
import ZapStakeAction from "./ZapStakeAction";

const Zap: React.FC = () => {
  const { address, networkId } = useWeb3Context();
  const history = useHistory();
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
      <Zoom in={true}>
        <Paper headerText={address && `OlyZaps (Currently disabled for upcoming migration)`}>
          <div className="staking-area">
            {!address ? (
              <div className="stake-wallet-notification">
                <div className="wallet-menu" id="wallet-menu">
                  <ConnectButton />
                </div>
                <Typography variant="h6">
                  <Trans>Connect your wallet to use Zap</Trans>
                </Typography>
              </div>
            ) : (
              <Box className="stake-action-area">
                <Box alignSelf="center" minWidth="420px" width="80%"></Box>
                <ZapStakeAction />
              </Box>
            )}
          </div>
        </Paper>
      </Zoom>
      <Zoom in={true}>
        <ZapInfo tokens={inputTokenImages} address={address} />
      </Zoom>
    </div>
  );
};

export default Zap;
