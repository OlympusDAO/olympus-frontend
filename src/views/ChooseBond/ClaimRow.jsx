import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { shorten, trim, prettyVestingPeriod } from "../../helpers";
import { redeemBond } from "../../slices/BondSlice";
import BondLogo from "../../components/BondLogo";
import { Box, Button, Link, Paper, Typography, TableRow, TableCell, SvgIcon, Slide } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import { useWeb3Context, useBonds } from "src/hooks";
import { isPendingTxn, txnButtonTextGeneralPending } from "src/slices/PendingTxnsSlice";

export function ClaimBondTableData({ userBond }) {
  const dispatch = useDispatch();
  const { bonds } = useBonds();
  const { address, chainID, provider } = useWeb3Context();

  const bondName = userBond[0];
  const bond = userBond[1];

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
    let currentBond = bonds.find(bnd => bnd.name === bondName);
    console.log(currentBond);
    await dispatch(redeemBond({ address, bond: currentBond, networkID: chainID, provider, autostake }));
  }

  return (
    <TableRow id={`${bondName}--claim`}>
      <TableCell align="left" className="bond-name-cell">
        <BondLogo bond={bond} />
        <div className="bond-name">
          <Typography variant="body1">{bond.displayName}</Typography>
          {/* {bond.isLP && (
            <Link color="primary" href={bond.lpUrl} target="_blank">
              <Typography variant="body1">
                View Contract
                <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
              </Typography>
            </Link>
          )} */}
        </div>
      </TableCell>
      <TableCell align="left">{bond.pendingPayout}</TableCell>
      <TableCell align="left">{bond.interestDue}</TableCell>
      <TableCell align="center">{vestingPeriod()}</TableCell>
      <TableCell align="center">
        <Button
          variant="outlined"
          color="primary"
          disabled={isPendingTxn(pendingTransactions, "redeem_bond_" + bondName)}
          onClick={() => onRedeem({ autostake: false })}
        >
          <Typography variant="h6">
            {txnButtonTextGeneralPending(pendingTransactions, "redeem_bond_" + bondName, "Claim")}
          </Typography>
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function ClaimBondCardData({ userBond }) {
  const dispatch = useDispatch();
  const { bonds } = useBonds();
  const { address, chainID, provider } = useWeb3Context();

  const bondName = userBond[0];
  const bond = userBond[1];

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
    let currentBond = bonds.find(bnd => bnd.name === bondName);
    console.log(currentBond);
    await dispatch(redeemBond({ address, bond: currentBond, networkID: chainID, provider, autostake }));
  }

  return (
    <Box id={`${bondName}--claim`} className="claim-bond-data-card bond-data-card" style={{ marginBottom: "30px" }}>
      <Box className="bond-pair">
        <BondLogo bond={bond} />
        <Box className="bond-name">
          <Typography>{bond.displayName}</Typography>
        </Box>
      </Box>

      <div className="data-row">
        <Typography>Claimable</Typography>
        <Typography>{bond.interestDue}</Typography>
      </div>

      <div className="data-row">
        <Typography>Pending</Typography>
        <Typography>{bond.pendingPayout}</Typography>
      </div>

      <div className="data-row" style={{ marginBottom: "20px" }}>
        <Typography>Fully Vested</Typography>
        <Typography>{vestingPeriod()}</Typography>
      </div>
      <Box display="flex" justifyContent="space-around" alignItems="center" className="claim-bond-card-buttons">
        <Button
          variant="outlined"
          color="primary"
          disabled={isPendingTxn(pendingTransactions, "redeem_bond_" + bondName)}
          onClick={() => onRedeem({ autostake: false })}
        >
          <Typography variant="h5">
            {txnButtonTextGeneralPending(pendingTransactions, "redeem_bond_" + bondName, "Claim")}
          </Typography>
        </Button>
        <Button variant="outlined" color="primary" onClick={() => onRedeem({ autostake: true })}>
          <Typography variant="h5">
            {txnButtonTextGeneralPending(
              pendingTransactions,
              "redeem_bond_" + bondName + "_autostake",
              "Claim and Stake",
            )}
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}
