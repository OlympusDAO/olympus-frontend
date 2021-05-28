import React, { useState, useCallback, } from 'react';

// displays a page header

type Props = {
  // app: string;
};

function Stake({ }: Props) {
  const [ohmBalance, setOhmBalance] = useState(0);
  const [sOHMBalance, setsOhmBalance] = useState(0);
  const [timeUntilRebase, setTimeUntilRebase] = useState(0);
  const [stakingRebase, setStakingRebase] = useState(0);
  const [fiveDayRate, setFiveDayRate] = useState(0);
  const [stakingAPY, setStakingAPY] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMapOption, setSelectedMapOption] = useState(0);

  const setMax = useCallback(() => {
    return null
  }, []);

  const seekApproval = useCallback(() => {
    return null
  }, []);

  const executeStake = useCallback(() => {
    return null
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="dapp-center-modal py-2 px-4 py-md-4 px-md-2">
        <div className="dapp-modal-wrapper d-flex align-items-center">
          <div className="swap-input-column">
            <div className="stake-toggle-row">
              <ul className="toggle-switch" style={{width: "15rem", height: "2.5rem"}}>
                <li style={{width: "15rem", height: "2.5rem", fontFamily: "Arial", fontSize: "1rem", textAlign: "center"}}>
                  <input id="Stake" type="radio" value="Stake" />
                  <label htmlFor="Stake" className="selected active" style={{padding: "0.3rem", borderColor: "white", backgroundColor: "white", color: "black", fontWeight: "bold", transition: "all 0.4s ease 0s"}}> Stake </label>
                </li>
                <li style={{width: "15rem", height: "2.5rem", fontFamily: "Arial", fontSize: "1rem", textAlign: "center"}}>
                  <input id="Unstake" type="radio" value="Unstake" />
                  <label htmlFor="Unstake" className="active" style={{padding: "0.3rem", borderColor: "white", backgroundColor: "rgb(40, 40, 40)", color: "white", fontWeight: "normal", transition: "all 0.4s ease 0s"}}> Unstake </label>
                </li>
              </ul>
            </div>

            <div className="input-group ohm-input-group mb-3 flex-nowrap d-flex">
              <input
                v-model="quantity"
                type="number"
                className="form-control"
                placeholder="Type an amount"
              />
              <button className="btn" type="button" onClick={setMax}>Max</button>
            </div>

            <div className="stake-price-data-column">
              <div className="stake-price-data-row">
                <p className="price-label">Balance</p>
                <p className="price-data">{ohmBalance} OHM</p>
              </div>
              <div className="stake-price-data-row">
                <p className="price-label">Staked</p>
                <p className="price-data">{ sOHMBalance } OHM</p>
              </div>

              <div className="stake-price-data-row">
                <p className="price-label">Time until rebase</p>
                <p className="price-data">
                  { timeUntilRebase }
                </p>
              </div>

              <div className="stake-price-data-row">
                <p className="price-label">Upcoming rebase</p>
                <p className="price-data">{stakingRebase}%</p>
              </div>
              <div className="stake-price-data-row">
                <p className="price-label">ROI (5-day rate)</p>
                <p className="price-data">{fiveDayRate}%</p>
              </div>
              <div className="stake-price-data-row">
                <p className="price-label">Current APY</p>
                <p className="price-data">{stakingAPY}%</p>
              </div>
              <div className="stake-price-data-row">
                <p className="price-label">Current index</p>
                <p className="price-data">{currentIndex} OHM</p>
              </div>
            </div>

            <div v-if="hasAllowance" className="d-flex align-self-center mb-2">
              <div className="stake-button" onClick={executeStake}>{ selectedMapOption }</div>
            </div>
            <div v-else className="d-flex align-self-center mb-2">
              <div className="stake-button" onClick={seekApproval}>Approve</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Stake;
