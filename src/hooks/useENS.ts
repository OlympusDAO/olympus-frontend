import { useQuery } from "react-query";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";

import { useWeb3Context } from ".";
import { useTestableNetworks } from "./useTestableNetworks";

export const ensQueryKey = (address?: string) => ["useEns", address].filter(nonNullable);

export const useEns = () => {
  const networks = useTestableNetworks();
  const { provider, address, networkId } = useWeb3Context();

  const isEnsSupported = networkId === networks.MAINNET;

  const key = ensQueryKey(address);
  return useQuery<{ name: string | null; avatar: string | null }, Error>(
    key,
    async () => {
      queryAssertion(address, key);

      const name = await provider.lookupAddress(address);
      const avatar = name ? await provider.getAvatar(name) : null;

      return { name, avatar };
    },

    { enabled: !!address && isEnsSupported },
  );
};
