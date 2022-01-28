import { useMutation } from "react-query";
import { NetworkId } from "src/constants";
import { idToHexString } from "src/helpers/NetworkHelper";

import { useWeb3Context } from ".";
import { useAddNetwork } from "./useAddNetwork";

/**
 * Switches the wallets currently active network.
 */
export const useSwitchNetwork = () => {
  const { provider } = useWeb3Context();
  const addNetworkMutation = useAddNetwork();

  return useMutation<void, Error, NetworkId>(
    async networkId => {
      await provider.send("wallet_switchEthereumChain", [{ chainId: idToHexString(networkId) }]);
    },
    {
      // (sam-potter)
      // @TODO: It looks like ethers-js extends the native error object
      // with the `code` and `reason` properties instead of exporting their own
      // custom error type. Ngl, that seems like bad practice to me, but oh well.
      // Therefore, we typecast the error as `any` to access those properties.
      onError: async (error: any, networkId) => {
        // Means the chain has not been added to the user's wallet
        if (error.code === 4902) {
          await addNetworkMutation.mutateAsync(networkId);
          return;
        }

        console.log(`Error switching to network`);
        console.error(error);
      },
    },
  );
};
