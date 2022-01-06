import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { t, Trans } from "@lingui/macro";
import { shorten, trim, prettyVestingPeriod } from "../../helpers";
import { redeemBond } from "../../slices/BondSlice";
import BondLogo from "../../components/BondLogo";
import { Box, Button, TableCell, TableRow, Typography } from "@material-ui/core";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import { useAppSelector, useBonds, useWeb3Context } from "src/hooks";
import { isPendingTxn, txnButtonTextGeneralPending } from "src/slices/PendingTxnsSlice";
import { IUserNote } from "src/slices/BondSliceV2";

export function ClaimBondTableData({ userNote, gOHM }: { userNote: IUserNote; gOHM: boolean }) {
  const dispatch = useDispatch();
  const { address, provider, networkId } = useWeb3Context();
  const currentIndex = useAppSelector(state => state.app.currentIndex);

  const bond = userNote;
  const bondName = bond.displayName;

  const isAppLoading = useAppSelector(state => state.app.loading ?? true);

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const vestingPeriod = () => bond.timeLeft;

  async function onRedeem() {
    // TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
    // let currentBond = [...bonds, ...expiredBonds].find(bnd => bnd.name === bondName);
    // await dispatch(redeemBond({ address, bond: currentBond, networkID: networkId, provider, autostake }));
  }

  return (
    <TableRow id={`${bondName}--claim`}>
      <TableCell align="left" className="bond-name-cell">
        <BondLogo bond={bond} />
        <div className="bond-name">
          <Typography variant="body1">{bond.displayName ? bond.displayName : <Skeleton width={100} />}</Typography>
        </div>
      </TableCell>
      <TableCell align="center">
        {isAppLoading ? <Skeleton /> : vestingPeriod()}
        {/* {bond.pendingPayout ? trim(bond.pendingPayout, 4) : <Skeleton width={100} />} */}
      </TableCell>
      <TableCell align="center">
        {bond.payout !== null ? (
          trim(bond.payout * (gOHM ? 1 : Number(currentIndex)), 4) + (gOHM ? " gOHM" : " sOHM")
        ) : (
          <Skeleton width={100} />
        )}
      </TableCell>
      <TableCell align="right">
        {vestingPeriod() === "Fully Vested" && (
          <Button
            variant="outlined"
            color="primary"
            disabled={isPendingTxn(pendingTransactions, "redeem_bond_" + bondName)}
            onClick={onRedeem}
          >
            <Typography variant="h6">
              {txnButtonTextGeneralPending(pendingTransactions, "redeem_bond_" + bondName, "Claim")}
            </Typography>
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

export function ClaimBondCardData({ userNote }: { userNote: IUserNote }) {
  const dispatch = useDispatch();
  const { address, provider, networkId } = useWeb3Context();
  const { bonds, expiredBonds } = useBonds(networkId);

  const bond = userNote;
  const bondName = bond.displayName;

  const currentBlock = useAppSelector(state => {
    return state.app.currentBlock;
  });

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const vestingPeriod = () => bond.timeLeft;

  async function onRedeem() {
    // TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
    let currentBond = [...bonds, ...expiredBonds].find(bnd => bnd.name === bondName);
    // await dispatch(redeemBond({ address, bond: currentBond, networkID: networkId, provider, autostake }));
  }

  return (
    <Box id={`${bondName}--claim`} className="claim-bond-data-card bond-data-card" style={{ marginBottom: "30px" }}>
      <Box className="bond-pair">
        <BondLogo bond={bond} />
        <Box className="bond-name">
          {/* <Typography>{bond.displayName ? trim(bond.displayName, 4) : <Skeleton width={100} />}</Typography> */}
        </Box>
      </Box>

      <div className="data-row">
        <Typography>Claimable</Typography>
        <Typography>{bond.payout ? trim(bond.payout, 4) : <Skeleton width={100} />}</Typography>
      </div>

      {/* <div className="data-row">
        <Typography>Pending</Typography>
        <Typography>{bond.interestDue ? trim(bond.interestDue, 4) : <Skeleton width={100} />}</Typography>
      </div> */}

      <div className="data-row" style={{ marginBottom: "20px" }}>
        <Typography>Fully Vested</Typography>
        <Typography>{vestingPeriod()}</Typography>
      </div>
      <Box display="flex" justifyContent="space-around" alignItems="center" className="claim-bond-card-buttons">
        <Button
          variant="outlined"
          color="primary"
          disabled={isPendingTxn(pendingTransactions, "redeem_bond_" + bondName)}
          onClick={onRedeem}
        >
          <Typography variant="h5">
            {txnButtonTextGeneralPending(pendingTransactions, "redeem_bond_" + bondName, t`Claim`)}
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}
