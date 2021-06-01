import React, { useState, useCallback, useEffect, } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { trim, getRebaseBlock, secondsUntilBlock, prettifySeconds, prettyVestingPeriod } from "../helpers";
import { changeApproval, calcBondDetails, calculateUserBondDetails, bondAsset, redeemBond } from '../actions/Bond.actions.js';
import { NavLink } from "react-router-dom";
import { BONDS } from "../constants";
import BondRow from './BondRow';

type Props = {
  provider: any,
  address: string
};

function ChooseBond({ provider, address }: Props) {
  const dispatch = useDispatch();

	const fiveDayRate  = useSelector((state: any) => { return state.app.fiveDayRate });
	const marketPrice = useSelector((state: any) => { return state.bonding['dai'] && state.bonding['dai'].marketPrice });

  async function loadBondDetails() {
    if (provider && address) {
      Object.values(BONDS).map(async bond => {
        await dispatch(calcBondDetails({ address, bond, value: null, provider, networkID: 1 }));
      })
    }
  }

  useEffect(() => {
    loadBondDetails();
  }, [provider, address]);


  return (
		<div className="d-flex align-items-center justify-content-center min-vh-100">
			<div className="dapp-center-modal d-flex flex-column ohm-card">
				<div className="py-4 px-4 py-md-4 px-md-4">
					<h2 className="text-center mb-4">How do you want to bond?</h2>
					<p>
						Bonds give you the opportunity to buy OHM from the protocol at a discount. All bonds
						have a 5-day vesting term. Current market price of OHM is { trim(marketPrice, 2) } DAI. If you stake instead, your ROI will be { trim(fiveDayRate * 100, 2) }%.
					</p>
				</div>

        <ul className="list-group ohm-list-group">
          {Object.values(BONDS).map(bond => {
            return <BondRow bond={bond} />
          })}
        </ul>

			</div>
    </div>
  );
}

export default ChooseBond;
