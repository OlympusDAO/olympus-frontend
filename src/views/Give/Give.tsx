import "./Give.scss";

import { Trans } from "@lingui/macro";
import { Paper, Typography, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ConnectButton from "src/components/ConnectButton/ConnectButton";
import { useWeb3Context } from "src/hooks/web3Context";

import DepositYield from "./DepositYield";
import RedeemYield from "./RedeemYield";

function Give() {
  const { address, connect } = useWeb3Context();
  const isSmallScreen = useMediaQuery("(max-width: 705px)");

  return (
    <>
      <div className="give-view">
        {!address ? (
          <Zoom in={true}>
            <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
              <div className="stake-wallet-notification">
                <div className="wallet-menu" id="wallet-menu">
                  <ConnectButton />
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
