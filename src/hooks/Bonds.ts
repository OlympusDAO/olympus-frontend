import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import allBonds from "src/helpers/AllBonds";

interface IBondingStateView {
  bonding: {
    loading: Boolean;
    [key: string]: any;
  };
}

const initialBondArray = allBonds;
function useBonds() {
  const bondLoading = useSelector((state: IBondingStateView) => !state.bonding.loading);
  const bondState = useSelector((state: IBondingStateView) => state.bonding);
  const [bonds, setBonds] = useState(initialBondArray);

  useEffect(() => {
    const bondDetails = allBonds.map(bond => {
      if (bondState[bond.name] && bondState[bond.name].bondDiscount) {
        return Object.assign(bond, bondState[bond.name]); // Keeps the object type
      }
      // We have no data regarding bonds yet
      return bond;
    });

    const mostProfitableBonds = bondDetails
      .concat()
      .sort((a, b) => (a["bondDiscount"] > b["bondDiscount"] ? -1 : b["bondDiscount"] > a["bondDiscount"] ? 1 : 0));
    setBonds(mostProfitableBonds);
  }, [bondState, bondLoading]);

  // Debug Log:
  // console.log(bonds);
  return { bonds, loading: bondLoading };
}

export default useBonds;
