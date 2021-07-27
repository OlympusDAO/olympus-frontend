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
  const bondMaturationBlock = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && state.bonding[bond].bondMaturationBlock) || 0;
  });
  const interestDue = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && state.bonding[bond].interestDue) || 0;
  });
  const pendingPayout = useAppSelector(state => {
    return (state.bonding && state.bonding[bond] && Number(state.bonding[bond].pendingPayout)) || 0;
  });

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bondMaturationBlock);
  };

  async function onRedeem() {
    if (!provider) {
      alert("Please connect your wallet!");
      return;
    }
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
