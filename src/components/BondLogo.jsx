<<<<<<< HEAD
<<<<<<< HEAD
=======
import React from 'react';
>>>>>>> bond page components, stake page components, button and paper implemented still need to change typography and links
=======
import React from "react";
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
import { isBondLP } from "../helpers";

function BondHeader({ bond }) {
  const ohmAssetImg = () => {
    return "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x383518188C0C6d7730D91b2c03a03C837814a899/logo.png";
  };

  const reserveAssetImg = () => {
    if (bond.indexOf("frax") >= 0) {
      return "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x853d955aCEf822Db058eb8505911ED77F175b99e/logo.png";
    } else if (bond.indexOf("dai") >= 0) {
      return "https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png";
    }
  };

  return (
<<<<<<< HEAD
    <div className="ohm-pairs d-sm-flex d-none">
      {isBondLP(bond) && (
        <div className="ohm-pair" style={{ zIndex: 2 }}>
          <div className="ohm-logo-bg">
            <img className="ohm-pair-img" src={`${ohmAssetImg()}`} />
          </div>
=======
    <div className="ohm-pairs d-sm-flex">
<<<<<<< HEAD
      {isBondLP(bond) && <div className="ohm-pair" style={{zIndex: 2}}>
      <div className="ohm-logo-bg">
        <img className="ohm-pair-img"
          src={`${ohmAssetImg()}`}
        />
>>>>>>> bond page components, stake page components, button and paper implemented still need to change typography and links
=======
      {isBondLP(bond) && (
        <div className="ohm-pair" style={{ zIndex: 2 }}>
          <div className="ohm-logo-bg">
            <img className="ohm-pair-img" src={`${ohmAssetImg()}`} />
          </div>
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
        </div>
      )}

      <div className="ohm-pair" style={{ zIndex: 1 }}>
        <img className="reserve-pair-img" src={`${reserveAssetImg()}`} />
      </div>
    </div>
  );
}

export default BondHeader;
