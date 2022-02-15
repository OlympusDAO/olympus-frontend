import { t, Trans } from "@lingui/macro";
import { Box, Button, Grid, Paper, SvgIcon, Typography, useMediaQuery } from "@material-ui/core";

import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
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
