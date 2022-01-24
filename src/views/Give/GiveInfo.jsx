import { t, Trans } from "@lingui/macro";
import { Box, Button, Grid, Paper, SvgIcon, Typography } from "@material-ui/core";

import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { DepositSohm, LockInVault, ReceivesYield } from "../../components/EducationCard";

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
          <Button
            variant="outlined"
            color="secondary"
            href="https://docs.olympusdao.finance/main/basics/basics/olympusgive"
            target="_blank"
            className="learn-more-button"
          >
            <Typography variant="body1">
              <Trans>Learn More</Trans>
            </Typography>
            <SvgIcon component={ArrowUp} color="primary" />
          </Button>
        </Box>
      </Paper>
    </>
  );
}
