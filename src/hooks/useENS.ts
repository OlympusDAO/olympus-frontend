import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";

import { useWeb3Context } from ".";

export const ensQueryKey = (address?: string) => ["useEns", address].filter(nonNullable);

export const useEns = () => {
  const { provider, address, networkId } = useWeb3Context();

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
