import { useSelector, useDispatch } from "react-redux";
import { Button, Typography, Box } from "@material-ui/core";
import { redeemBond } from "../../actions/Bond.actions";
import { trim, secondsUntilBlock, prettifySeconds, prettyVestingPeriod, toNum } from "../../helpers";
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
    return state.app.currentBlock || 0;
  });

  const bondMaturationBlock = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && state.bonding[bond].bondMaturationBlock) || 0;
  });

  const vestingTerm = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && state.bonding[bond].vestingBlock) || 0;
  });

  const interestDue = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && state.bonding[bond].interestDue) || 0;
  });

  const pendingPayout = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && Number(state.bonding[bond].pendingPayout)) || 0;
  });

  async function onRedeem({ autostake }: { autostake: boolean }) {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }
    await dispatch(redeemBond({ address, bond, networkID: 1, provider, autostake }));
  }

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bondMaturationBlock);
  };

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock.toString()) + parseInt(vestingTerm.toString());
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds, "day");
  };

  const bondDiscount = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && state.bonding[bond].bondDiscount) || 0;
  });

  const debtRatio = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && state.bonding[bond].debtRatio) || 0;
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
        <Typography>{trim(toNum(debtRatio) / 10000000, 2)}%</Typography>
      </div>

      <div className="data-row">
        <Typography>Vesting Term</Typography>
        <Typography>{vestingPeriod()}</Typography>
      </div>
    </>
  );
}

export default BondRedeem;
