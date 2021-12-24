import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { useWeb3Context } from "./useWeb3Context";
import { useNetwork } from "./useNetwork";

export const addressQueries = {
  currentAddress: (networkId: NetworkId) => [networkId, "address"] as const,
};

export const useAddress = () => {
  const networkQuery = useNetwork();
  const web3Context = useWeb3Context();

  return useQuery<string, Error>({
    enabled: web3Context.isConnected,
    queryKey: addressQueries.currentAddress(networkQuery.data!),
    queryFn: async () => {
      return web3Context.provider.getSigner().getAddress();
    },
  });
};
