import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { trim, prettyVestingPeriod } from "../../helpers";
import { calculateUserBondDetails, redeemBond } from "../../actions/Bond.actions.js";

function BondRedeemV1({ bond, provider, address }) {
  const dispatch = useDispatch();

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });
  const bondMaturationBlock = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].bondMaturationBlock;
  });
  const interestDue = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].interestDue;
  });
  const pendingPayout = useSelector(state => {
    return state.bonding[bond] && state.bonding[bond].pendingPayout;
  });

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bondMaturationBlock);
  };

  async function onRedeem() {
    await dispatch(redeemBond({ address, bond, networkID: 1, provider, autostake: null }));
  }

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
        Not seeing your bond? Look here:{" "}
        <a href="https://staging.olympusdao.finance/#/bonds" target="_blank">
          Olympus Legacy
        </a>
      </div>

      <div className="stake-price-data-column">
        <div className="stake-price-data-row">
          <p className="price-label">Pending Rewards</p>
          <p id="bond-market-price-id" className="price-data">
            {trim(interestDue, 4)} OHM
          </p>
        </div>
        <div className="stake-price-data-row">
          <p className="price-label">Claimable Rewards</p>
          <p id="bond-market-price-id" className="price-data">
            {trim(pendingPayout, 4)} OHM
          </p>
        </div>
        <div className="stake-price-data-row">
          <p className="price-label">Time until fully vested</p>
          <p id="bond-market-price-id" className="price-data">
            {vestingTime()}
          </p>
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div className="stake-button" onClick={onRedeem}>
          Claim V1.0
        </div>
      </div>
    </React.Fragment>
  );
}

export default BondRedeemV1;
