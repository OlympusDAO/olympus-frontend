import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Typography, Box, Slide } from "@material-ui/core";
import { t, Trans } from "@lingui/macro";
import { redeemBond } from "../../slices/BondSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { prettifySeconds, prettyVestingPeriod, secondsUntilBlock, trim } from "../../helpers";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { DisplayBondDiscount } from "./Bond";
import ConnectButton from "../../components/ConnectButton";
import { DataRow } from "@olympusdao/component-library";

function BondRedeem({ bond }) {
  // const { bond: bondName } = bond;
  const dispatch = useDispatch();
  const { provider, address, networkId } = useWeb3Context();

  const isBondLoading = useSelector(state => state.bonding.loading ?? true);

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  const bondingState = useSelector(state => {
    return state.bonding && state.bonding[bond.name];
  });
  const bondDetails = useSelector(state => {
    return state.account.bonds && state.account.bonds[bond.name];
  });

  async function onRedeem({ autostake }) {
    await dispatch(redeemBond({ address, bond, networkID: networkId, provider, autostake }));
  }

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
  };

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock) + parseInt(bondingState.vestingTerm);
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds, "day");
  };

  // useEffect(() => {
  //   console.log(bond);
  //   console.log(bondingState);
  //   console.log(bondDetails);
  // }, []);

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around" flexWrap="wrap">
        {!address ? (
          <ConnectButton />
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              id="bond-claim-btn"
              className="transaction-button"
              fullWidth
              disabled={isPendingTxn(pendingTransactions, "redeem_bond_" + bond.name) || bond.pendingPayout == 0.0}
              onClick={() => {
                onRedeem({ autostake: false });
              }}
            >
              {txnButtonText(pendingTransactions, "redeem_bond_" + bond.name, t`Claim`)}
            </Button>
            <Button
              variant="contained"
              color="primary"
              id="bond-claim-autostake-btn"
              className="transaction-button"
              fullWidth
              disabled={
                isPendingTxn(pendingTransactions, "redeem_bond_" + bond.name + "_autostake") ||
                bond.pendingPayout == 0.0
              }
              onClick={() => {
                onRedeem({ autostake: true });
              }}
            >
              {txnButtonText(pendingTransactions, "redeem_bond_" + bond.name + "_autostake", t`Claim and Autostake`)}
            </Button>
          </>
        )}
      </Box>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
          <DataRow title={t`Pending Rewards`} balance={`${trim(bond.interestDue, 4)} OHM`} isLoading={isBondLoading} />
          <DataRow
            title={t`Claimable Rewards`}
            balance={`${trim(bond.pendingPayout, 4)} OHM`}
            isLoading={isBondLoading}
          />
          <DataRow title={t`Time until fully vested`} balance={vestingTime()} isLoading={isBondLoading} />
          <DataRow
            title={t`ROI`}
            balance={<DisplayBondDiscount key={bond.name} bond={bond} />}
            isLoading={isBondLoading}
          />
          <DataRow title={t`Debt Ratio`} balance={`${trim(bond.debtRatio / 10000000, 2)}%`} isLoading={isBondLoading} />
          <DataRow title={t`Vesting Term`} balance={vestingPeriod()} isLoading={isBondLoading} />
        </Box>
      </Slide>
    </Box>
  );
}

export default BondRedeem;
