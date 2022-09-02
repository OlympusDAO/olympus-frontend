import "src/views/Give/RebaseRecipients.scss";

import { Trans } from "@lingui/macro";
import { Divider, Grid, Link, Typography, useTheme } from "@mui/material";
import { Skeleton } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { TertiaryButton } from "@olympusdao/component-library";
import { Link as RouterLink } from "react-router-dom";
import { GiveBox as Box } from "src/components/GiveProject/GiveBox";
import { useDonationInfo } from "src/hooks/useGiveInfo";
import { ChangeAssetType } from "src/slices/interfaces";
import { DepositTableRow } from "src/views/Give/DepositRow";

type RecipientModalProps = {
  giveAssetType: string;
  changeAssetType: ChangeAssetType;
};

export default function RebaseRecipients({ giveAssetType, changeAssetType }: RecipientModalProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: donationInfo = [], isFetching } = useDonationInfo();

  if (isFetching) {
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
              <Trans>Date</Trans>
            </Typography>
          </Grid>
        )}
        <Grid item xs={4} sm={2}>
          <Typography variant="body1" className="grey">
            <Trans>Recipient</Trans>
          </Typography>
        </Grid>
        <Grid item xs={4} sm={2} md={3} style={{ textAlign: "right" }}>
          <Typography variant="body1" className="grey">
            <Trans>Deposited</Trans>
          </Typography>
        </Grid>
        {!isSmallScreen && (
          <Grid item xs={4} sm={2} style={{ textAlign: "right" }}>
            <Typography variant="body1" className="grey">
              <Trans>Donated</Trans>
            </Typography>
          </Grid>
        )}
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
