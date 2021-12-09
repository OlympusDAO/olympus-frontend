import { Paper, Box, Button, Typography, SvgIcon } from "@material-ui/core";
import { DepositSohm, LockInVault, ReceivesYield, ArrowGraphic } from "../../components/EducationCard";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";

export function GiveInfo() {
  return (
    <>
      <Paper className={"ohm-card secondary"}>
        <div className="card-header">
          <div className="give-yield-title">
            <Typography variant="h5">How It Works</Typography>
          </div>
        </div>
        <div className="give-info">
          <Box className="give-info-deposit-box">
            <DepositSohm message="Deposit sOHM from wallet" />
          </Box>
          <ArrowGraphic />
          <Box className="give-info-vault-box">
            <LockInVault message="Lock sOHM in vault" />
          </Box>
          <ArrowGraphic />
          <Box className="give-info-yield-box">
            <ReceivesYield message="Recipient earns sOHM rebases" />
          </Box>
        </div>
        <Box className="button-box">
          <Button
            variant="outlined"
            color="secondary"
            href="https://docs.olympusdao.finance/main/using-the-website/olyzaps"
            target="_blank"
            className="learn-more-button"
          >
            <Typography variant="body1">Learn More</Typography>
            <SvgIcon component={ArrowUp} color="primary" />
          </Button>
        </Box>
      </Paper>
    </>
  );
}
