<<<<<<< HEAD
import { useSelector } from "react-redux";
import { trim, bondName, lpURL, isBondLP, getDaiAssetImg, getFraxAssetImg } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { Button, Box, Link, Paper, Typography, TableRow, TableCell, SvgIcon } from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../assets/icons/v1.2/arrow-up.svg";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";

const priceUnits = bond => {
  if (bond.indexOf("frax") >= 0) return <img src={`${getFraxAssetImg()}`} width="15px" height="15px" />;
  else return <img src={`${getDaiAssetImg()}`} width="15px" height="15px" />;
};

export function BondDataCard({ bond }) {
=======
import React from "react";
import { useSelector } from "react-redux";
import { trim, bondName, lpURL, isBondLP } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { TableRow, TableCell } from "@material-ui/core";
import { NavLink } from "react-router-dom";

export function BondCardData({ bond }) {
>>>>>>> Linting fixes
  const bondPrice = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondPrice;
  });
  const bondDiscount = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondDiscount;
  });
<<<<<<< HEAD
  const bondPurchased = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].purchased;
  });
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

  return (
    <Paper id={`${bond}--bond`} className="bond-data-card ohm-card">
      <div className="bond-pair">
        <BondLogo bond={bond} />
        <div className="bond-name">
<<<<<<< HEAD
          <Typography>{bondName(bond)}</Typography>
          {isBondLP(bond) && (
            <div>
              <Link href={lpURL(bond)} target="_blank">
                <Typography variant="body1">
                  View Contract
                  <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                </Typography>
              </Link>
            </div>
=======
          {bondName(bond)}
          {isBondLP(bond) && (
            <a href={lpURL(bond)} target="_blank">
              <i className="fas fa-external-link-alt"></i>
            </a>
>>>>>>> Linting fixes
          )}
        </div>
      </div>

<<<<<<< HEAD
      <div className="data-row">
        <Typography>Price</Typography>
        <Typography>{priceUnits(bond) && trim(bondPrice, 2)}</Typography>
=======
      <div className="bond-price">
        <p>Price</p>
        <p>${bondPrice && trim(bondPrice, 2)}</p>
>>>>>>> Linting fixes
      </div>

      <div className="data-row">
        <Typography>ROI</Typography>
        <Typography>{bondDiscount && trim(bondDiscount * 100, 2)}%</Typography>
      </div>

<<<<<<< HEAD
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
=======
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
>>>>>>> Linting fixes

  return (
    <TableRow id={`${bond}--bond`}>
      <TableCell align="left">
        <BondLogo bond={bond} />
        <div className="bond-name">
<<<<<<< HEAD
          <Typography variant="body1">{bondName(bond)}</Typography>
          {isBondLP(bond) && (
            <Link color="primary" href={lpURL(bond)} target="_blank">
              <Typography variant="body1">
                View Contract
                <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
              </Typography>
            </Link>
=======
          {bondName(bond)}
          {isBondLP(bond) && (
            <a href={lpURL(bond)} target="_blank">
              <p>
                Contract
                <i className="fas fa-external-link-alt"></i>
              </p>
            </a>
>>>>>>> Linting fixes
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
        <Link to={`/bonds/${bond}`} component={NavLink}>
          <Button variant="outlined" color="primary">
            <Typography variant="h6">Bond</Typography>
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
