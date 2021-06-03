import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { trim, getRebaseBlock, secondsUntilBlock, prettifySeconds, prettyVestingPeriod, bondName } from "../helpers";
import { changeApproval, calcBondDetails, calculateUserBondDetails } from '../actions/Bond.actions.js';
import { BONDS } from "../constants";
import { NavLink } from 'react-router-dom';
import BondLogo from './BondLogo';
import AdvancedSettings from './AdvancedSettings';

type Props = {
  bond: string,
  slippage: number,
  recipientAddress: string,
  onRecipientAddressChange: any,
  onSlippageChange: any
};



function BondHeader({ bond, slippage, recipientAddress, onRecipientAddressChange, onSlippageChange }: Props) {
  const [showMenu, setShowMenu] = useState(false);

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
    <div className="d-flex flex-row align-items-center my-2 px-2 my-md-4 px-md-4">
      <NavLink to="/bonds" className="align-items-center ohm-link" style={{position: "absolute"}}>
      <i className="fa fa-chevron-left"></i>
        Back
      </NavLink>
      <div className="d-flex flex-row col justify-content-center">
        <BondLogo bond={bond} />

        <div className="text-light align-self-center">
          <h5 style={{color: 'white'}}>
            {bondName(bond)}
          </h5>
        </div>
      </div>

      <div style={{position: "relative"}}>
        <a role="button" onClick={() => setShowMenu(!showMenu)}>
          <i className="fa fa-cog fa-2x" />
        </a>

        {showMenu && <AdvancedSettings
          slippage={slippage}
          recipientAddress={recipientAddress}
          onRecipientAddressChange={onRecipientAddressChange}
          onSlippageChange={onSlippageChange}
        />}
      </div>

    </div>
  );
}

export default BondHeader;
