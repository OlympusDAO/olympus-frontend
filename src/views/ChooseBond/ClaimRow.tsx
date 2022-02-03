import "./ChooseBond.scss";

import { t } from "@lingui/macro";
import { Box, Button, TableCell, TableRow, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { TokenStack } from "@olympusdao/component-library";
import { useDispatch } from "react-redux";
import { useAppSelector, useBonds, useWeb3Context } from "src/hooks";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";

import { prettyVestingPeriod, trim } from "../../helpers";
import { redeemBond } from "../../slices/BondSlice";

export function ClaimBondTableData({ userBond }: { userBond: [string, IUserBondDetails] }) {
  const dispatch = useDispatch();
  const { address, provider, networkId } = useWeb3Context();
  const { bonds, expiredBonds } = useBonds(networkId);

  const bond = userBond[1];
  const bondName = bond.bond;

  const isAppLoading = useAppSelector(state => state.app.loading ?? true);

  const currentBlock = useAppSelector(state => {
    return state.app.currentBlock || 0;
  });

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const vestingPeriod = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
  };

  async function onRedeem({ autostake }: { autostake: boolean }) {
    // TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
    const currentBond = [...bonds, ...expiredBonds].find(bnd => bnd.name === bondName);
    await dispatch(redeemBond({ address, bond: currentBond!, networkID: networkId, provider, autostake }));
  }

  return (
    <TableRow id={`${bondName}--claim`}>
      <TableCell align="left" className="bond-name-cell">
        <TokenStack tokens={bond.bondIconSvg} />
        <div className="bond-name">
          <Typography variant="body1">
            {/* 0xdavinchee: we were previously trimmming the bond display name-I don't think this was the intent */}
            {bond.displayName ? bond.displayName : <Skeleton width={100} />}
          </Typography>
        </div>
      </TableCell>
      <TableCell align="center">
        {bond.pendingPayout ? trim(Number(bond.pendingPayout), 4) : <Skeleton width={100} />}
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

export function ClaimBondCardData({ userBond }: { userBond: [string, IUserBondDetails] }) {
  const dispatch = useDispatch();
  const { address, provider, networkId } = useWeb3Context();
  const { bonds, expiredBonds } = useBonds(networkId);

  const bond = userBond[1];
  const bondName = bond.bond;

  const currentBlock = useAppSelector(state => {
    return state.app.currentBlock || 0;
  });

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const vestingPeriod = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
  };

  async function onRedeem({ autostake }: { autostake: boolean }) {
    // TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
    const currentBond = [...bonds, ...expiredBonds].find(bnd => bnd.name === bondName);
    await dispatch(redeemBond({ address, bond: currentBond!, networkID: networkId, provider, autostake }));
  }

  return (
    <Box id={`${bondName}--claim`} className="claim-bond-data-card bond-data-card" style={{ marginTop: "10px" }}>
      <Box className="bond-pair">
        <TokenStack tokens={bond.bondIconSvg} />
        <Box className="bond-name">
          <Typography>{bond.displayName ? trim(bond.displayName as any, 4) : <Skeleton width={100} />}</Typography>
        </Box>
      </Box>

      <div className="data-row" style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>Claimable</Typography>
        <Typography>{bond.pendingPayout ? trim(Number(bond.pendingPayout), 4) : <Skeleton width={100} />}</Typography>
      </div>

      <div className="data-row" style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>Pending</Typography>
        <Typography>{bond.interestDue ? trim(bond.interestDue, 4) : <Skeleton width={100} />}</Typography>
      </div>

      <div className="data-row" style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
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
