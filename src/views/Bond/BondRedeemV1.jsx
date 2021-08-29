import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { trim, prettyVestingPeriod } from "../../helpers";
import { redeemBond } from "../../slices/BondSlice";
import { useWeb3Context } from "src/hooks/web3Context";

function BondRedeemV1({ bond }) {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });
  const bondMaturationBlock = useSelector(state => {
    return state.account[bond] && state.account[bond].bondMaturationBlock;
  });
  const interestDue = useSelector(state => {
    return state.account[bond] && state.account[bond].interestDue;
  });
  const pendingPayout = useSelector(state => {
    return state.account[bond] && state.account[bond].pendingPayout;
  });

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bondMaturationBlock);
  };

  async function onRedeem() {
    await dispatch(redeemBond({ address, bond, networkID: chainID, provider, autostake: null }));
  }

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
