import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { t, Trans } from "@lingui/macro";
import { shorten, trim, prettyVestingPeriod } from "../../helpers";
import { redeemBond } from "../../slices/BondSlice";
import BondLogo from "../../components/BondLogo";
import { Box, Button, TableCell, TableRow, Typography } from "@material-ui/core";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import { useBonds, useWeb3Context } from "src/hooks";
import { isPendingTxn, txnButtonText, txnButtonTextGeneralPending } from "src/slices/PendingTxnsSlice";

export function ClaimBondTableData({ userBond }) {
  const dispatch = useDispatch();
  const { address, provider, networkId } = useWeb3Context();
  const { bonds, expiredBonds } = useBonds(networkId);

  const bond = userBond[1];
  const bondName = bond.bond;

  const isAppLoading = useSelector(state => state.app.loading ?? true);

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const vestingPeriod = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
  };

  async function onRedeem({ autostake }) {
    // TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
    let currentBond = [...bonds, ...expiredBonds].find(bnd => bnd.name === bondName);
    await dispatch(redeemBond({ address, bond: currentBond, networkID: networkId, provider, autostake }));
  }

  return (
    <TableRow id={`${bondName}--claim`}>
      <TableCell align="left" className="bond-name-cell">
        <BondLogo bond={bond} />
        <div className="bond-name">
          <Typography variant="body1">
            {bond.displayName ? trim(bond.displayName, 4) : <Skeleton width={100} />}
          </Typography>
        </div>
      </TableCell>
      <TableCell align="center">
        {bond.pendingPayout ? trim(bond.pendingPayout, 4) : <Skeleton width={100} />}
      </TableCell>
      <TableCell align="center">{bond.interestDue ? trim(bond.interestDue, 4) : <Skeleton width={100} />}</TableCell>
      <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
        {isAppLoading ? <Skeleton /> : vestingPeriod()}
      </TableCell>
      <TableCell align="right">
        <Button
          variant="outlined"
          color="primary"
          disabled={
            isPendingTxn(pendingTransactions, "redeem_bond_" + bond.displayName) ||
            isPendingTxn(pendingTransactions, "redeem_all_bonds") ||
            isPendingTxn(pendingTransactions, "redeem_all_bonds_autostake")
          }
          onClick={() => onRedeem({ autostake: false })}
        >
          <Typography variant="h6">
            {txnButtonText(pendingTransactions, "redeem_bond_" + bond.displayName, "Claim")}
          </Typography>
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function ClaimBondCardData({ userBond }) {
  const dispatch = useDispatch();
  const { address, provider, networkId } = useWeb3Context();
  const { bonds, expiredBonds } = useBonds(networkId);

  const bond = userBond[1];
  const bondName = bond.bond;

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const vestingPeriod = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
  };

  async function onRedeem({ autostake }) {
    // TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
    let currentBond = [...bonds, ...expiredBonds].find(bnd => bnd.name === bondName);
    await dispatch(redeemBond({ address, bond: currentBond, networkID: networkId, provider, autostake }));
  }

  return (
    <Box id={`${bondName}--claim`} className="claim-bond-data-card bond-data-card" style={{ marginTop: "10px" }}>
      <Box className="bond-pair">
        <BondLogo bond={bond} />
        <Box className="bond-name">
          <Typography>{bond.displayName ? trim(bond.displayName, 4) : <Skeleton width={100} />}</Typography>
        </Box>
      </Box>

      <div className="data-row">
        <Typography>Claimable</Typography>
        <Typography>{bond.pendingPayout ? trim(bond.pendingPayout, 4) : <Skeleton width={100} />}</Typography>
      </div>

      <div className="data-row">
        <Typography>Pending</Typography>
        <Typography>{bond.interestDue ? trim(bond.interestDue, 4) : <Skeleton width={100} />}</Typography>
      </div>

      <div className="data-row" style={{ marginBottom: "20px" }}>
        <Typography>Fully Vested</Typography>
        <Typography>{vestingPeriod()}</Typography>
      </div>
      <Box display="flex" justifyContent="space-around" alignItems="center" className="claim-bond-card-buttons">
        <Button
          variant="outlined"
          color="primary"
          disabled={
            isPendingTxn(pendingTransactions, "redeem_bond_" + bond.displayName) ||
            isPendingTxn(pendingTransactions, "redeem_all_bonds") ||
            isPendingTxn(pendingTransactions, "redeem_all_bonds_autostake")
          }
          onClick={() => onRedeem({ autostake: false })}
        >
          <Typography variant="h5">
            {txnButtonText(pendingTransactions, "redeem_bond_" + bond.displayName, t`Claim`)}
          </Typography>
        </Button>
        <Button
          variant="outlined"
          color="primary"
          disabled={
            isPendingTxn(pendingTransactions, "redeem_bond_" + bond.displayName) ||
            isPendingTxn(pendingTransactions, "redeem_all_bonds") ||
            isPendingTxn(pendingTransactions, "redeem_all_bonds_autostake")
          }
          onClick={() => onRedeem({ autostake: true })}
        >
          <Typography variant="h5">
            {txnButtonText(pendingTransactions, "redeem_bond_" + bond.displayName, t`Claim and Stake`)}
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}
