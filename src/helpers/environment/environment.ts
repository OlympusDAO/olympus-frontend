import { NetworkId } from "src/networkDetails";

export class Environment {
  public static env = process.env;

  private static _getVar(args: { silent?: boolean; key: string; error?: string; fallback?: string }) {
    const value = this.env[args.key] || args.fallback;

    if (!value && !args.silent) console[this.env.NODE_ENV === "development" ? "warn" : "error"](args.error);

    return value;
  }

  public static getSegmentApiKey = () =>
    this._getVar({
      silent: true,
      key: "REACT_APP_SEGMENT_API_KEY",
    });

  public static getGoogleAnalyticsApiKey = () =>
    this._getVar({
      silent: true,
      key: "REACT_APP_GOOGLE_ANALYTICS_API_KEY",
    });

  public static getInfuraApiKey = () =>
    this._getVar({
      key: "REACT_APP_INFURA_API_KEY",
      /**
       * This is the ether.js default API key
       * https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/infura-provider.ts#L17
       */
      fallback: "84842078b09946638c03157f83405213",
    });

  public static getAlchemyApiKey = () =>
    this._getVar({
      key: "REACT_APP_ALCHEMY_API_KEY",
      /**
       * This is the ether.js default API key
       * https://github.com/ethers-io/ethers.js/blob/master/packages/providers/src.ts/alchemy-provider.ts#L21
       */
      fallback: "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
    });

  public static getCovalentApiKey = () =>
    this._getVar({
      key: "REACT_APP_COVALENT_API_KEY",
      error: "Please provide an API key for Covalent (https://www.covalenthq.com) in your .env file",
    });

  public static getSelfHostedNodeUrl = (networkId: NetworkId) => {
    const network =
      networkId === NetworkId.MAINNET
        ? "ETHEREUM"
        : networkId === NetworkId.ARBITRUM
        ? "ARBITRUM"
        : networkId === NetworkId.FANTOM
        ? "FANTOM"
        : networkId === NetworkId.POLYGON
        ? "POLYGON"
        : networkId === NetworkId.AVALANCHE
        ? "AVALANCHE"
        : undefined;

    if (!network) return "";

    return this._getVar({
      silent: true,
      key: `REACT_APP_${network}_SELF_HOSTED_NODE`,
    });
  };

  /**
   * Indicates whether the give feature is enabled.
   *
   * Defaults to true. Only false when `REACT_APP_GIVE_ENABLED` === "false"
   */
  public static isGiveEnabled() {
    const isDisabled = this.env.REACT_APP_GIVE_ENABLED === "false";

    return !isDisabled;
  }

  /**
   * Indicates whether mockSohm is enabled.
   * This is needed for easily manually testing rebases for Give on testnet
   *
   * Defaults to false. Only true when the `mock_sohm` query param is present or `REACT_APP_MOCK_SOHM_ENABLED` === "true"
   */
  public static isMockSohmEnabled(url: string) {
    const isQueryParamActive = url.includes("mock_sohm");
    const isEnvTrue = this.env.REACT_APP_MOCK_SOHM_ENABLED === "true";

    return isQueryParamActive || isEnvTrue;
  }
}
