import { useSelector } from "react-redux";
<<<<<<< HEAD
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
=======
import { trim, bondName, lpURL, isBondLP, getDaiAssetImg, getFraxAssetImg } from "../../helpers";
>>>>>>> cleaned up topbar, made hamburger left anchored, removed font awesome for custom icons
import BondLogo from "../../components/BondLogo";
import { Button, Box, Link, Paper, Typography, TableRow, TableCell, SvgIcon } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/v1.2/arrow-up.svg";
import { NavLink } from "react-router-dom";
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
import "./choosebond.scss";

const priceUnits = bond => {
  if (bond.indexOf("frax") >= 0) return <img src={`${getFraxAssetImg()}`} width="15px" height="15px" />;
  else return <img src={`${getDaiAssetImg()}`} width="15px" height="15px" />;
};

export function BondDataCard({ bond }) {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  const bondPrice    = useSelector((state ) => { return state.bonding[bond] && state.bonding[bond].bondPrice });
  const bondDiscount = useSelector((state ) => { return state.bonding[bond] && state.bonding[bond].bondDiscount });
  const bondPurchased = useSelector((state ) => { return state.bonding[bond] && state.bonding[bond].purchased });
>>>>>>> bond page components, stake page components, button and paper implemented still need to change typography and links
=======
=======
=======
import React from "react";
import { useSelector } from "react-redux";
import { trim, bondName, lpURL, isBondLP } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { TableRow, TableCell } from "@material-ui/core";
import { NavLink } from "react-router-dom";

export function BondCardData({ bond }) {
>>>>>>> Linting fixes
>>>>>>> Linting fixes
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer
  const bondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });
  const bondDiscount = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
  const bondPurchased = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].purchased;
  });
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> fixed dep issues, updated formatting, styled mobile nav, styled migrate page
=======
=======

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
>>>>>>> Linting fixes
>>>>>>> Linting fixes
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer

  return (
<<<<<<< HEAD
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
=======
    <Paper id={`${bond}--bond`} className="bond-data-card ohm-card">
<<<<<<< HEAD
      <Grid container>
        <Grid item xs={12}>
          <div className="bond-pair">
            <BondLogo bond={bond} />
            <div className="bond-name">
              <Typography>{bondName(bond)}</Typography>
              {isBondLP(bond) && (
                <div>
                  <Button color="secondary" variant="text" component={Link} href={lpURL(bond)} target="_blank">
<<<<<<< HEAD
<<<<<<< HEAD
                    <Typography variant="h6">
>>>>>>> top bar nearly done, sidebar refactored (mostly) to use material ui drawer, bootstrap removed, sidebar styled, typography implemented
=======
                    <Typography variant="h7">
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
=======
                    <Typography variant="body1">
<<<<<<< HEAD
>>>>>>> imported new icons and got them working with theme colors
                      View Contract <i className="fas fa-external-link-alt"></i>
=======
                      View Contract
                      <SvgIcon component={ArrowUp} color="primary" />
>>>>>>> cleaned up topbar, made hamburger left anchored, removed font awesome for custom icons
                    </Typography>
                  </Button>
                </div>
              )}
=======
      <div className="bond-pair">
        <BondLogo bond={bond} />
        <div className="bond-name">
          <Typography>{bondName(bond)}</Typography>
          {isBondLP(bond) && (
            <div>
              <Link href={lpURL(bond)} target="_blank">
                <Typography variant="body1">
                  View Contract
                  <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                </Typography>
              </Link>
>>>>>>> staking updated with current index, button links fixed, bond cards styled
            </div>
          )}
        </div>
      </div>

      <div className="data-row">
        <Typography>Price</Typography>
        <Typography>{priceUnits(bond) && trim(bondPrice, 2)}</Typography>
      </div>

      <div className="data-row">
        <Typography>ROI</Typography>
        <Typography>{bondDiscount && trim(bondDiscount * 100, 2)}%</Typography>
      </div>

      <div className="data-row">
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

      <Button href={`/bonds/${bond}`} variant="outlined" color="primary" fullWidth>
        <Typography variant="h5">Bond {bondName(bond)}</Typography>
      </Button>
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

  return (
    <TableRow id={`${bond}--bond`}>
      <TableCell align="left">
        <BondLogo bond={bond} />
        <div className="bond-name">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> Linting fixes
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer
          <Typography variant="body1">{bondName(bond)}</Typography>
>>>>>>> imported new icons and got them working with theme colors
          {isBondLP(bond) && (
            <Link color="primary" href={lpURL(bond)} target="_blank">
              <Typography variant="body1">
                View Contract
                <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
              </Typography>
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
        <Link to={`/bonds/${bond}`} component={NavLink}>
          <Button variant="outlined" color="primary">
            <Typography variant="h6">Bond</Typography>
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
