import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { trim } from "../../helpers";
import BondRow from './BondRow';
import { BONDS } from "../../constants";

function ChooseBond({ provider, address }) {
  const dispatch = useDispatch();

	const fiveDayRate  = useSelector((state ) => { return state.app.fiveDayRate });
	const marketPrice = useSelector((state ) => { return state.bonding['dai'] && state.bonding['dai'].marketPrice });

  return (
		<div className="d-flex align-items-center justify-content-center min-vh-100">
			<div className="dapp-center-modal d-flex flex-column ohm-card">
				<div className="py-4 px-4 py-md-4 px-md-4">
					<h2 className="text-center mb-4 text-white">Redeem Your Bonds</h2>
					<p>
						Please note: bonds on Olympus Legacy have been disabled. This page should be used only to redeem outstanding bonds. 
						If you would like to create a new bond, please use <a href="https://app.olympusdao.finance/#/bonds" the new site> </a>.
					</p>
				</div>

        <ul className="list-group ohm-list-group">
          {[BONDS.ohm_dai, BONDS.dai,  BONDS.ohm_frax].map(bond => {
            return <BondRow key={bond} bond={bond} />
          })}
        </ul>

			</div>
    </div>
  );
}

export default ChooseBond;
