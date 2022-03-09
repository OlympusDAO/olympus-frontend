import { t, Trans } from "@lingui/macro";
import { Box, Grid, useMediaQuery } from "@material-ui/core";
import { Paper, TertiaryButton } from "@olympusdao/component-library";

import { DepositSohm, LockInVault, ReceivesYield } from "../../components/EducationCard";

export function GiveInfo() {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  return (
    <>
      <Paper className={"ohm-card secondary"}>
        {/* On large screens, we want educational information to be horizontal. 
            The style override works around an inability to override the grid container */}
        <Grid container className={"give-info"} style={isLargeScreen ? { flexWrap: "nowrap" } : undefined}>
          <Grid item className="give-info-deposit-box">
            <DepositSohm message={t`Deposit sOHM from wallet`} />
          </Grid>
          <Grid item className="give-info-vault-box">
            <LockInVault message={t`Lock sOHM in vault`} />
          </Grid>
          <Grid item className="give-info-yield-box">
            <ReceivesYield message={t`Recipient earns sOHM rebases`} />
          </Grid>
        </Grid>
        <Box className="button-box">
          <TertiaryButton
            href="https://docs.olympusdao.finance/main/basics/basics/olympusgive"
            target="_blank"
            className="learn-more-button"
          >
            <Trans>Learn More</Trans>
          </TertiaryButton>
        </Box>
      </Paper>
    </>
  );
}
