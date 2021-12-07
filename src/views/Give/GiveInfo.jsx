import { Paper, Box, Typography } from "@material-ui/core";
import { DepositSohm, LockInVault, ReceivesYield, ArrowGraphic } from "../../components/EducationCard";

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
      </Paper>
    </>
  );
}
