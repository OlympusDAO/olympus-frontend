import { useCallback, useEffect } from "react";
import { useQueryClient } from "react-query";

import { addressQueryKey } from "./useAddress";
import { networkQueryKey } from "./useNetwork";
import { useWeb3Context } from "./useWeb3Context";

export const useProviderEventListeners = () => {
  const client = useQueryClient();
  const { provider, isConnected } = useWeb3Context();

  const handleAccountChanged = useCallback(() => {
    client.refetchQueries(addressQueryKey());
  }, [client]);

  const handleChainChanged = useCallback(() => {
    client.refetchQueries(networkQueryKey(isConnected));
  }, [client, isConnected]);

  useEffect(() => {
    provider.on("chainChanged", handleChainChanged);
    provider.on("accountsChanged", handleAccountChanged);

    return () => {
      provider.removeListener("chainChanged", handleChainChanged);
      provider.removeListener("accountsChanged", handleAccountChanged);
    };
  }, [provider, handleChainChanged, handleAccountChanged]);
};
