import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { useWeb3Context } from "./useWeb3Context";

export const useNetworkKey = () => ["useNetwork"];

/**
 * Returns the wallets currently active network.
 * Guaranteed to return only a supported network.
 * @default NetworkId.MAINNET
 */
export const useNetwork = () => {
  const web3Context = useWeb3Context();

  return useQuery<NetworkId, Error>(
    useNetworkKey(),
    async () => {
      const { chainId } = await web3Context.provider.getNetwork();

      const isSupportedNetwork = Object.values(NetworkId).includes(chainId);
      if (!isSupportedNetwork) throw new Error("Unsupported network");

      return chainId;
    },
    { initialData: NetworkId.MAINNET },
  );
};
