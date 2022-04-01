import "./YieldRecipients.scss";

import { Trans } from "@lingui/macro";
import { Divider, Grid, Typography, useTheme } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Skeleton } from "@material-ui/lab";
import { TertiaryButton } from "@olympusdao/component-library";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { GiveBox as Box } from "src/components/GiveProject/GiveBox";
import { NetworkId } from "src/constants";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useWeb3Context } from "src/hooks/web3Context";
import { DonationInfoState, IButtonChangeView } from "src/views/Give/Interfaces";

import { DepositTableRow } from "./DepositRow";

type RecipientModalProps = {
  changeView: IButtonChangeView;
};

export default function YieldRecipients({ changeView }: RecipientModalProps) {
  const location = useLocation();
  const { networkId } = useWeb3Context();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const isAppLoading = useSelector((state: DonationInfoState) => state.app.loading);
  const donationInfo = useSelector((state: DonationInfoState) => {
    return networkId === NetworkId.TESTNET_RINKEBY && Environment.isMockSohmEnabled(location.search)
      ? state.account.mockGiving && state.account.mockGiving.donationInfo
      : state.account.giving && state.account.giving.donationInfo;
  });

  const isDonationInfoLoading = useSelector((state: DonationInfoState) => state.account.loading);
  const isLoading = isAppLoading || isDonationInfoLoading;

  if (isLoading) {
    return <Skeleton />;
  }

  if (!donationInfo || donationInfo.length == 0) {
    return (
      <Box>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} container justifyContent="center">
            <Typography variant="body1">
              <Trans>Looks like you haven’t made any donations yet</Trans>
            </Typography>
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <TertiaryButton onClick={() => changeView(0)}>
              <Trans>Donate to a cause</Trans>
            </TertiaryButton>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} container>
        {!isSmallScreen && (
          <Grid item xs={2}>
            <Typography variant="body1" className="grey">
              <Trans>DATE</Trans>
            </Typography>
          </Grid>
        )}
        <Grid item xs={4} sm={3}>
          <Typography variant="body1" className="grey">
            <Trans>RECIPIENT</Trans>
          </Typography>
        </Grid>
        {!isSmallScreen && (
          <Grid item xs={2} style={{ textAlign: "right" }}>
            <Typography variant="body1" className="grey">
              <Trans>DEPOSITED</Trans>
            </Typography>
          </Grid>
        )}
        <Grid item xs={4} sm={2} style={{ textAlign: "right" }}>
          <Typography variant="body1" className="grey">
            <Trans>YIELD SENT</Trans>
          </Typography>
        </Grid>
        <Grid item xs={4} sm={3} />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {donationInfo.map(donation => {
        return (
          <Grid item xs={12}>
            <DepositTableRow depositObject={donation} key={donation.recipient} />
            <Divider style={{ marginTop: "10px" }} />
          </Grid>
        );
      })}
    </Grid>
  );
}
