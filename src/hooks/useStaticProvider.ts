import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { NetworkId } from "src/constants";
import { NodeHelper } from "src/helpers/NodeHelper";

const providers = {} as Record<NetworkId, StaticJsonRpcProvider>;

export const useStaticProvider = (networkId: NetworkId) => {
  if (!providers[networkId]) providers[networkId] = NodeHelper.getAnynetStaticProvider(networkId);

  return providers[networkId];
};
