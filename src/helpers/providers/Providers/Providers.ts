import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { NetworkId } from "src/networkDetails";

export class Providers {
  private static _providerCache = {} as Record<NetworkId, StaticJsonRpcProvider>;
  private static _archiveProviderCache = {} as Record<NetworkId, StaticJsonRpcProvider>;

  /**
   * Returns a provider url for a given network
   */
  public static getProviderUrl(networkId: NetworkId) {
    const [url] = Environment.getNodeUrls(networkId);

    return url;
  }
  public static getArchiveProviderUrl(networkId: NetworkId) {
    const [url] = Environment.getArchiveNodeUrls(networkId);

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

  public static getArchiveStaticProvider(networkId: NetworkId) {
    if (!this._archiveProviderCache[networkId])
      this._archiveProviderCache[networkId] = new StaticJsonRpcProvider(this.getArchiveProviderUrl(networkId));

    return this._archiveProviderCache[networkId];
  }
}
