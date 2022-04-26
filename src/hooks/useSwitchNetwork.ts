import { useMutation } from "react-query";
import { NetworkId, NETWORKS } from "src/constants/networks";
import { idToHexString } from "src/helpers/NetworkHelper";

import { useWeb3Context } from ".";

/**
 * Switches the wallets currently active network.
 */
export const useSwitchNetwork = () => {
  const { provider } = useWeb3Context();

  return useMutation<void, Error, NetworkId>(
    async networkId => {
      try {
        await provider.send("wallet_switchEthereumChain", [{ chainId: idToHexString(networkId) }]);
      } catch (error: any) {
        if (error?.code === 4902) {
          // Try add the network to users wallet

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
        }

        throw error;
      }
    },
    {
      onError: error => {
        console.log(`Error switching to network`);
        console.error(error);
      },
    },
  );
};
