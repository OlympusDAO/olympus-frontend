import { useSelector } from "react-redux";
import { Box, Typography, Button, SvgIcon } from "@material-ui/core";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import "./calltoaction.scss";

const CallToAction = ({ title }) => {
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const migrateButton = (
    <Button
      className="migrate-button"
      variant="contained"
      color="primary"
      disabled={isPendingTxn(pendingTransactions, "migrating")}
      onClick={() => {
        onChangeStake("stake");
      }}
    >
      {txnButtonText(pendingTransactions, "staking", "Migrate")}
    </Button>
  );

  const learMoreButton = (
    <Button
      variant="outlined"
      color="secondary"
      href="https://crucible.alchemist.wtf/reward-programs"
      target="_blank"
      className="learn-more-button"
    >
      <Typography variant="body1">Learn More</Typography>

      <SvgIcon component={ArrowUp} color="primary" />
    </Button>
  );

  return (
    <Box className="call-to-action ohm-card">
      <Typography variant="h5">{title}</Typography>
      <div className="actionable">
        {learMoreButton}
        {migrateButton}
      </div>
    </Box>
  );
};

export default CallToAction;
