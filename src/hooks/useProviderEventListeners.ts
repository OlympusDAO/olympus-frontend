import { useCallback, useEffect } from "react";
import { useQueryClient } from "react-query";
import { useWeb3Context } from "./useWeb3Context";
import { useAddressKey } from "./useAddress";
import { useNetworkKey } from "./useNetwork";

export const useProviderEventListeners = () => {
  const client = useQueryClient();
  const { provider } = useWeb3Context();

  const handleAccountChanged = useCallback(() => {
    client.refetchQueries(useAddressKey());
  }, [client]);

  const handleChainChanged = useCallback(() => {
    client.refetchQueries(useNetworkKey());
  }, [client]);

  useEffect(() => {
    provider.on("chainChanged", handleChainChanged);
    provider.on("accountsChanged", handleAccountChanged);

    return () => {
      provider.removeListener("chainChanged", handleChainChanged);
      provider.removeListener("accountsChanged", handleAccountChanged);
    };
  }, [provider, handleChainChanged, handleAccountChanged]);
};
