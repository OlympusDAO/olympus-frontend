import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { trim, prettyVestingPeriod } from "../../helpers";
import { calculateUserBondDetails, redeemBond } from '../../actions/Bond.actions.js';



function BondRedeemV1({ bond, provider, address }) {
  const dispatch = useDispatch();

  const currentBlock = useSelector((state ) => { return state.app.currentBlock });
  const bondMaturationBlock = useSelector((state ) => { return state.bonding[bond] && state.bonding[bond].bondMaturationBlock });
  const interestDue  = useSelector((state ) => { return state.bonding[bond] && state.bonding[bond].interestDue });
  const pendingPayout = useSelector((state ) => { return state.bonding[bond] && state.bonding[bond].pendingPayout });

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bondMaturationBlock);
  };

  async function onRedeem() {
    await dispatch(redeemBond({ address, bond, networkID: 1, provider, autostake: null }));
  };


  async function loadBondDetails() {
    if (provider && address) {
      await dispatch(calculateUserBondDetails({ address, bond, provider, networkID: 1 }));
    }
  }

  useEffect(() => {
    loadBondDetails();
  }, [provider, address]);

  return (
    <React.Fragment>
      <div className="alert alert-warning" role="alert">
        This is redemption for V1 bond contracts. Check them out here: <a href="https://etherscan.io/address/0xa64ed1b66cb2838ef2a198d8345c0ce6967a2a3c" target="_blank">OHM-DAI bond contract</a> and <a href="https://etherscan.io/address/0x13E8484a86327f5882d1340ed0D7643a29548536" target="_blank">DAI bond contract</a>
      </div>

      <div className="stake-price-data-column">
        <div className="stake-price-data-row">
          <p className="price-label">Pending Rewards</p>
          <p id="bond-market-price-id" className="price-data">
            { trim(interestDue, 4) } OHM
          </p>
        </div>
        <div className="stake-price-data-row">
          <p className="price-label">Claimable Rewards</p>
          <p id="bond-market-price-id" className="price-data">
            { trim(pendingPayout, 4) } OHM
          </p>
        </div>
        <div className="stake-price-data-row">
          <p className="price-label">Time until fully vested</p>
          <p id="bond-market-price-id" className="price-data">
            { vestingTime() }
          </p>
        </div>
      </div>

      <div className="d-flex align-self-center mb-4">
        <div className="redeem-button" onClick={onRedeem}>Claim</div>
      </div>
    </React.Fragment>
  );
}

export default BondRedeemV1;
