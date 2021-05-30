import React, { useState, useCallback, } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { trim, getRebaseBlock, secondsUntilBlock, prettifySeconds } from "../helpers";
import { changeApproval, calcBondDetails, calculateUserBondDetails } from '../actions/Bond.actions.js';

type Props = {
  provider: any,
  address: string
};

function Bond({ provider, address }: Props) {
  const dispatch = useDispatch();

  const [view, setView] = useState("bond");
  const [quantity, setQuantity] = useState();


  const currentBlock = useSelector((state: any) => { return state.app.currentBlock });
  const fiveDayRate  = useSelector((state: any) => { return state.app.fiveDayRate });
  const stakingRebase  = useSelector((state: any) => { return state.app.stakingRebase });
  const currentIndex = useSelector((state: any) => { return state.app.currentIndex });
  const stakingAPY   = useSelector((state: any) => { return state.app.stakingAPY });

  const ohmBalance     = useSelector((state: any) => { return state.app.balances && state.app.balances.ohm });
  const sohmBalance    = useSelector((state: any) => { return state.app.balances && state.app.balances.sohm });
  const stakeAllowance = useSelector((state: any) => { return state.app.staking &&  state.app.staking.ohmStake });


  const [balance, setBalance] = useState();
  const [bondValue, setBondValue] = useState();
  const [bondPrice, setBondPrice] = useState();
  const [marketPrice, setMarketPrice] = useState();
  const [hasEnteredAmount, setHasEnteredAmount] = useState();
  const [bondQuote, setBondQuote] = useState();
  const [maxBondPrice, setMaxBondPrice] = useState();
  const [interestDue, setInterestDue] = useState();
  const [pendingPayout, setPendingPayout] = useState();
  const [debtRatio, setDebtRatio] = useState();
  const [bondDiscount, setBondDiscount] = useState();

  const vestingPeriod = () => {
    return 0;
  };

  const vestingTime = () => {
    return 0;
  };

  const redeem = () => {
    return 0;
  };

  const bond = () => {
    return 0;
  };


  const setMax = () => {
    if (view === 'bond') {
      setQuantity(ohmBalance);
    } else {
      setQuantity(sohmBalance);
    }
  };

  const onInputChange = async () => {
    await dispatch(calcBondDetails(quantity as any));
    await dispatch(calculateUserBondDetails());
  }

  const onSeekApproval = async (token: any) => {
    await dispatch(changeApproval({ address, token, provider, networkID: 1 }));
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
      <div className="dapp-center-modal flex-column">
        <div className="d-flex flex-row align-items-center my-2 px-2 my-md-4 px-md-4">
          <div className="d-flex flex-row col justify-content-center">
            <div className="ohm-pairs d-sm-flex mr-2 d-none">
              <div className="ohm-pair" style={{zIndex: 2}}>
                <img
                  src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x383518188C0C6d7730D91b2c03a03C837814a899/logo.png"
                />
              </div>

              <div className="ohm-pair" style={{zIndex: 1}}>
                <img
                  src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
                />
              </div>
            </div>

            <div className="text-light align-self-center">
              <h3>
                FRAX Bond
              </h3>
            </div>
          </div>
        </div>

        <div className="dapp-modal-wrapper py-2 px-2 py-md-4 px-md-2 m-auto">
          <div className="swap-input-column">
            <div className="stake-toggle-row">
              <div className="btn-group" role="group">
                <button type="button" className={`btn ${view === 'bond' ? 'btn-secondary' : ''}`} onClick={() => {setView('bond')}}>Bond</button>
                <button type="button" className={`btn ${view === 'redeem' ? 'btn-secondary' : ''}`} onClick={() => {setView('redeem')}}>Redeem</button>
              </div>
            </div>

            {view === 'bond' && <div className="input-group ohm-input-group mb-3 flex-nowrap d-flex">
              <input
                value={quantity}
                onChange={onInputChange}
                type="number"
                className="form-control"
                placeholder="Type an amount"
              />

              <button className="btn" type="button" onClick={setMax}>Max</button>
            </div>}

            {view === 'bond' && <div className="stake-price-data-column">
              <div className="stake-price-data-row">
                <p className="price-label">Balance</p>
                <p className="price-data">{ trim(balance, 4) }</p>
              </div>
              <div className="stake-price-data-row">
                <p className="price-label">Bond Price</p>
                <p id="bond-price-id" className="price-data">
                  { trim(bondPrice, 2) } DAI
                </p>
              </div>
              <div className="stake-price-data-row">
                <p className="price-label">Market Price</p>
                <p id="bond-market-price-id" className="price-data">
                  { trim(marketPrice, 2) } DAI
                </p>
              </div>

              <div className={`stake-price-data-row' ${hasEnteredAmount ? '' : 'd-none'}`}>
                <p className="price-label">You Will Get</p>
                <p id="bond-value-id" className="price-data">
                  { trim(bondQuote, 4) } OHM
                </p>
              </div>

              <div className={`stake-price-data-row' ${hasEnteredAmount ? '' : 'd-none'}`}>
                <p className="price-label">Max You Can Buy</p>
                <p id="bond-value-id" className="price-data">
                  { trim(maxBondPrice, 4) } OHM
                </p>
              </div>
            </div>}

            {view === 'redeem' && <div v-else className="stake-price-data-column">
              <div className="stake-price-data-row">
                <p className="price-label">Balance</p>
                <p className="price-data">{ trim(balance, 4) }</p>
              </div>
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
            </div>}

            {view == 'redeem' && <div className="d-flex align-self-center mb-4">
              <div className="redeem-button" onClick={redeem}>Claim Rewards</div>
            </div>}

            {hasAllowance() && view === 'bond' && <div className="d-flex align-self-center mb-4">
              <div id="bond-button-id" className="redeem-button" onClick={bond}>Bond</div>
            </div>}

            {!hasAllowance() && view === 'bond' && <div className="d-flex align-self-center mb-4">
              <div id="bond-button-id" className="redeem-button" onClick={onSeekApproval}>Approve</div>
            </div>}

          </div>
        </div>

        <div className="bond-data">
          <div className="row bond-data-row p-4">
            <div className="col-4 text-center">
              <p>Debt Ratio</p>
              <p>{ trim( (debtRatio as any) / 10000000, 2) }%</p>
            </div>
            <div className="col-4 text-center">
              <p>Vesting Term</p>
              <p>{ vestingPeriod() }</p>
            </div>
            <div className="col-4 text-center">
              <p>ROI</p>
              <p>{ trim( (bondDiscount as any) * 100, 2) }%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bond;
