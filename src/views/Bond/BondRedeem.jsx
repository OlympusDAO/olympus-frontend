import { useSelector, useDispatch } from "react-redux";
import { Button, Typography, Box } from "@material-ui/core";
import { redeemBond } from "../../actions/Bond.actions.js";
import { trim, secondsUntilBlock, prettifySeconds, prettyVestingPeriod } from "../../helpers";

function BondRedeem({ provider, address, bond }) {
  const dispatch = useDispatch();

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  const bondMaturationBlock = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondMaturationBlock;
  });

  const vestingTerm = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].vestingBlock;
  });

  const interestDue = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].interestDue;
  });

  const pendingPayout = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].pendingPayout;
  });

  async function onRedeem({ autostake }) {
    await dispatch(redeemBond({ address, bond, networkID: 1, provider, autostake }));
  }

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bondMaturationBlock);
  };

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock) + parseInt(vestingTerm);
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds, "day");
  };

  const bondDiscount = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });

  const debtRatio = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].debtRatio;
  });

  return (
    <>
      <Box display="flex" justifyContent="space-evenly">
        <Button
          variant="contained"
          color="primary"
          id="bond-claim-btn"
          className="transaction-button"
          fullWidth
          onClick={() => {
            onRedeem({ autostake: false });
          }}
        >
          Claim
        </Button>
        <Button
          variant="contained"
          color="primary"
          id="bond-claim-autostake-btn"
          className="transaction-button"
          fullWidth
          onClick={() => {
            onRedeem({ autostake: true });
          }}
        >
          Claim and Autostake
        </Button>
      </Box>

      <div className="data-row">
        <Typography>Pending Rewards</Typography>
        <Typography className="price-data">{trim(interestDue, 4)} OHM</Typography>
      </div>
      <div className="data-row">
        <Typography>Claimable Rewards</Typography>
        <Typography className="price-data">{trim(pendingPayout, 4)} OHM</Typography>
      </div>
      <div className="data-row">
        <Typography>Time until fully vested</Typography>
        <Typography className="price-data">{vestingTime()}</Typography>
      </div>

      <div className="data-row">
        <Typography>ROI</Typography>
        <Typography>{trim(bondDiscount * 100, 2)}%</Typography>
      </div>

      <div className="data-row">
        <Typography>Debt Ratio</Typography>
        <Typography>{trim(debtRatio / 10000000, 2)}%</Typography>
      </div>

      <div className="data-row">
        <Typography>Vesting Term</Typography>
        <Typography>{vestingPeriod()}</Typography>
      </div>
    </>
  );
}

export default BondRedeem;
