import { Trans } from "@lingui/macro";
import { Grid } from "@mui/material";
import { Paper, TertiaryButton } from "@olympusdao/component-library";
import { LargeVault, LargeWallet, LargeYield } from "src/components/EducationCard";

export function GiveInfo() {
  return (
    <>
      <Paper fullWidth>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <LargeWallet />
          </Grid>
          <Grid item xs={12} md={4}>
            <LargeVault />
          </Grid>
          <Grid item xs={12} md={4}>
            <LargeYield />
          </Grid>
          <Grid item xs />
          <Grid item xs={3} container justifyContent="center">
            <TertiaryButton
              size="small"
              fullWidth
              href="https://docs.olympusdao.finance/main/basics/basics/olympusgive"
              target="_blank"
            >
              <Trans>Learn More</Trans>
            </TertiaryButton>
          </Grid>
          <Grid item xs />
        </Grid>
      </Paper>
    </>
  );
}
