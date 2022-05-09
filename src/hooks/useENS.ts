import { useQuery } from "react-query";
import { nonNullable } from "src/helpers/types/nonNullable";
import { NetworkId } from "src/networkDetails";

import { useWeb3Context } from ".";

export const ensQueryKey = (address?: string) => ["useEns", address].filter(nonNullable);

export const useEns = () => {
  const { provider, address, networkId } = useWeb3Context();
  const isEnsSupported = networkId === NetworkId.MAINNET;

  return useQuery<string | null, Error>(ensQueryKey(address), () => provider.lookupAddress(address), {
    enabled: !!address && isEnsSupported,
  });
};
