import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Paper, Typography, Zoom } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useWeb3Context } from "src/hooks/web3Context";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";
import YieldRecipients from "./YieldRecipients";
import { t, Trans } from "@lingui/macro";

export default function DepositYield() {
  const { hasCachedProvider, connect } = useWeb3Context();
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

  // TODO if not needed, remove?
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
              <Typography variant="h5">
                <Trans>Deposits Dashboard</Trans>
              </Typography>
              <InfoTooltip
                message={t`Direct yield from your deposited sOHM to other recipients. Your sOHM is deposited in a vault, but you can withdraw it or change the deposited amount at any time.`}
                children={null}
              />
            </div>
          </div>
          <YieldRecipients />
        </Paper>
      </Zoom>
    </div>
  );
}
