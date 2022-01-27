import { t, Trans } from "@lingui/macro";
import { Box, Button, Grid, Paper, SvgIcon, Typography, useMediaQuery } from "@material-ui/core";

import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { DepositSohm, LockInVault, ReceivesYield } from "../../components/EducationCard";

export function GiveInfo() {
  // TODO shift to using breakpoints
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  return (
    <>
      <Paper className={"ohm-card secondary"}>
        <Grid container className={`give-info ${isSmallScreen ? "smaller" : ""}`}>
          <Grid item sm={8} md={3} className="give-info-deposit-box">
            <DepositSohm message={t`Deposit sOHM from wallet`} />
          </Grid>
          <Grid item sm={8} md={3} className="give-info-vault-box">
            <LockInVault message={t`Lock sOHM in vault`} />
          </Grid>
          <Grid item sm={8} md={3} className="give-info-yield-box">
            <ReceivesYield message={t`Recipient earns sOHM rebases`} />
          </Grid>
        </Grid>
        <Box className="button-box">
          <Button
            variant="outlined"
            color="primary"
            href="https://docs.olympusdao.finance/main/basics/basics/olympusgive"
            target="_blank"
            className="learn-more-button"
          >
            <Typography variant="body1">
              <Trans>Learn More</Trans>
            </Typography>
            <SvgIcon component={ArrowUp} path="secondary" />
          </Button>
        </Box>
      </Paper>
    </>
  );
}
