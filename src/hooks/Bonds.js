import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import orderBy from "lodash/orderBy";

export const makeBondsArray = (ohmDaiBondDiscount, ohmFraxLpBondDiscount, daiBondDiscount, fraxBondDiscount) => {
  return [
    {
      name: 'OHM-DAI LP',
      value: 'ohm_dai_lp',
      discount: Number(ohmDaiBondDiscount)
    },
    {
      name: 'OHM-FRAX LP',
      value: 'ohm_frax_lp',
      discount: Number(ohmFraxLpBondDiscount)
    },
    {
      name: 'DAI',
      value: 'dai',
      discount: Number(daiBondDiscount)
    },
    {
      name: 'FRAX',
      value: 'frax',
      discount: Number(fraxBondDiscount)
    },
  ]
};

const BONDS_ARRAY = makeBondsArray();

export default function useBonds() {
  const fraxBondDiscount = useSelector(state => {
    return state.bonding['frax'] && state.bonding['frax'].bondDiscount;
  });

  const daiBondDiscount = useSelector(state => {
    return state.bonding['dai'] && state.bonding['dai'].bondDiscount;
  });

  const ohmDaiBondDiscount = useSelector(state => {
    return state.bonding['ohm_dai_lp'] && state.bonding['ohm_dai_lp'].bondDiscount;
  });

  const ohmFraxLpBondDiscount = useSelector(state => {
    return state.bonding['ohm_frax_lp'] && state.bonding['ohm_frax_lp'].bondDiscount;
  })

  const [bonds, setBonds] = useState(BONDS_ARRAY);

  useEffect(() => {
    const bondValues = makeBondsArray(ohmDaiBondDiscount, ohmFraxLpBondDiscount, daiBondDiscount, fraxBondDiscount);
    const mostProfitableBonds = orderBy(bondValues, 'discount', 'desc');
    setBonds(mostProfitableBonds);
  }, [ohmDaiBondDiscount, ohmFraxLpBondDiscount, daiBondDiscount, fraxBondDiscount]);

  return bonds;
}
