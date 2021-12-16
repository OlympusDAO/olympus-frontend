import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { Paper, Typography, Zoom, Container, Box, Link } from "@material-ui/core";
import { BigNumber } from "bignumber.js";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useWeb3Context } from "src/hooks/web3Context";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";
import YieldRecipients from "./YieldRecipients";
import { t, Trans } from "@lingui/macro";
import { IAccountSlice } from "src/slices/AccountSlice";
import { IPendingTxn } from "src/slices/PendingTxnsSlice";
import { IAppData } from "src/slices/AppSlice";

type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
  app: IAppData;
};

export default function DepositYield() {
  const { hasCachedProvider, connect } = useWeb3Context();
  const [walletChecked, setWalletChecked] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const redeemableBalance = useSelector((state: State) => {
    return state.account.redeeming && state.account.redeeming.sohmRedeemable;
  });

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
    <Container
      style={{
        paddingLeft: isSmallScreen ? "0" : "3.3rem",
        paddingRight: isSmallScreen ? "0" : "3.3rem",
      }}
    >
      <Box className="give-subnav">
        <Paper className="ohm-card secondary">
          <Link component={NavLink} id="give-sub-dash" to="/give" className="give-option">
            <Typography variant="h6">Back to Dashboard</Typography>
          </Link>
          {new BigNumber(redeemableBalance).gt(new BigNumber(0)) ? (
            <Link component={NavLink} id="give-sub-redeem" to="/give/redeem" className="give-option">
              <Typography variant="h6">Redeem Yield</Typography>
            </Link>
          ) : (
            <></>
          )}
        </Paper>
      </Box>
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
    </Container>
  );
}
