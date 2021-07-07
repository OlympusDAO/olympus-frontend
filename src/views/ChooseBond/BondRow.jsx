import React from "react";
import { useSelector } from "react-redux";
import { trim, bondName, lpURL, isBondLP } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { Button, Box, Link, Paper, Grid, Typography, TableRow, TableCell } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";

export function BondDataCard({ bond }) {
  const bondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });
  const bondDiscount = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
  const bondPurchased = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].purchased;
  });

  const daiAssetImg = () => {
    return "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png";
  };

  const fraxAssetImg = () => {
    return "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x853d955aCEf822Db058eb8505911ED77F175b99e/logo.png";
  };

  const priceUnits = bond => {
    if (bond.indexOf("frax") >= 0) return <img src={`${fraxAssetImg()}`} width="15px" height="15px" />;
    else return <img src={`${daiAssetImg()}`} width="15px" height="15px" />;
  };

  return (
    <Paper id={`${bond}--bond`} className="bond-data-card ohm-card">
      <Grid container>
        <Grid item xs={12}>
          <div className="bond-pair">
            <BondLogo bond={bond} />
            <div className="bond-name">
              <Typography>{bondName(bond)}</Typography>
              {isBondLP(bond) && (
                <div>
                  <Button color="secondary" variant="text" component={Link} href={lpURL(bond)} target="_blank">
                    <Typography variant="h7">
                      View Contract <i className="fas fa-external-link-alt"></i>
                    </Typography>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Grid>

        <Grid item xs={12}>
          <div className="bond-price">
            <Typography>Price</Typography>
            <Typography>{priceUnits(bond) && trim(bondPrice, 2)}</Typography>
          </div>
        </Grid>

        <Grid item xs={12}>
          <div className="bond-discount">
            <Typography>ROI</Typography>
            <Typography>{bondDiscount && trim(bondDiscount * 100, 2)}%</Typography>
          </div>
        </Grid>

        <Grid item xs={12}>
          <div className="bond-discount">
            <Typography>Purchased</Typography>
            <Typography>
              {bondPurchased &&
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(bondPurchased)}
            </Typography>
          </div>
        </Grid>

        <Grid item xs={12} className="bond-link">
          <Button href={`/bonds/${bond}`} variant="outlined" color="primary">
            <Typography>Bond</Typography>
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export function BondTableData({ bond }) {
  const bondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });
  const bondDiscount = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
  const bondPurchased = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].purchased;
  });

  const daiAssetImg = () => {
    return "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png";
  };

  const fraxAssetImg = () => {
    return "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x853d955aCEf822Db058eb8505911ED77F175b99e/logo.png";
  };

  const priceUnits = bond => {
    if (bond.indexOf("frax") >= 0) return <img src={`${fraxAssetImg()}`} width="15px" height="15px" />;
    else return <img src={`${daiAssetImg()}`} width="15px" height="15px" />;
  };

  return (
    <TableRow id={`${bond}--bond`}>
      <TableCell align="left">
        <BondLogo bond={bond} />
        <div className="bond-name">
          {bondName(bond)}
          {isBondLP(bond) && (
            <Link color="primary" href={lpURL(bond)} target="_blank">
              <Typography variant="h6">
                View Contract
                <i className="fas fa-external-link-alt"></i>
              </Typography>
            </Link>
          )}
        </div>
      </TableCell>
      <TableCell align="center">
        <p>
          {priceUnits(bond)} {trim(bondPrice, 2)}
        </p>
      </TableCell>
      <TableCell>{bondDiscount && trim(bondDiscount * 100, 2)}%</TableCell>
      <TableCell>
        {bondPurchased &&
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(bondPurchased)}
      </TableCell>
      <TableCell align="right">
        <NavLink to={`/bonds/${bond}`}>
          <Button variant="outlined" color="primary">
            Bond
          </Button>
        </NavLink>
      </TableCell>
    </TableRow>
  );
}
