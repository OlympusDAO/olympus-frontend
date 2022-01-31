import { useMutation } from "react-query";
import { NetworkId, NETWORKS } from "src/constants";
import { idToHexString } from "src/helpers/NetworkHelper";

import { useWeb3Context } from ".";
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
          chainId: idToHexString(networkId),
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
