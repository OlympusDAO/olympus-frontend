import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { shorten, trim, getRebaseBlock, secondsUntilBlock, prettifySeconds, prettyVestingPeriod } from "../helpers";
import { changeApproval, calcBondDetails, calculateUserBondDetails, bondAsset, redeemBond } from '../actions/Bond.actions.js';
import BondHeader from '../components/BondHeader';
import BondRedeemV1 from '../components/BondRedeemV1';
import { BONDS } from "../constants";
import { NavLink } from 'react-router-dom';

type Props = {
  bond: string,
  provider: any,
  address: string
};



function Bond({ provider, address, bond }: Props) {
  const dispatch = useDispatch();

  const [slippage, setSlippage] = useState(2);
  const [recipientAddress, setRecipientAddress] = useState(address);

  const [view, setView] = useState("bond");
  const [quantity, setQuantity] = useState();

  const ohmBalance     = useSelector((state: any) => { return state.app.balances && state.app.balances.ohm });
  const sohmBalance    = useSelector((state: any) => { return state.app.balances && state.app.balances.sohm });

  const currentBlock = useSelector((state: any) => { return state.app.currentBlock });
  const bondMaturationBlock = useSelector((state: any) => { return state.bonding[bond] && state.bonding[bond].bondMaturationBlock });

  const vestingTerm    = useSelector((state: any) => { return state.bonding[bond] && state.bonding[bond].vestingBlock });
  const marketPrice    = useSelector((state: any) => { return state.bonding[bond] && state.bonding[bond].marketPrice });
  const bondPrice    = useSelector((state: any) => { return state.bonding[bond] && state.bonding[bond].bondPrice });
  const bondDiscount = useSelector((state: any) => { return state.bonding[bond] && state.bonding[bond].bondDiscount });
  const maxBondPrice = useSelector((state: any) => { return state.bonding[bond] && state.bonding[bond].maxBondPrice });
  const interestDue  = useSelector((state: any) => { return state.bonding[bond] && state.bonding[bond].interestDue });
  const pendingPayout = useSelector((state: any) => { return state.bonding[bond] && state.bonding[bond].pendingPayout });
  const debtRatio     = useSelector((state: any) => { return state.bonding[bond] && state.bonding[bond].debtRatio });
  const bondQuote     = useSelector((state: any) => { return state.bonding[bond] && state.bonding[bond].bondQuote });
  const balance       = useSelector((state: any) => { return state.bonding[bond] && state.bonding[bond].balance });
  const allowance     = useSelector((state: any) => { return state.bonding[bond] && state.bonding[bond].allowance });

  const hasEnteredAmount = () => {
    return !(isNaN(quantity as any) || quantity === 0 || quantity === '');
  }

  const onRecipientAddressChange = (e:any) => {
    return setRecipientAddress(e.target.value as any);
  };

  const onSlippageChange = (e:any) => {
    return setSlippage(e.target.value as any);
  };

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock) + parseInt(vestingTerm);
    const seconds      = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds, 'day');
  };

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bondMaturationBlock);
  };

  async function onRedeem({ autostake }: {autostake: any}) {
    await dispatch(redeemBond({ address, bond, networkID: 1, provider, autostake }));
  };

  async function onBond() {
    console.log("slippage = ", slippage);
    console.log("recipientAddress = ", recipientAddress);

    if (quantity === '') {
      alert('Please enter a value!');
    } else if (isNaN(quantity as any)) {
      alert('Please enter a valid value!');
    } else if (interestDue > 0 || pendingPayout > 0) {
      const shouldProceed = window.confirm(
        'You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?'
      );
      if (shouldProceed) {
        await dispatch(bondAsset({
          value: quantity,
          slippage, bond, networkID: 1, provider,
          address: recipientAddress || address
        }));
      }
    } else {
      await dispatch(bondAsset({
        value: quantity,
        slippage, bond, networkID: 1, provider,
        address: recipientAddress || address
      }));
    }
  };


  const setMax = () => {
    setQuantity(balance.toString());
  };

  const balanceUnits = () => {
    if (bond.indexOf("_lp") >= 0)
      return 'LP'
    else if (bond === BONDS.dai)
      return 'DAI'
  }

  async function loadBondDetails() {
    if (provider)
      await dispatch(calcBondDetails({ bond, value: quantity as any, provider, networkID: 1 }));

    if (provider && address) {
      await dispatch(calculateUserBondDetails({ address, bond, provider, networkID: 1 }));
    }

  }

  useEffect(() => {
    loadBondDetails();
    if (address)
      setRecipientAddress(address as any);
  }, [provider, quantity, address]);


  const onSeekApproval = async () => {
    await dispatch(changeApproval({ address, bond, provider, networkID: 1 }));
  };

  const hasAllowance = useCallback(() => {
    return allowance > 0;
  }, [allowance]);


  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="dapp-center-modal flex-column">
        <BondHeader bond={bond} slippage={slippage} recipientAddress={recipientAddress} onSlippageChange={onSlippageChange} onRecipientAddressChange={onRecipientAddressChange} />

        <div className="dapp-modal-wrapper py-2 px-2 py-md-4 px-md-2 m-auto">
          <div className="swap-input-column">
            <div className="stake-toggle-row">
              <div className="btn-group" role="group">
                <button type="button" className={`btn ${view === 'bond' ? 'btn-light' : ''}`} onClick={() => {setView('bond')}}>Bond</button>
                <button type="button" className={`btn ${view === 'redeem' ? 'btn-light' : ''}`} onClick={() => {setView('redeem')}}>Redeem</button>
                <button type="button" className={`btn ${view === 'redeem_v1' ? 'btn-light' : ''}`} onClick={() => {setView('redeem_v1')}} style={{paddingLeft: "5px", paddingRight: "5px", fontSize: "14px"}}>Redeem V1.0</button>
              </div>
            </div>

            {view === 'bond' && <div className="input-group ohm-input-group mb-3 flex-nowrap d-flex">
              <input
                value={quantity}
                onChange={e => setQuantity(e.target.value as any)}
                type="number"
                className="form-control"
                placeholder="Type an amount"
              />

              <button className="btn" type="button" onClick={setMax}>Max</button>
            </div>}

            {view === 'bond' && <div className="stake-price-data-column">
              <div className="stake-price-data-row">
                <p className="price-label">Balance</p>
                <p className="price-data">{ trim(balance, 4) } {balanceUnits()}</p>
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

              <div className={`stake-price-data-row ${hasEnteredAmount() ? '' : 'd-none'}`}>
                <p className="price-label">You Will Get</p>
                <p id="bond-value-id" className="price-data">
                  { trim(bondQuote, 4) } OHM
                </p>
              </div>

              <div className={`stake-price-data-row ${hasEnteredAmount() ? '' : 'd-none'}`}>
                <p className="price-label">Max You Can Buy</p>
                <p id="bond-value-id" className="price-data">
                  { trim(maxBondPrice, 4) } OHM
                </p>
              </div>
            </div>}

            {view === 'redeem' && <div className="stake-price-data-column">
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


            {view === 'redeem_v1' && <BondRedeemV1 provider={provider} address={address} bond={bond + '_v1'} />}

            {view == 'redeem' && <div className="d-flex align-self-center mb-4">
              <div className="redeem-button" onClick={() => { onRedeem({ autostake: false })}}>Claim</div>
            </div>}

            {false && view == 'redeem' && <div className="d-flex align-self-center mb-4">
              <div className="redeem-button" onClick={() => { onRedeem({ autostake: true  })}}>Claim and Autostake</div>
            </div>}

            {hasAllowance() && view === 'bond' && <div className="d-flex align-self-center mb-4">
              <div id="bond-button-id" className="redeem-button" onClick={onBond}>Bond</div>
            </div>}

            {!hasAllowance() && view === 'bond' && <div className="d-flex align-self-center mb-4">
              <div id="bond-button-id" className="redeem-button" onClick={onSeekApproval}>Approve</div>
            </div>}

            {view === 'bond' && <div className="stake-price-data-column">
              <div className="stake-price-data-row">
                <p className="price-label">Slippage Tolerance</p>
                <p id="bond-value-id" className="price-data">{ slippage }%</p>
              </div>
            </div>}

            {view === 'bond' && recipientAddress !== address && <div className="stake-price-data-row">
              <p className="price-label">Recipient</p>
              <p className="price-data">{ shorten(recipientAddress) }</p>
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
