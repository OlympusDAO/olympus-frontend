import { useState } from "react";
import "./give.scss";
import DepositYield from "./DepositYield";
import RedeemYield from "./RedeemYield";
import { Button, Paper, Typography, Zoom } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { t, Trans } from "@lingui/macro";
import { PrimaryButton } from "@olympusdao/component-library";

function Give() {
  const { address, connect } = useWeb3Context();
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  let connectButton = [];
  connectButton.push(
    <PrimaryButton className="connect-button" onClick={connect} key={1}>
      <Trans>Connect Wallet</Trans>
    </PrimaryButton>,
  );

  return (
    <>
      <div className="give-view">
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
          <>
            <DepositYield />
            <RedeemYield />
          </>
        )}
      </div>
    </>
  );
}

export default Give;
