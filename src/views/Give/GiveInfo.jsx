import { Paper, Grid, Box, Button, Typography, SvgIcon } from "@material-ui/core";
import { DepositSohm, LockInVault, ReceivesYield, ArrowGraphic } from "../../components/EducationCard";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { t, Trans } from "@lingui/macro";
import { SecondaryButton } from "@olympusdao/component-library";

export function GiveInfo() {
  return (
    <>
      <Paper className={"ohm-card secondary"}>
        <Grid container className="give-info">
          <Grid item xs={12} sm={4} className="give-info-deposit-box">
            <DepositSohm message={t`Deposit sOHM from wallet`} />
          </Grid>
          <Grid item xs={12} sm={4} className="give-info-vault-box">
            <LockInVault message={t`Lock sOHM in vault`} />
          </Grid>
          <Grid item xs={12} sm={4} className="give-info-yield-box">
            <ReceivesYield message={t`Recipient earns sOHM rebases`} />
          </Grid>
        </Grid>
        <Box className="button-box">
          <SecondaryButton size="small" href="https://docs.olympusdao.finance/main/basics/basics/olympusgive">
            <Trans>Learn More</Trans>
          </SecondaryButton>
        </Box>
      </Paper>
    </>
  );
}
