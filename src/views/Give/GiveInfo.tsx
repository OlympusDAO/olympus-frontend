import { t, Trans } from "@lingui/macro";
import { Grid } from "@material-ui/core";
import { Paper, TertiaryButton } from "@olympusdao/component-library";

import { DepositSohm, LockInVault, ReceivesYield } from "../../components/EducationCard";

export function GiveInfo() {
  return (
    <>
      <Paper>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <DepositSohm message={t`Deposit sOHM from wallet`} />
          </Grid>
          <Grid item xs={12} md={4}>
            <LockInVault message={t`Lock sOHM in vault`} />
          </Grid>
          <Grid item xs={12} md={4}>
            <ReceivesYield message={t`Recipient earns sOHM rebases`} />
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <TertiaryButton href="https://docs.olympusdao.finance/main/basics/basics/olympusgive" target="_blank">
              <Trans>Learn More</Trans>
            </TertiaryButton>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
