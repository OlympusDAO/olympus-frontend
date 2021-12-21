import { useSelector } from "react-redux";
import { useAppSelector } from "src/hooks";
import { useLocation } from "react-router-dom";
import { Paper, Typography, Zoom, Container, Box } from "@material-ui/core";
import { BigNumber } from "bignumber.js";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import InfoTooltip from "src/components/InfoTooltip/InfoTooltip";
import YieldRecipients from "./YieldRecipients";
import { t, Trans } from "@lingui/macro";
import { IAccountSlice } from "src/slices/AccountSlice";
import { IPendingTxn } from "src/slices/PendingTxnsSlice";
import { IAppData } from "src/slices/AppSlice";
import { EnvHelper } from "src/helpers/Environment";
import { GiveHeader } from "src/components/GiveProject/GiveHeader";

type State = {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
  app: IAppData;
};

export default function DepositYield() {
  const location = useLocation();
  const networkId = useAppSelector(state => state.network.networkId);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const totalDebt = useSelector((state: State) => {
    return networkId === 4 && EnvHelper.isMockSohmEnabled(location.search)
      ? state.account.mockRedeeming && state.account.mockRedeeming.recipientInfo.totalDebt
      : state.account.redeeming && state.account.redeeming.recipientInfo.totalDebt;
  });

  return (
    <Container
      style={{
        paddingLeft: isSmallScreen ? "0" : "3.3rem",
        paddingRight: isSmallScreen ? "0" : "3.3rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box className={isSmallScreen ? "subnav-paper mobile" : "subnav-paper"} style={{ width: "100%" }}>
        <GiveHeader
          isSmallScreen={isSmallScreen}
          isVerySmallScreen={false}
          totalDebt={new BigNumber(totalDebt)}
          networkId={networkId}
        />
        <div id="give-view">
          <Zoom in={true}>
            <Paper className={`ohm-card secondary ${isSmallScreen && "mobile"}`}>
              <div className="card-header">
                <div className="give-yield-title">
                  <Typography variant="h5">
                    <Trans>Donate Yield</Trans>
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
      </Box>
    </Container>
  );
}
