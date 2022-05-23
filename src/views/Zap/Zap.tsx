import "./Zap.scss";

import { Trans } from "@lingui/macro";
import { Box, Typography } from "@mui/material";
import { Paper } from "@olympusdao/component-library";
import React, { useMemo } from "react";
import { useNavigate } from "react-router";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useZapTokenBalances } from "src/hooks/useZapTokenBalances";
import { useWeb3Context } from "src/hooks/web3Context";

import ZapInfo from "./ZapInfo";
import ZapStakeAction from "./ZapStakeAction";

const Zap: React.FC = () => {
  const { address, networkId } = useWeb3Context();
  const navigate = useNavigate();
  usePathForNetwork({ pathName: "zap", networkID: networkId, navigate });

  const zapTokenBalances = useZapTokenBalances();
  const tokens = zapTokenBalances.data?.balances;
  const inputTokenImages = useMemo(() => {
    if (tokens) {
      return Object.entries(tokens)
        .filter(token => token[0] !== "sohm")
        .map(token => token[1].tokenImageUrl)
        .slice(0, 3);
    } else {
      return [];
    }
  }, [tokens]);

  return (
    <div id="zap-view">
      <Paper headerText={address && `Zap`}>
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
              <ZapStakeAction />
            </Box>
          )}
        </div>
      </Paper>

      <ZapInfo tokens={inputTokenImages} address={address} />
    </div>
  );
};

export default Zap;
