import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { trim, getRebaseBlock, secondsUntilBlock, prettifySeconds, prettyVestingPeriod, isBondLP } from "../helpers";
import { changeApproval, calcBondDetails, calculateUserBondDetails } from '../actions/Bond.actions.js';

function BondHeader({ bond }) {
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
    <div className="ohm-pairs d-sm-flex mr-2 d-none">
      {isBondLP(bond) && <div className="ohm-pair" style={{zIndex: 2}}>
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
  );
}

export default BondHeader;
