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
  const [view, setView] = useState("stake");

  const setMax = useCallback(() => {
    return null
  }, []);

  const seekApproval = useCallback(() => {
    return null
  }, []);

  const executeStake = useCallback(() => {
    return null
  }, []);

  const executeUnstake = useCallback(() => {
    return null
  }, []);

  const hasAllowance = useCallback(() => {
    return false;
    // if (this.selectedMapOption === 'Stake') {
    //   return parseInt(this.$store.state.settings.stakeAllowance) > 0;
    // } else {
    //   return parseInt(this.$store.state.settings.unstakeAllowance) > 0;
    // }
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="dapp-center-modal py-2 px-4 py-md-4 px-md-2">
        <div className="dapp-modal-wrapper d-flex align-items-center">
          <div className="swap-input-column">
            <div className="stake-toggle-row">
            <div className="btn-group" role="group">
              <button type="button" className={`btn ${view === 'stake' ? 'btn-secondary' : ''}`} onClick={() => {setView('stake')}}>Stake</button>
              <button type="button" className={`btn ${view === 'unstake' ? 'btn-secondary' : ''}`} onClick={() => {setView('unstake')}}>Unstake</button>
            </div>

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

            {hasAllowance() && view === 'stake' && <div className="d-flex align-self-center mb-2">
              <div className="stake-button" onClick={executeStake}>Stake</div>
            </div>}

            {hasAllowance() && view === 'unstake' && <div className="d-flex align-self-center mb-2">
              <div className="stake-button" onClick={executeUnstake}>Unstake</div>
            </div>}

            {!hasAllowance() && <div className="d-flex align-self-center mb-2">
              <div className="stake-button" onClick={seekApproval}>Approve</div>
            </div>}


          </div>
        </div>
      </div>
    </div>

  );
}

export default Stake;
