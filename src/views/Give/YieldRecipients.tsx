import "./YieldRecipients.scss";

import { Trans } from "@lingui/macro";
import { Divider, Grid, Link, Typography, useTheme } from "@mui/material";
import { Skeleton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { TertiaryButton } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import { GiveBox as Box } from "src/components/GiveProject/GiveBox";
import { useDonationInfo } from "src/hooks/useGiveInfo";
import { ChangeAssetType } from "src/slices/interfaces";

import { DepositTableRow } from "./DepositRow";

type RecipientModalProps = {
  giveAssetType: string;
  changeAssetType: ChangeAssetType;
};

export default function YieldRecipients({ giveAssetType, changeAssetType }: RecipientModalProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const rawDonationInfo = useDonationInfo().data;
  const donationInfo = rawDonationInfo ? rawDonationInfo : [];
  const isDonationInfoLoading = useDonationInfo().isLoading;

  const isLoading = isDonationInfoLoading;

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
            <Link to="/give" component={RouterLink}>
              <TertiaryButton>
                <Trans>Donate to a cause</Trans>
              </TertiaryButton>
            </Link>
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
            <DepositTableRow
              depositObject={donation}
              key={donation.recipient}
              giveAssetType={giveAssetType}
              changeAssetType={changeAssetType}
            />
            <Divider style={{ marginTop: "10px" }} />
          </Grid>
        );
      })}
    </Grid>
  );
}
