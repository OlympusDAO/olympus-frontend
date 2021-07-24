import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { trim, prettyVestingPeriod } from "../../helpers";
import { calculateUserBondDetails, redeemBond } from "../../actions/Bond.actions";
import { IBondRedeemProps } from "./BondRedeem";
import { useAppSelector } from "src/hooks";

function BondRedeemV1({ bond, provider, address }: IBondRedeemProps) {
  const dispatch = useDispatch();

  const currentBlock = useAppSelector(state => {
    return state.app.currentBlock;
  });
  // TS-REFACTOR-TODO: state.bonding casted as not null
  const bondMaturationBlock = useAppSelector(state => {
    return state.bonding![bond] && state.bonding![bond].bondMaturationBlock!; // TS-REFACTOR-TODO: casted as not null
  });
  const interestDue = useAppSelector(state => {
    return state.bonding![bond] && state.bonding![bond].interestDue!; // TS-REFACTOR-TODO: casted as not null
  });
  const pendingPayout = useAppSelector(state => {
    return state.bonding![bond] && Number(state.bonding![bond].pendingPayout!); // TS-REFACTOR-TODO: casted as not null number
  });

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bondMaturationBlock);
  };

  async function onRedeem() {
    // TS-REFACTOR-TODO: casted as not null
    await dispatch(redeemBond({ address, bond, networkID: 1, provider: provider!, autostake: null }));
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
