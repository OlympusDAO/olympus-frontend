import { NetworkId } from "src/networkDetails";

import { useAppSelector } from ".";
import { useWeb3Context } from "./web3Context";

export const useOldAssetsDetected = () => {
  const { networkId } = useWeb3Context();

  return useAppSelector(state => {
    if (networkId && (networkId === NetworkId.MAINNET || networkId === NetworkId.TESTNET_RINKEBY)) {
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
