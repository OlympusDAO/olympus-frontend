import { useDispatch } from "react-redux";
import { Button, Typography, Box, Slide } from "@material-ui/core";
import { redeemBond } from "../../actions/Bond.actions";
import { useWeb3Context } from "src/hooks/web3Context";
import { trim, secondsUntilBlock, prettifySeconds, prettyVestingPeriod } from "../../helpers";
import { useAppSelector } from "src/hooks";

function BondRedeem({ bond }: { bond: string }) {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();

  const currentBlock = useAppSelector(state => {
    return state.app.currentBlock;
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
    await dispatch(redeemBond({ address, bond, networkID: chainID, provider, autostake }));
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
    return (state.bonding && state.bonding[bond] && Number(state.bonding[bond].debtRatio)) || 0;
  });

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around" flexWrap="wrap">
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

      <Slide direction="right" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
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
        </Box>
      </Slide>
    </Box>
  );
}

export default BondRedeem;
