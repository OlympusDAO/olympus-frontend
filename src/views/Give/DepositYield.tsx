import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppSelector } from "src/hooks";
import { NavLink, useLocation } from "react-router-dom";
import { Paper, Typography, Zoom, Container, Box, Link, SvgIcon } from "@material-ui/core";
import { BigNumber } from "bignumber.js";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";
import YieldRecipients from "./YieldRecipients";
import { t, Trans } from "@lingui/macro";
import { IAccountSlice } from "src/slices/AccountSlice";
import { IPendingTxn } from "src/slices/PendingTxnsSlice";
import { IAppData } from "src/slices/AppSlice";
import { ChevronLeft } from "@material-ui/icons";
import { EnvHelper } from "src/helpers/Environment";

type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
  app: IAppData;
};

export default function DepositYield() {
  const location = useLocation();
  const networkId = useAppSelector(state => state.network.networkId);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const redeemableBalance = useSelector((state: State) => {
    return networkId === 4 && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.mockRedeeming && state.account.mockRedeeming.sohmRedeemable
      : state.account.redeeming && state.account.redeeming.sohmRedeemable;
  });

  return (
    <Container
      style={{
        paddingLeft: isSmallScreen ? "0" : "3.3rem",
        paddingRight: isSmallScreen ? "0" : "3.3rem",
      }}
    >
      <Box className={`give-subnav ${isSmallScreen && "smaller"}`}>
        <Link
          component={NavLink}
          id="give-sub-dash"
          to="/give"
          className={`give-option ${location.pathname.replace("/", "") == "give" ? "give-active" : ""}`}
        >
          <Typography variant="h6">Projects</Typography>
        </Link>
        <Link
          component={NavLink}
          id="give-sub-donations"
          to="/give/donations"
          className={`give-option ${location.pathname.replace("/", "") == "give/donations" ? "give-active" : ""}`}
        >
          <Typography variant="h6">My Donations</Typography>
        </Link>
        {new BigNumber(redeemableBalance).gt(new BigNumber(0)) ? (
          <Link component={NavLink} id="give-sub-redeem" to="/give/redeem" className="give-option">
            <Typography variant="h6">Redeem</Typography>
          </Link>
        ) : (
          <></>
        )}
      </Box>
      <div id="give-view">
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
