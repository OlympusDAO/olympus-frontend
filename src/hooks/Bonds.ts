import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import allBonds from "src/helpers/AllBonds";

interface IBondingStateView {
  bonding: {
    loading: Boolean;
    [key: string]: any;
  };
}

const initialBondArray = allBonds.map(bond => {
  return { name: bond.displayName, value: bond.name, discount: 0 };
});
function useBonds() {
  // TODO(zx): find usages of this and make shit consistent from allBonds.ts usage (this is only a limited view into the world.)
  const bondLoading = useSelector((state: IBondingStateView) => !state.bonding.loading);
  const bondState = useSelector((state: IBondingStateView) => state.bonding);
  const [bonds, setBonds] = useState(initialBondArray);

  useEffect(() => {
    const discounts = allBonds.map(bond => {
      let bondDiscount = 0;
      if (bondState[bond.name] && bondState[bond.name].bondDiscount) {
        bondDiscount = bondState[bond.name].bondDiscount;
      }

      return {
        name: bond.displayName,
        value: bond.name,
        discount: Number(bondDiscount),
      };
    });

    const mostProfitableBonds = discounts
      .concat()
      .sort((a, b) => (a["discount"] > b["discount"] ? -1 : b["discount"] > a["discount"] ? 1 : 0));
    setBonds(mostProfitableBonds);
  }, [bondState, bondLoading]);

  return bonds;
}

export default useBonds;
