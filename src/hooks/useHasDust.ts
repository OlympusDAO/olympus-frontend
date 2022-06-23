import { useAppSelector } from ".";

export const useHasDust = () => {
  return useAppSelector(state => {
    if (!state.app.currentIndex || !state.app.marketPrice) {
      return true;
    }
    const wrappedBalance = Number(state.account.balances.wsohm) * Number(state.app.currentIndex!);
    const ohmBalance = Number(state.account.balances.ohmV1);
    const sOhmbalance = Number(state.account.balances.sohmV1);
    if (ohmBalance > 0 && ohmBalance * state.app.marketPrice < 10) {
      return true;
    }
    if (sOhmbalance > 0 && sOhmbalance * state.app.marketPrice < 10) {
      return true;
    }
    if (wrappedBalance > 0 && wrappedBalance * state.app.marketPrice < 10) {
      return true;
    }
    return false;
  });
};
