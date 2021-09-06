import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Typography, Box, Slide } from "@material-ui/core";
import { redeemBond } from "../../slices/BondSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { trim, secondsUntilBlock, prettifySeconds, prettyVestingPeriod } from "../../helpers";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";

function BondRedeem({ bond }) {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  const isBondLoading = useSelector(state => state.bonding.loading ?? true);

  const vestingTerm = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].vestingBlock;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const userState = useSelector(state => {
    return state.account && state.account;
  });

  const userBonds = useSelector(state => {
    return state.account && state.account.bonds;
  });

  async function onRedeem({ autostake }) {
    await dispatch(redeemBond({ address, bond, networkID: chainID, provider, autostake }));
  }

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, userBonds[bond].bondMaturationBlock);
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
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around" flexWrap="wrap">
        <Button
          variant="contained"
          color="primary"
          id="bond-claim-btn"
          className="transaction-button"
          fullWidth
          disabled={isPendingTxn(pendingTransactions, "redeem_bond_" + bond)}
          onClick={() => {
            onRedeem({ autostake: false });
          }}
        >
          {txnButtonText(pendingTransactions, "redeem_bond_" + bond, "Claim")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          id="bond-claim-autostake-btn"
          className="transaction-button"
          fullWidth
          disabled={isPendingTxn(pendingTransactions, "redeem_bond_" + bond + "_autostake")}
          onClick={() => {
            onRedeem({ autostake: true });
          }}
        >
          {txnButtonText(pendingTransactions, "redeem_bond_" + bond + "_autostake", "Claim and Autostake")}
        </Button>
      </Box>

      <Slide direction="right" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
          <div className="data-row">
            <Typography>Pending Rewards</Typography>
            <Typography className="price-data">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(userBonds[bond].interestDue, 4)} OHM`}
            </Typography>
          </div>
          <div className="data-row">
            <Typography>Claimable Rewards</Typography>
            <Typography className="price-data">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(userBonds[bond].pendingPayout, 4)} OHM`}
            </Typography>
          </div>
          <div className="data-row">
            <Typography>Time until fully vested</Typography>
            <Typography className="price-data">{isBondLoading ? <Skeleton width="100px" /> : vestingTime()}</Typography>
          </div>

          <div className="data-row">
            <Typography>ROI</Typography>
            <Typography>{isBondLoading ? <Skeleton width="100px" /> : `${trim(bondDiscount * 100, 2)}%`}</Typography>
          </div>

          <div className="data-row">
            <Typography>Debt Ratio</Typography>
            <Typography>{isBondLoading ? <Skeleton width="100px" /> : `${trim(debtRatio / 10000000, 2)}%`}</Typography>
          </div>

          <div className="data-row">
            <Typography>Vesting Term</Typography>
            <Typography>{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}</Typography>
          </div>
        </Box>
      </Slide>
    </Box>
  );
}

export default BondRedeem;
