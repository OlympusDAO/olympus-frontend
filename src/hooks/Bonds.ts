import { useEffect, useState } from "react";
import orderBy from "lodash/orderBy";
import { useAppSelector } from ".";

export const makeBondsArray = (
  ohmDaiBondDiscount?: number | undefined,
  ohmFraxLpBondDiscount?: number | undefined,
  daiBondDiscount?: number | undefined,
  fraxBondDiscount?: number | undefined,
) => {
  return [
    {
      name: "OHM-DAI LP",
      value: "ohm_dai_lp",
      discount: Number(ohmDaiBondDiscount),
    },
    {
      name: "OHM-FRAX LP",
      value: "ohm_frax_lp",
      discount: Number(ohmFraxLpBondDiscount),
    },
    {
      name: "DAI",
      value: "dai",
      discount: Number(daiBondDiscount),
    },
    {
      name: "FRAX",
      value: "frax",
      discount: Number(fraxBondDiscount),
    },
  ];
};

const BONDS_ARRAY = makeBondsArray();
// TS-REFACTOR: this function is allowed to pass in undefined, not sure if this is the intent
// as Number(undefined) = NaN.

/**
 * Returns an array of bonds ordered by the most profitable ones first.
 * Each bond object contains its display name, value, and the discount amount.
 *
 * @returns {[{name: string, discount: number, value: string}, {name: string, discount: number, value: string}, {name: string, discount: number, value: string}, {name: string, discount: number, value: string}]}
 */
export default function useBonds() {
  const fraxBondDiscount = useAppSelector(state => {
    return (state.bonding && state.bonding["frax"] && state.bonding["frax"].bondDiscount) || 0;
  });

  const daiBondDiscount = useAppSelector(state => {
    return (state.bonding && state.bonding["dai"] && state.bonding["dai"].bondDiscount) || 0;
  });

  const ohmDaiBondDiscount = useAppSelector(state => {
    return (state.bonding && state.bonding["ohm_dai_lp"] && state.bonding["ohm_dai_lp"].bondDiscount) || 0;
  });

  const ohmFraxLpBondDiscount = useAppSelector(state => {
    return (state.bonding && state.bonding["ohm_frax_lp"] && state.bonding["ohm_frax_lp"].bondDiscount) || 0;
  });

  const [bonds, setBonds] = useState(BONDS_ARRAY);

  useEffect(() => {
    const bondValues = makeBondsArray(ohmDaiBondDiscount, ohmFraxLpBondDiscount, daiBondDiscount, fraxBondDiscount);
    const mostProfitableBonds = orderBy(bondValues, "discount", "desc");
    setBonds(mostProfitableBonds);
  }, [ohmDaiBondDiscount, ohmFraxLpBondDiscount, daiBondDiscount, fraxBondDiscount]);

  return bonds;
}
