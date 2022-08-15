import { useAppDetails } from "src/hooks/useAppDetails";

import { useAppSelector } from ".";

export const useHasDust = () => {
  const { data: appDetails } = useAppDetails();
  const { currentIndex, marketPrice } = appDetails || {};

  return useAppSelector(state => {
    if (!currentIndex || !marketPrice) {
      return true;
    }
    const wrappedBalance = Number(state.account.balances.wsohm) * Number(currentIndex);
    const ohmBalance = Number(state.account.balances.ohmV1);
    const sOhmbalance = Number(state.account.balances.sohmV1);
    if (ohmBalance > 0 && ohmBalance * marketPrice < 10) {
      return true;
    }
    if (sOhmbalance > 0 && sOhmbalance * marketPrice < 10) {
      return true;
    }
    if (wrappedBalance > 0 && wrappedBalance * marketPrice < 10) {
      return true;
    }
    return false;
  });
};
