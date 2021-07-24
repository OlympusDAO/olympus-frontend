import { useSelector, useDispatch } from "react-redux";
import { Button, Typography, Box } from "@material-ui/core";
import { redeemBond } from "../../actions/Bond.actions";
import { trim, secondsUntilBlock, prettifySeconds, prettyVestingPeriod } from "../../helpers";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { useAppSelector } from "src/hooks";

export interface IBondRedeemProps {
  readonly address: string;
  readonly bond: string;
  readonly provider: StaticJsonRpcProvider | undefined;
}

function BondRedeem({ provider, address, bond }: IBondRedeemProps) {
  const dispatch = useDispatch();

  const currentBlock = useAppSelector(state => {
    return state.app.currentBlock;
  });

  // TS-REFACTOR-TODO: casted as not null for all state.bonding
  const bondMaturationBlock = useAppSelector(state => {
    return state.bonding![bond] && state.bonding![bond].bondMaturationBlock!; // TS-REFACTOR-TODO: casted as not null
  });

  const vestingTerm = useAppSelector(state => {
    return state.bonding![bond] && state.bonding![bond].vestingBlock!; // TS-REFACTOR-TODO: casted as not null
  });

  const interestDue = useAppSelector(state => {
    return state.bonding![bond] && state.bonding![bond].interestDue!; // TS-REFACTOR-TODO: casted as not null
  });

  const pendingPayout = useAppSelector(state => {
    return state.bonding![bond] && Number(state.bonding![bond].pendingPayout!); // TS-REFACTOR-TODO: casted as not null number
  });

  async function onRedeem({ autostake }: { autostake: boolean }) {
    await dispatch(redeemBond({ address, bond, networkID: 1, provider: provider!, autostake })); // TS-REFACTOR-TODO: casted as not null
  }

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bondMaturationBlock);
  };

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock.toString()) + parseInt(vestingTerm.toString()); // TS-REFACTOR-TODO: converted to string
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds, "day");
  };

  const bondDiscount = useAppSelector(state => {
    return state.bonding![bond] && state.bonding![bond].bondDiscount!;
  });

  const debtRatio = useAppSelector(state => {
    return state.bonding![bond] && (state.bonding![bond].debtRatio! as number); // TS-REFACTOR-TODO: casted as number
  });

  return (
    <>
      <Box display="flex" justifyContent="space-evenly" flexWrap="wrap">
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
