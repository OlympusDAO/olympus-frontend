import { UseQueryResult, useQuery, UseMutationResult, useQueryClient, useMutation } from "react-query";
import { NetworkId, NETWORKS } from "src/constants";
import { useWeb3Context } from ".";

/**
 * Query that fetches the wallets currently active network id.
 */
export const useNetworkId = (): UseQueryResult<NetworkId, Error> => {
  const { provider } = useWeb3Context();

  return useQuery(
    "network",
    async () => {
      const id = await provider.getNetwork().then(network => network.chainId.toString());
      const isSupportedNetwork = id in NetworkId;
      if (!isSupportedNetwork) throw new Error("Please connect to a supported network");
      return id;
    },
    {
      onError: error => {
        console.log(`Error determining network`);
        console.error(error);
        // dispatch(error("Error connecting to wallet!"));
      },
    },
  );
};

/**
 * Mutation to switch the wallets currently active network.
 */
export const useSwitchNetwork = (): UseMutationResult<void, Error, NetworkId> => {
  const client = useQueryClient();
  const { provider } = useWeb3Context();
  const addNetworkMutation = useAddNetwork();

  return useMutation(
    async networkId => {
      await provider.send("wallet_switchEthereumChain", [{ chainId: idToHexString(networkId) }]);
    },
    {
      onSuccess: () => {
        client.refetchQueries("network");
      },
      // (sam-potter)
      // @TODO: It looks like ethers-js extends the native error object
      // with the `code` and `reason` properties instead of exporting their own
      // custom error type. Ngl, that seems like bad practice to me, but oh well.
      // Therefore, we typecast the error as `any` to access those properties.
      onError: (error: any, networkId) => {
        // If the chain has not been added to the user's wallet
        if (error.code === 4902) return addNetworkMutation.mutate(networkId);

        console.log(`Error switching to network: ${networkId}`);
        console.error(error);
        // dispatch(error(''))
      },
    },
  );
};

/**
 * Mutation that creates a new network in the wallet.
 */
export const useAddNetwork = (): UseMutationResult<void, Error, NetworkId> => {
  const { provider } = useWeb3Context();
  const switchNetworkMutation = useSwitchNetwork();

  return useMutation(
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
      onSuccess: (_, networkId) => {
        switchNetworkMutation.mutate(networkId);
      },
      onError: (error, networkId) => {
        console.log(`Error adding network: ${networkId}`);
        console.error(error);
        // dispatch(error("Error switching network!"));
      },
    },
  );
};

const idToHexString = (id: NetworkId) => "0x" + id.toString(16);
