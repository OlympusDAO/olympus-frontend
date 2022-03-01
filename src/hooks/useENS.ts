import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { nonNullable, queryAssertion } from "src/helpers";
import { reactQueryErrorHandler } from "src/lib/react-query";

import { useWeb3Context } from ".";

export const ensQueryKey = (address?: string) => ["useEns", address].filter(nonNullable);

export const useEns = () => {
  const { provider, address, networkId } = useWeb3Context();

  const isEnsSupported = networkId === NetworkId.MAINNET || networkId === NetworkId.TESTNET_RINKEBY;

  const key = ensQueryKey(address);
  return useQuery<{ name: string | null; avatar: string | null }, Error>(
    key,
    async () => {
      queryAssertion(address, key);

      const name = await provider.lookupAddress(address);
      const avatar = name ? await provider.getAvatar(name) : null;

      return { name, avatar };
    },

    { enabled: !!address && isEnsSupported, onError: reactQueryErrorHandler(key) },
  );
};
