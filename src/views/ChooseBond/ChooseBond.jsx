import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { trim } from "../../helpers";
import BondRow from './BondRow';


function ChooseBond({ provider, address }) {
  const dispatch = useDispatch();

	const fiveDayRate  = useSelector((state ) => { return state.app.fiveDayRate });
	const marketPrice = useSelector((state ) => { return state.bonding['dai'] && state.bonding['dai'].marketPrice });

  return (
		<div className="d-flex align-items-center justify-content-center">
			<div className="dapp-center-modal d-flex flex-column ohm-card">
				<div className="py-4 px-4 py-md-4 px-md-4">
					<h2 className="text-center mb-4 text-white">How do you want to bond?</h2>
					<p>
						Bonds give you the opportunity to buy OHM from the protocol at a discount. All bonds
						have a 5-day vesting term. Current market price of OHM is { trim(marketPrice, 2) } DAI. If you stake instead, your ROI will be { trim(fiveDayRate * 100, 2) }%.
					</p>
				</div>

        <ul className="list-group ohm-list-group">
          {["ohm_dai_lp", "dai"].map(bond => {
            return <BondRow key={bond} bond={bond} />
          })}
        </ul>

			</div>
    </div>
  );
}

export default ChooseBond;
