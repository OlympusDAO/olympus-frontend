import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { NetworkId } from "src/constants";
import { NodeHelper } from "src/helpers/NodeHelper";

const providers: Partial<Record<NetworkId, StaticJsonRpcProvider>> = {
  [NetworkId.TESTNET_RINKEBY]: NodeHelper.getAnynetStaticProvider(NetworkId.TESTNET_RINKEBY),
  [NetworkId.FANTOM]: NodeHelper.getAnynetStaticProvider(NetworkId.FANTOM),
  [NetworkId.MAINNET]: NodeHelper.getAnynetStaticProvider(NetworkId.MAINNET),
  [NetworkId.POLYGON]: NodeHelper.getAnynetStaticProvider(NetworkId.POLYGON),
  [NetworkId.ARBITRUM]: NodeHelper.getAnynetStaticProvider(NetworkId.ARBITRUM),
  [NetworkId.AVALANCHE]: NodeHelper.getAnynetStaticProvider(NetworkId.AVALANCHE),
};

export const useStaticProvider = (networkId: NetworkId) => {
  return providers[networkId];
};
