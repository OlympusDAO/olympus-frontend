import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { nonNullable } from "src/helpers/typeUtil";
import { NetworkId } from "src/networkDetails";

import { Environment } from "../environment/environment";

export class Providers {
  private static _invalidProviderUrls: string[] = [];
  private static _providerCache = {} as Record<NetworkId, StaticJsonRpcProvider>;

  /**
   * Returns a provider url for a given network
   */
  public static getProviderUrl(networkId: NetworkId) {
    const alchemy = this._getAlchemyUrl(networkId);
    const infura = this._getInfuraUrl(networkId);
    const external = this._getExternalUrl(networkId);
    const self = this._getSelfHostedUrl(networkId);

    const [url] = [alchemy, infura, external, self]
      .filter(nonNullable)
      .filter(url => !this._invalidProviderUrls.includes(url));

    if (!url) throw new Error(`No provider url found for network: ${networkId}`);

    return url;
  }

  /**
   * Returns a static provider for a given network
   */
  public static getStaticProvider(networkId: NetworkId) {
    if (!this._providerCache[networkId])
      this._providerCache[networkId] = new StaticJsonRpcProvider(this.getProviderUrl(networkId));

    return this._providerCache[networkId];
  }

  /**
   * Returns an external url for a given network,
   * usually provided by that network itself
   */
  private static _getExternalUrl(networkId: NetworkId) {
    switch (networkId) {
      case NetworkId.FANTOM:
        return `https://rpc.ftm.tools/`;
      case NetworkId.FANTOM_TESTNET:
        return `https://rpc.testnet.fantom.network/`;
      case NetworkId.AVALANCHE:
        return `https://api.avax.network/ext/bc/C/rpc`;
      case NetworkId.AVALANCHE_TESTNET:
        return `https://api.avax-test.network/ext/bc/C/rpc`;
    }
  }

  /**
   * Returns an Alchemy url for a given network
   */
  private static _getAlchemyUrl(networkId: NetworkId) {
    const key = Environment.getAlchemyApiKey();
    console.error({ networkId });

    switch (networkId) {
      case NetworkId.MAINNET:
        return `https://eth-mainnet.alchemyapi.io/v2/${key}`;
      case NetworkId.TESTNET_RINKEBY:
        return `https://eth-rinkeby.alchemyapi.io/v2/${key}`;
      case NetworkId.ARBITRUM:
        return `https://arb-mainnet.g.alchemy.com/v2/${key}`;
      case NetworkId.ARBITRUM_TESTNET:
        return `https://arb-rinkeby.g.alchemy.com/v2/${key}`;
      case NetworkId.POLYGON:
        return `https://polygon-mainnet.g.alchemy.com/v2/${key}`;
      case NetworkId.POLYGON_TESTNET:
        return `https://polygon-mumbai.g.alchemy.com/v2/${key}`;
      default:
        console.error("NetworkId not known", { networkId });
    }
  }

  /**
   * Returns an Infura url for a given network
   */
  private static _getInfuraUrl(networkId: NetworkId) {
    const key = Environment.getInfuraApiKey();

    switch (networkId) {
      case NetworkId.MAINNET:
        return `https://mainnet.infura.io/v3/${key}`;
      case NetworkId.TESTNET_RINKEBY:
        return `https://rinkeby.infura.io/v3/${key}`;
      case NetworkId.ARBITRUM:
        return `https://arbitrum-mainnet.infura.io/v3/${key}`;
      case NetworkId.ARBITRUM_TESTNET:
        return `https://arbitrum-rinkeby.infura.io/v3/${key}`;
      case NetworkId.POLYGON:
        return `https://polygon-mainnet.infura.io/v3/${key}`;
      case NetworkId.POLYGON_TESTNET:
        return `https://polygon-mumbai.infura.io/v3/${key}`;
    }
  }

  /**
   * Returns the url of a self-hosted node for a given network
   */
  private static _getSelfHostedUrl(networkId: NetworkId) {
    return Environment.getSelfHostedNodeUrl(networkId);
  }
}
