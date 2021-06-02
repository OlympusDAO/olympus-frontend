import React, { useState, useCallback, } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { trim, getRebaseBlock, secondsUntilBlock, prettifySeconds } from "../helpers";
import { changeStake, changeApproval } from '../actions/Stake.actions.js';

type Props = {
  provider: any,
  address: string
};

function Stake({ provider, address }: Props) {
  const dispatch = useDispatch();

  const [view, setView] = useState("stake");
  const [quantity, setQuantity] = useState();

  const fiveDayRate  = useSelector((state: any) => { return state.app.fiveDayRate });
  const currentIndex = useSelector((state: any) => { return state.app.currentIndex });

  const ohmBalance     = useSelector((state: any) => { return state.app.balances && state.app.balances.ohm });
  const sohmBalance    = useSelector((state: any) => { return state.app.balances && state.app.balances.sohm });
  const stakeAllowance = useSelector((state: any) => { return state.app.staking &&  state.app.staking.ohmStake });
  const stakingRebase = useSelector((state: any) => { return state.app.stakingRebase });
  const stakingAPY    = useSelector((state: any) => { return state.app.stakingAPY });
  const currentBlock  = useSelector((state: any) => { return state.app.currentBlock });

  const setMax = () => {
    if (view === 'stake') {
      setQuantity(ohmBalance);
    } else {
      setQuantity(sohmBalance);
    }
  };

  const onSeekApproval = async (token: any) => {
    await dispatch(changeApproval({ address, token, provider, networkID: 1 }));
  };

  const onChangeStake = async (action: any) => {
    if (isNaN(quantity as any) || quantity === 0 || quantity === '') {
      alert('Please enter a value!');
      return;
    } else {
      await dispatch(changeStake({ address, action, value: (quantity as any).toString(), provider, networkID: 1 }));
    }
  };

  const hasAllowance = useCallback(() => {
    return stakeAllowance > 0;
  }, [stakeAllowance]);

  const timeUntilRebase = () => {
    if (currentBlock) {
      const rebaseBlock = getRebaseBlock(currentBlock);
      const seconds     = secondsUntilBlock(currentBlock, rebaseBlock);
      return prettifySeconds(seconds);
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="dapp-center-modal py-2 px-4 py-md-4 px-md-2">
        <div className="dapp-modal-wrapper d-flex align-items-center">
          <div className="swap-input-column">
            <div className="stake-toggle-row">
              <div className="btn-group" role="group">
                <button type="button" className={`btn ${view === 'stake' ? 'btn-light' : ''}`} onClick={() => {setView('stake')}}>Stake</button>
                <button type="button" className={`btn ${view === 'unstake' ? 'btn-light' : ''}`} onClick={() => {setView('unstake')}}>Unstake</button>
              </div>

            </div>

            <div className="input-group ohm-input-group mb-3 flex-nowrap d-flex">
              <input
                value={quantity}
                onChange={e => setQuantity(e.target.value as any)}
                type="number"
                className="form-control"
                placeholder="Type an amount"
              />

              <button className="btn" type="button" onClick={setMax}>Max</button>
            </div>

            <div className="stake-price-data-column">
              <div className="stake-price-data-row">
                <p className="price-label">Balance</p>
                <p className="price-data">{ trim(ohmBalance) } OHM</p>
              </div>

              <div className="stake-price-data-row">
                <p className="price-label">Staked</p>
                <p className="price-data">{ trim(sohmBalance, 4) } sOHM</p>
              </div>

              <div className="stake-price-data-row">
                <p className="price-label">Time until rebase</p>
                <p className="price-data">{ timeUntilRebase() }</p>
              </div>

              <div className="stake-price-data-row">
                <p className="price-label">Next Rebase</p>
                <p className="price-data">{ trim(stakingRebase * 100, 4) }%</p>
              </div>

              <div className="stake-price-data-row">
                <p className="price-label">ROI (5-day rate)</p>
                <p className="price-data">{ trim(fiveDayRate * 100, 4) }%</p>
              </div>

              <div className="stake-price-data-row">
                <p className="price-label">APY</p>
                <p className="price-data">{ trim(stakingAPY * 100, 4) }%</p>
              </div>

              <div className="stake-price-data-row">
                <p className="price-label">Current index</p>
                <p className="price-data">{ trim(currentIndex, 4) } OHM</p>
              </div>
            </div>

            {address && hasAllowance() && view === 'stake' && <div className="d-flex align-self-center mb-2">
              <div className="stake-button" onClick={() => { onChangeStake('stake') }}>Stake OHM</div>
            </div>}

            {address && hasAllowance() && view === 'unstake' && <div className="d-flex align-self-center mb-2">
              <div className="stake-button" onClick={() => { onChangeStake('unstake') }}>Unstake OHM</div>
            </div>}

            {address && !hasAllowance() && view === 'stake' && <div className="d-flex align-self-center mb-2">
              <div className="stake-button" onClick={() => { onSeekApproval('ohm') }}>Approve OHM</div>
            </div>}

            {address && !hasAllowance() && view === 'unstake' && <div className="d-flex align-self-center mb-2">
              <div className="stake-button" onClick={() => { onSeekApproval('sohm') }}>Approve sOHM</div>
            </div>}


          </div>
        </div>
      </div>
    </div>

  );
}

export default Stake;
