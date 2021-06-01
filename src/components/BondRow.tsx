import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { trim, getRebaseBlock, secondsUntilBlock, prettifySeconds, prettyVestingPeriod, bondName, lpURL, isBondLP } from "../helpers";
import { changeApproval, calcBondDetails, calculateUserBondDetails } from '../actions/Bond.actions.js';
import BondLogo from './BondLogo';
import { NavLink } from 'react-router-dom';

type Props = {
  bond: string,
};

function BondHeader({ bond }: Props) {
  const bondPrice    = useSelector((state: any) => { return state.bonding[bond] && state.bonding[bond].bondPrice });
  const bondDiscount = useSelector((state: any) => { return state.bonding[bond] && state.bonding[bond].bondDiscount });

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

  return (
    <li className="list-group-item d-flex align-items-center px-4">
      <div style={{width: "80px"}}>
        <BondLogo bond={bond} />
      </div>

      <div className="text-light">
        <h4 className='mb-0'>{bondName(bond)}</h4>
        {isBondLP(bond) && <a href={lpURL(bond)} target="_blank">
          Contract
          <i className="fas fa-external-link-alt fa-sm ml-1"></i>
        </a>}
        <p className="fs-6 mb-0">
          Bond Price: { trim(bondPrice, 2) } DAI
        </p>
        <p className="fs-6">ROI: { trim(bondDiscount * 100, 2) }%</p>
      </div>


      <NavLink to={`/bonds/${bond}`}>
        <button className="ohm-button button float-right">
          View
        </button>
      </NavLink>


    </li>
  );
}

export default BondHeader;
