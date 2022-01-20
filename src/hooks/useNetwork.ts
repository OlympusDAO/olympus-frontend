import { useQuery } from "react-query";
import { NetworkId } from "src/constants";

import { useWeb3Context } from "./useWeb3Context";

export const networkQueryKey = (isConnected: boolean) => ["useNetwork", isConnected];

/**
 * Returns the wallets currently active network.
 * Guaranteed to return only a supported network.
 * @default NetworkId.MAINNET
 */
export const useNetwork = () => {
  const { provider, isConnected } = useWeb3Context();

  return useQuery<NetworkId, Error>(
    networkQueryKey(isConnected),
    async () => {
      const { chainId } = await provider.getNetwork();

      const isSupportedNetwork = Object.values(NetworkId).includes(chainId);
      if (!isSupportedNetwork) throw new Error("Unsupported network");

      return chainId;
    },
    { initialData: NetworkId.MAINNET },
  );
};
