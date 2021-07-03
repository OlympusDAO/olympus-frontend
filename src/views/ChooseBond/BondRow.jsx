import React from "react";
import { useSelector } from "react-redux";
import { trim, bondName, lpURL, isBondLP } from "../../helpers";
<<<<<<< HEAD
<<<<<<< HEAD
import BondLogo from "../../components/BondLogo";
import { TableRow, TableCell } from "@material-ui/core";
import { NavLink } from "react-router-dom";

export function BondCardData({ bond }) {
  const bondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });
  const bondDiscount = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
=======
import BondLogo from '../../components/BondLogo';
import { Button, Box, Link, Paper, Grid, Typography, TableRow, TableCell, } from "@material-ui/core";
import { NavLink } from 'react-router-dom';
=======
import BondLogo from "../../components/BondLogo";
import { Button, Box, Link, Paper, Grid, Typography, TableRow, TableCell } from "@material-ui/core";
import { NavLink } from "react-router-dom";
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
import "./choosebond.scss";

export function BondDataCard({ bond }) {
<<<<<<< HEAD
  const bondPrice    = useSelector((state ) => { return state.bonding[bond] && state.bonding[bond].bondPrice });
  const bondDiscount = useSelector((state ) => { return state.bonding[bond] && state.bonding[bond].bondDiscount });
  const bondPurchased = useSelector((state ) => { return state.bonding[bond] && state.bonding[bond].purchased });
>>>>>>> bond page components, stake page components, button and paper implemented still need to change typography and links
=======
  const bondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });
  const bondDiscount = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
  const bondPurchased = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].purchased;
  });
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page

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
<<<<<<< HEAD
    <div id={`${bond}--bond`} className="bond-data-card">
      <div className="bond-pair">
        {/* maket this whole thing a link if there is an lpurl */}
        <BondLogo bond={bond} />
        <div className="bond-name">
          {bondName(bond)}
          {isBondLP(bond) && (
            <a href={lpURL(bond)} target="_blank">
              <i className="fas fa-external-link-alt"></i>
            </a>
          )}
        </div>
      </div>

      <div className="bond-price">
        <p>Price</p>
        <p>${bondPrice && trim(bondPrice, 2)}</p>
      </div>

      <div className="bond-discount">
        <p>ROI</p>
        <p>{bondDiscount && trim(bondDiscount * 100, 2)}%</p>
      </div>

      {/* <TableCell>$4,102,030</TableCell> */}
      <div className="bond-link">
        <NavLink to={`/bonds/${bond}`}>
          <button type="button" className="stake-lp-button ohm-btn">
            Bond
          </button>
        </NavLink>
      </div>
    </div>
  );
=======
    <Paper>
      <div id={`${bond}--bond`} className="bond-data-card">
        <Grid container>
          <Grid item xs={12}>
            <div className="bond-pair">
              <BondLogo bond={bond} />
              <div className="bond-name">
                {bondName(bond)}
                {isBondLP(bond) && (
                  <div>
                    <Button color="secondary" variant="text" component={Link} href={lpURL(bond)} target="_blank">
                      View Contract <i className="fas fa-external-link-alt"></i>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className="bond-price">
              <p>Price</p>
              <p>{priceUnits(bond) && trim(bondPrice, 2)}</p>
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className="bond-discount">
              <p>ROI</p>
              <p>{bondDiscount && trim(bondDiscount * 100, 2)}%</p>
            </div>
          </Grid>

          <Grid item xs={12}>
            <div className="bond-discount">
              <p>Purchased</p>
              <p>
                {bondPurchased &&
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(bondPurchased)}
              </p>
            </div>
          </Grid>

          <Grid item xs={12} className="bond-link">
            <Button href={`/bonds/${bond}`} variant="outlined" color="primary">
              Bond
            </Button>
          </Grid>
        </Grid>
      </div>
    </Paper>
<<<<<<< HEAD
  )
>>>>>>> bond page components, stake page components, button and paper implemented still need to change typography and links
=======
  );
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
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
<<<<<<< HEAD
<<<<<<< HEAD
          {bondName(bond)}
          {isBondLP(bond) && (
            <a href={lpURL(bond)} target="_blank">
              <p>
                Contract
                <i className="fas fa-external-link-alt"></i>
              </p>
            </a>
          )}
=======
        {bondName(bond)}
        {isBondLP(bond) && <Link color="primary" href={lpURL(bond)} target="_blank">
          <p>
          View Contract
          <i className="fas fa-external-link-alt"></i>
          </p>
        </Link>}

>>>>>>> links and styles updated for bond table
=======
          {bondName(bond)}
          {isBondLP(bond) && (
            <Link color="primary" href={lpURL(bond)} target="_blank">
              <p>
                View Contract
                <i className="fas fa-external-link-alt"></i>
              </p>
            </Link>
          )}
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
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
