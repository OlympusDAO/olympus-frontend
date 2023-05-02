import { Provider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { useMemo } from "react";
import { Environment } from "src/helpers/environment/Environment/Environment";

export const useArchiveNodeProvider = (networkId: number) => {
  const provider: Provider | undefined = useMemo(() => {
    if (networkId) {
      const url = Environment.getArchiveNodeUrl(networkId);
      if (url == undefined) throw new Error("You need an archive node for this feature to function properly");
      // NOTE(appleseed) we just choose the first archive node url if you provided multiple...
      return new ethers.providers.StaticJsonRpcProvider(url[0]);
    }
  }, [networkId]);

  return provider;
};
