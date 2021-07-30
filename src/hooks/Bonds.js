import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import orderBy from "lodash/orderBy";

export const makeBondsArray = (
  ohmDaiBondDiscount,
  ohmFraxLpBondDiscount,
  daiBondDiscount,
  fraxBondDiscount,
  ethBondDiscount,
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
    {
      name: "ETH",
      value: "eth",
      discount: Number(ethBondDiscount),
    },
  ];
};

const BONDS_ARRAY = makeBondsArray();

/**
 * Returns an array of bonds ordered by the most profitable ones first.
 * Each bond object contains its display name, value, and the discount amount.
 *
 * @returns {[{name: string, discount: number, value: string}, {name: string, discount: number, value: string}, {name: string, discount: number, value: string}, {name: string, discount: number, value: string}]}
 */
export default function useBonds() {
  const fraxBondDiscount = useSelector(state => {
    return state.bonding["frax"] && state.bonding["frax"].bondDiscount;
  });

  const daiBondDiscount = useSelector(state => {
    return state.bonding["dai"] && state.bonding["dai"].bondDiscount;
  });

  const ohmDaiBondDiscount = useSelector(state => {
    return state.bonding["ohm_dai_lp"] && state.bonding["ohm_dai_lp"].bondDiscount;
  });

  const ohmFraxLpBondDiscount = useSelector(state => {
    return state.bonding["ohm_frax_lp"] && state.bonding["ohm_frax_lp"].bondDiscount;
  });

  const ethBondDiscount = useSelector(state => {
    return state.bonding["eth"] && state.bonding["eth"].bondDiscount;
  });

  const [bonds, setBonds] = useState(BONDS_ARRAY);

  useEffect(() => {
    const bondValues = makeBondsArray(
      ohmDaiBondDiscount,
      ohmFraxLpBondDiscount,
      daiBondDiscount,
      fraxBondDiscount,
      ethBondDiscount,
    );
    const mostProfitableBonds = orderBy(bondValues, "discount", "desc");
    setBonds(mostProfitableBonds);
  }, [ohmDaiBondDiscount, ohmFraxLpBondDiscount, daiBondDiscount, fraxBondDiscount, ethBondDiscount]);

  return bonds;
}
