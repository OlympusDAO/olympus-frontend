import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Paper, Typography, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useWeb3Context } from "src/hooks/web3Context";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";
import YieldRecipients from "./YieldRecipients";

export default function DepositYield() {
  const dispatch = useDispatch();
  const { provider, hasCachedProvider, address, connected, connect, chainID } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 705px)");

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
    }
  }, []);

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (walletChecked) {
      //   loadLusdData();
    }
  }, [walletChecked]);

  return (
    <div className="give-view">
      <Zoom in={true}>
        <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
          <div className="card-header">
            <div className="give-yield-title">
              <Typography variant="h5">Deposits Dashboard</Typography>
              <InfoTooltip message="Direct yield from your deposited sOHM to other recipients." children={null} />
            </div>
          </div>
          <YieldRecipients />
        </Paper>
      </Zoom>
    </div>
  );
}
