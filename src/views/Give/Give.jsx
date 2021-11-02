import { useCallback, useState } from "react";
import "./give.scss";
import DepositYield from "./DepositYield";
import RedeemYield from "./RedeemYield";
import { Button, Paper, Typography, Zoom } from "@material-ui/core";
import { useWeb3Context } from "src/hooks/web3Context";
import useMediaQuery from "@material-ui/core/useMediaQuery";

function Give() {
  const { provider, address, connected, connect, chainID } = useWeb3Context();
  const [zoomed, setZoomed] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");
  let connectButton = [];
  connectButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  return (
    <>
      {!address ? (
        <Zoom in={true}>
          <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
            <div className="stake-wallet-notification">
              <div className="wallet-menu" id="wallet-menu">
                {connectButton}
              </div>
              <Typography variant="h6">Connect your wallet to give or redeem OHM</Typography>
            </div>
          </Paper>
        </Zoom>
      ) : (
        <>
          <div id="yield-directing-view">
            <DepositYield />
            <RedeemYield />
          </div>
        </>
      )}
    </>
  );
}

export default Give;
