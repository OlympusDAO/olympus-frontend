import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { queryAssertion } from "src/helpers";

import { useAddress } from "./useAddress";
import { useNetwork } from "./useNetwork";
import { useWeb3Context } from "./useWeb3Context";

export const ensQueryKey = (address?: string) => [address, "useEns"];

export const useEns = () => {
  const { provider } = useWeb3Context();
  const { data: address } = useAddress();
  const { data: networkId } = useNetwork();

  const isEnsSupported = networkId === NetworkId.MAINNET || networkId === NetworkId.TESTNET_RINKEBY;

  return useQuery<{ name: string | null; avatar: string | null }, Error>(
    ensQueryKey(address),
    async () => {
      queryAssertion(address, ensQueryKey(address));

      const name = await provider.lookupAddress(address);
      const avatar = name ? await provider.getAvatar(name) : null;

      return { name, avatar };
    },

    { enabled: !!address && isEnsSupported },
  );
};
