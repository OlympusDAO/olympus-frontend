import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { trim, getRebaseBlock, secondsUntilBlock, prettifySeconds, prettyVestingPeriod } from "../helpers";
import { changeApproval, calcBondDetails, calculateUserBondDetails } from '../actions/Bond.actions.js';
import { BONDS } from "../constants";
import { NavLink } from 'react-router-dom';

type Props = {
  bond: string,
};



function BondHeader({ bond }: Props) {
  const ohmAssetImg = () => {
    return 'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x383518188C0C6d7730D91b2c03a03C837814a899/logo.png';
  }

  const reserveAssetImg = () => {
    if (bond.indexOf('frax') >= 0) {
      return "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x853d955aCEf822Db058eb8505911ED77F175b99e/logo.png"
    } else if (bond.indexOf('dai') >= 0) {
      return 'https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png'
    }
  }

  const headerName = () => {
    if (bond === BONDS.dai)
      return 'DAI Bond'
    else if (bond === BONDS.ohm_dai)
      return 'OHM-DAI SLP Bond'
  }

  const isLP = () => {
    return bond.indexOf('_lp') >= 0
  }


  return (
    <div className="d-flex flex-row align-items-center my-2 px-2 my-md-4 px-md-4">
      <NavLink to="/bonds" className="align-items-center ohm-link" style={{position: "absolute"}}>
      <i className="fa fa-chevron-left"></i>
        Back
      </NavLink>
      <div className="d-flex flex-row col justify-content-center">
        <div className="ohm-pairs d-sm-flex mr-2 d-none">
          {isLP() && <div className="ohm-pair" style={{zIndex: 2}}>
            <img
              src={`${ohmAssetImg()}`}
            />
          </div>}

          <div className="ohm-pair" style={{zIndex: 1}}>
            <img
              src={`${reserveAssetImg()}`}
            />
          </div>
        </div>

        <div className="text-light align-self-center">
          <h5 style={{color: 'white'}}>
            {headerName()}
          </h5>
        </div>
      </div>
    </div>
  );
}

export default BondHeader;
