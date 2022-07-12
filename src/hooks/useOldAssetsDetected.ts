import { isChainEthereum } from "src/helpers";
import { useNetwork } from "wagmi";

import { useAppSelector } from ".";

export const useOldAssetsDetected = () => {
  const { chain = { id: 1 } } = useNetwork();

  return useAppSelector(state => {
    if (chain.id && isChainEthereum({ chainId: chain.id, includeTestnets: true })) {
      return (
        state.account.balances &&
        (Number(state.account.balances.sohmV1) ||
        Number(state.account.balances.ohmV1) ||
        Number(state.account.balances.wsohm)
          ? true
          : false)
      );
    } else {
      return false;
    }
  });
};
