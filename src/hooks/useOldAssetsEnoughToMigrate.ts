import { useAppDetails } from "src/hooks/useAppDetails";

import { useAppSelector } from ".";

export const useOldAssetsEnoughToMigrate = () => {
  const { data: appDetails } = useAppDetails();
  const { currentIndex, marketPrice } = appDetails || {};

  return useAppSelector(state => {
    if (!currentIndex || !marketPrice) {
      return true;
    }
    const wrappedBalance = Number(state.account.balances.wsohm) * Number(currentIndex);
    const allAssetsBalance =
      Number(state.account.balances.sohmV1) + Number(state.account.balances.ohmV1) + wrappedBalance;
    return marketPrice * allAssetsBalance >= 10;
  });
};
