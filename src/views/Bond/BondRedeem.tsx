import { t, Trans } from "@lingui/macro";
import { Box, Button, Slide, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { DataRow } from "@olympusdao/component-library";
import { useDispatch } from "react-redux";
import { useAppSelector } from "src/hooks";
import { IAllBondData } from "src/hooks/Bonds";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";

import ConnectButton from "../../components/ConnectButton/ConnectButton";
import { prettifySeconds, prettyVestingPeriod, secondsUntilBlock, trim } from "../../helpers";
import { redeemBond } from "../../slices/BondSlice";
import { DisplayBondDiscount } from "./Bond";

function BondRedeem({ bond }: { bond: IAllBondData }) {
  const dispatch = useDispatch();
  const { provider, address, networkId } = useWeb3Context();

  const isBondLoading = useAppSelector(state => state.bonding.loading ?? true);

  const currentBlock = useAppSelector(state => {
    return state.app.currentBlock || 0;
  });
  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });
  const bondingState = useAppSelector(state => {
    return state.bonding && state.bonding[bond.name];
  });
  const bondDetails = useAppSelector(state => {
    return state.account.bonds && state.account.bonds[bond.name];
  });

  async function onRedeem({ autostake }: { autostake: boolean }) {
    await dispatch(redeemBond({ address, bond, networkID: networkId, provider, autostake }));
  }

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
  };

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock.toString()) + parseInt(bondingState.vestingTerm);
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
              disabled={
                isPendingTxn(pendingTransactions, "redeem_bond_" + bond.name) || Number(bond.pendingPayout) == 0.0
              }
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
                Number(bond.pendingPayout) == 0.0
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
            balance={`${trim(parseFloat(bond.pendingPayout), 4)} OHM`}
            isLoading={isBondLoading}
          />
          <DataRow title={t`Time until fully vested`} balance={vestingTime()} isLoading={isBondLoading} />
          {/* DisplayBondDiscount is not an acceptable type */}
          {/* <DataRow
            title={t`ROI`}
            balance={<DisplayBondDiscount key={bond.name} bond={bond} />}
            isLoading={isBondLoading}
          /> */}
          <Box display="flex" flexDirection="row" justifyContent="space-between">
            <Typography>
              <Trans>ROI</Trans>
            </Typography>
            <Typography>
              {isBondLoading ? <Skeleton width="80px" /> : <DisplayBondDiscount key={bond.name} bond={bond} />}
            </Typography>
          </Box>
          <DataRow title={t`Debt Ratio`} balance={`${trim(bond.debtRatio / 10000000, 2)}%`} isLoading={isBondLoading} />
          <DataRow title={t`Vesting Term`} balance={vestingPeriod()} isLoading={isBondLoading} />
        </Box>
      </Slide>
    </Box>
  );
}

export default BondRedeem;
