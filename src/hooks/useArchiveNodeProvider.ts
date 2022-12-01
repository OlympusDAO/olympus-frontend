import { Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { useMemo } from "react";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { EthereumNetwork } from "src/networkDetails";

export const useArchiveNodeProvider = (networkId: EthereumNetwork) => {
  const provider: Provider | undefined = useMemo(() => {
    if (networkId) {
      const url = Environment.getArchiveNodeUrl(networkId);
      console.log("check", networkId, url);
      if (url == undefined) throw new Error("You need an archive node for governance to function properly");
      // NOTE(appleseed) we just choose the first archive node url if you provided multiple...
      return new ethers.providers.StaticJsonRpcProvider(url[0]);
    }
  }, [networkId]);

  return provider;
};
