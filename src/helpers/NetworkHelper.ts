import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";

import { NetworkId, NETWORKS } from "../constants";
import { Providers } from "./providers/Providers/Providers";

interface IGetCurrentNetwork {
  provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export const initNetworkFunc = async ({ provider }: IGetCurrentNetwork) => {
  try {
    let networkName: string;
    let uri: string;
    let supported = true;
    const id: number = await provider.getNetwork().then(network => network.chainId);
    switch (id) {
      case 1:
        networkName = "Ethereum";
        uri = Providers.getProviderUrl(id);
        break;
      case 4:
        networkName = "Rinkeby Testnet";
        uri = Providers.getProviderUrl(id);
        break;
      case 42161:
        networkName = "Arbitrum";
        uri = Providers.getProviderUrl(id);
        break;
      case 421611:
        networkName = "Arbitrum Testnet";
        uri = Providers.getProviderUrl(NetworkId.ARBITRUM_TESTNET);
        break;
      case 43113:
        networkName = "Avalanche Fuji Testnet";
        uri = Providers.getProviderUrl(NetworkId.AVALANCHE_TESTNET);
        break;
      case 43114:
        networkName = "Avalanche";
        uri = Providers.getProviderUrl(NetworkId.AVALANCHE);
        break;
      default:
        supported = false;
        networkName = "Unsupported Network";
        uri = "";
        break;
    }

    return {
      networkId: id,
      networkName: networkName,
      uri: uri,
      initialized: supported,
    };
  } catch (e) {
    console.log(e);
    return {
      networkId: -1,
      networkName: "",
      uri: "",
      initialized: false,
    };
  }
};

interface ISwitchNetwork {
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  networkId: number;
}

export const switchNetwork = async ({ provider, networkId }: ISwitchNetwork) => {
  try {
    await provider.send("wallet_switchEthereumChain", [{ chainId: idToHexString(networkId) }]);
  } catch (e) {
    // If the chain has not been added to the user's wallet
    // @ts-ignore
    if (e.code === 4902) {
      const network = NETWORKS[networkId];
      const params = [
        {
          chainId: idToHexString(networkId),
          chainName: network["chainName"],
          nativeCurrency: network["nativeCurrency"],
          rpcUrls: network["rpcUrls"],
          blockExplorerUrls: network["blockExplorerUrls"],
        },
      ];

      try {
        await provider.send("wallet_addEthereumChain", params);
      } catch (e) {
        console.log(e);
        // dispatch(error("Error switching network!"));
      }
    }
    // }
  }
};

export const idToHexString = (id: number) => {
  return "0x" + id.toString(16);
};

export const idFromHexString = (hexString: string) => {
  return parseInt(hexString, 16);
};
