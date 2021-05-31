import React, { useState, useCallback, useEffect, } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { trim, getRebaseBlock, secondsUntilBlock, prettifySeconds, prettyVestingPeriod } from "../helpers";
import { changeApproval, calcBondDetails, calculateUserBondDetails, bondAsset, redeemBond } from '../actions/Bond.actions.js';
import { NavLink } from "react-router-dom";
import { BONDS } from "../constants";

type Props = {
  provider: any,
  address: string
};

function ChooseBond({ provider, address }: Props) {
	const dispatch = useDispatch();

	const [view, setView] = useState("choose");

	const fiveDayRate  = useSelector((state: any) => { return state.app.fiveDayRate });
	const marketPrice = useSelector((state: any) => { return state.bonding['dai'] && state.bonding['dai'].marketPrice });
	const bondPrice = useSelector((state: any) => { return state.bonding['ohm_dai_lp'] && state.bonding['ohm_dai_lp'].bondPrice });
	const bondDiscount = useSelector((state: any) => { return state.bonding['ohm_dai_lp'] && state.bonding['ohm_dai_lp'].bondDiscount });
	const daiBondPrice = useSelector((state: any) => { return state.bonding['dai'] && state.bonding['dai'].bondPrice });
	const daiBondDiscount = useSelector((state: any) => { return state.bonding['dai'] && state.bonding['dai'].bondDiscount });
	
  return (
		<div className="d-flex align-items-center justify-content-center min-vh-100">
			<div className="dapp-center-modal d-flex flex-column ohm-card">
				<div className="py-4 px-4 py-md-4 px-md-4">

									
					{ view === "choose" &&
						(
							<div>
								<h2 className="text-center mb-4">How do you want to bond?</h2>
								<p>
									Bonds give you the opportunity to buy OHM from the protocol at a discount. All bonds
									have a 5-day vesting term. Current market price of OHM is 
									{ trim(marketPrice, 2) } DAI. If you stake instead, your ROI will be
									{ trim(fiveDayRate * 100, 2) }%.
								</p>
							
								<ul className="list-group ohm-list-group">
									<li className="list-group-item d-flex align-items-center px-4">
										<div className="ohm-pairs d-flex mr-4 justify-content-center" style={{width:"64px"}}>
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

										<div className="text-light">
											<h3>
												OHM-DAI SLP
												<a
													href="https://analytics.sushi.com/pairs/0x34d7d7aaf50ad4944b70b320acb24c95fa2def7c"
													target="_blank"
												>
													<i className="fas fa-external-link-alt fa-sm ml-1"></i>
												</a>
											</h3>
											<p className="fs-6 mb-0">
												Bond Price: { trim(bondPrice, 2) } DAI
											</p>
											<p className="fs-6">ROI: { trim(bondDiscount * 100, 2) }%</p>
										</div>

										<div className="col">
											<NavLink to="/bonds/ohm_dai_lp">
												<button className="ohm-button button float-right">
													View
												</button>
											</NavLink>
										</div>
									</li>

									<li className="list-group-item d-flex align-items-center px-4">
										<div className="ohm-pairs d-flex mr-4 justify-content-center" style={{width: "64px"}}>
											<div className="ohm-pair" style={{zIndex: 1}}>
												<img
													src="https://raw.githubusercontent.com/sushiswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
												/>
											</div>
										</div>

										<div className="text-light">
											<h3>
												DAI
											</h3>
											<p className="fs-6 mb-0">
												Bond Price: { trim(daiBondPrice, 2) } DAI
											</p>
											<p className="fs-6">
												ROI: { trim(daiBondDiscount * 100, 2) }%
											</p>
										</div>

										<div className="col">
											<NavLink to="/bonds/dai">
												<button className="ohm-button button float-right">
													View
												</button>
											</NavLink>
										</div>
									</li>
								</ul>
							</div>
						)
					}
				</div>	
			</div>
    </div>
  );
}

export default ChooseBond;
