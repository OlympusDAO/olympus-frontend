import { useSelector } from "react-redux";
import { trim, bondName, lpURL, isBondLP, priceUnits } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { Box, Button, Link, Paper, Typography, TableRow, TableCell, SvgIcon, Slide } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";

export function ClaimBondTableData({ bond }) {
  const bondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });
  const bondDiscount = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
  const bondPurchased = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].purchased;
  });

  return (
    <TableRow id={`${bond}--claim`}>
      <TableCell align="left" className="bond-name-cell">
        <BondLogo bond={bond} />
        <div className="bond-name">
          <Typography variant="body1">{bondName(bond)}</Typography>
          {isBondLP(bond) && (
            <Link color="primary" href={lpURL(bond)} target="_blank">
              <Typography variant="body1">
                View Contract
                <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
              </Typography>
            </Link>
          )}
        </div>
      </TableCell>
      <TableCell align="left">33 OHM</TableCell>
      <TableCell align="left">11.33 OHM</TableCell>
      <TableCell align="center">3 days 3 hrs</TableCell>
      <TableCell align="center">
        {/* <Link component={NavLink} to={`/bonds/${bond}`}> */}
        <Button variant="outlined" color="primary">
          <Typography variant="h6">Claim</Typography>
        </Button>
        {/* </Link> */}
      </TableCell>
    </TableRow>
  );
}

export function ClaimBondCardData({ bond }) {
  const bondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });
  const bondDiscount = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
  const bondPurchased = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].purchased;
  });

  return (
    <Box id={`${bond}--claim`} className="claim-bond-data-card bond-data-card" style={{ marginBottom: "30px" }}>
      <Box className="bond-pair">
        <BondLogo bond={bond} />
        <Box className="bond-name">
          <Typography>{bondName(bond)}</Typography>
          {isBondLP(bond) && (
            <Link href={lpURL(bond)} target="_blank">
              <Typography variant="body1">
                View Contract
                <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
              </Typography>
            </Link>
          )}
        </Box>
      </Box>

      <div className="data-row">
        <Typography>Claimable</Typography>
        <Typography>33 OHM</Typography>
      </div>

      <div className="data-row">
        <Typography>Pending</Typography>
        <Typography>11.33 OHM</Typography>
      </div>

      <div className="data-row" style={{ marginBottom: "20px" }}>
        <Typography>Fully Vested</Typography>
        <Typography>3 days 3 hrs</Typography>
      </div>
      <Box display="flex" justifyContent="space-around" alignItems="center" className="claim-bond-card-buttons">
        <Button variant="outlined" color="primary">
          <Typography variant="h5">Claim</Typography>
        </Button>
        <Button variant="outlined" color="primary">
          <Typography variant="h5">Claim and Stake</Typography>
        </Button>
      </Box>
    </Box>
  );
}
