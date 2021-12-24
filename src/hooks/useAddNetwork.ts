import { useMutation } from "react-query";
import { NetworkId, NETWORKS } from "src/constants";
import { networkIdToHexString } from "src/helpers";
import { useWeb3Context } from "./useWeb3Context";
import { useSwitchNetwork } from "./useSwitchNetwork";

/**
 * Creates a new network in the wallet.
 */
export const useAddNetwork = () => {
  const { provider } = useWeb3Context();
  const switchNetworkMutation = useSwitchNetwork();

  return useMutation<void, Error, NetworkId>(
    async networkId => {
      const network = NETWORKS[networkId];

      await provider.send("wallet_addEthereumChain", [
        {
          chainId: networkIdToHexString(networkId),
          chainName: network["chainName"],
          nativeCurrency: network["nativeCurrency"],
          rpcUrls: network["rpcUrls"],
          blockExplorerUrls: network["blockExplorerUrls"],
        },
      ]);
    },
    {
      onSuccess: async (_, networkId) => {
        await switchNetworkMutation.mutateAsync(networkId);
      },
      onError: (error, networkId) => {
        console.log(`Error adding network: ${networkId}`);
        console.error(error);
      },
    },
  );
};
