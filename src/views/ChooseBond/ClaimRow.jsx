import { useEffect } from "react";
import { useSelector } from "react-redux";
import { shorten, trim, prettyVestingPeriod } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { Box, Button, Link, Paper, Typography, TableRow, TableCell, SvgIcon, Slide } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";

export function ClaimBondTableData({ userBond }) {
  const bondName = userBond[0];
  const bond = userBond[1];
  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  const vestingPeriod = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
  };

  async function onRedeem({ autostake }) {
    dispatch(redeemBond({ address, bond, networkID: chainID, provider, autostake }));
  }

  useEffect(() => {
    console.log(userBond);
  }, []);

  return (
    <TableRow id={`${bond.name}--claim`}>
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
        {/* Need to add button action */}
        <Button variant="outlined" color="primary" onClick={onRedeem}>
          <Typography variant="h6">Claim</Typography>
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function ClaimBondCardData({ userBond }) {
  const bondName = userBond[0];
  const bond = userBond[1];
  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  const vestingPeriod = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
  };

  async function onRedeem({ autostake }) {
    dispatch(redeemBond({ address, bond, networkID: chainID, provider, autostake }));
  }

  useEffect(() => {
    console.log(userBond);
  }, []);

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
        <Button variant="outlined" color="primary" onClick={onRedeem}>
          <Typography variant="h5">Claim</Typography>
        </Button>
        <Button variant="outlined" color="primary">
          <Typography variant="h5">Claim and Stake</Typography>
        </Button>
      </Box>
    </Box>
  );
}
