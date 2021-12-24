import { useCallback, useEffect } from "react";
import { useQueryClient } from "react-query";
import { useWeb3Context } from "./useWeb3Context";
import { addressQueries } from "./useAddress";
import { networkQueries, useNetwork } from "./useNetwork";

export const useProviderEventListeners = () => {
  const client = useQueryClient();
  const networkQuery = useNetwork();
  const web3Context = useWeb3Context();

  const handleAccountChanged = useCallback(() => {
    client.refetchQueries(addressQueries.currentAddress(networkQuery.data!));
  }, [client, networkQuery.data]);

  const handleChainChanged = useCallback(() => {
    client.refetchQueries(networkQueries.currentNetwork());
  }, [client]);

  useEffect(() => {
    web3Context.provider.on("chainChanged", handleChainChanged);
    web3Context.provider.on("accountsChanged", handleAccountChanged);

    return () => {
      web3Context.provider.removeListener("chainChanged", handleChainChanged);
      web3Context.provider.removeListener("accountsChanged", handleAccountChanged);
    };
  }, [web3Context.provider, handleChainChanged, handleAccountChanged]);
};
