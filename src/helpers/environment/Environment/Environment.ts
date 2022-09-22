import { NetworkId } from "src/networkDetails";

export class Environment {
  public static env = process.env;

  private static _get(args: { key: string; err?: string; first: true; fallback: string }): string;
  private static _get(args: { key: string; err?: string; first?: never; fallback: string }): string[];
  private static _get(args: { key: string; err?: string; first: true; fallback?: never }): string | undefined;
  private static _get(args: { key: string; err?: string; first?: never; fallback?: never }): string[] | undefined;
  private static _get(args: { key: string; err?: string; first?: boolean; fallback?: string }) {
    const value = this.env[args.key] || args.fallback;

    if (!value) console.warn(args.err);

    if (value === undefined) return value;

    return args.first ? value : value.split(" ");
  }

  public static getGoogleAnalyticsApiKey = () =>
    this._get({
      first: true,
      key: "REACT_APP_GOOGLE_ANALYTICS_API_KEY",
      err: "Please provide an Google Analytics API key in your .env file",
    });

  public static getGA4ApiKey = () =>
    this._get({
      first: true,
      key: "REACT_APP_GA_4_API_KEY",
      err: "Please provide an Google Analytics 4 API key in your .env file",
    });

  public static getCovalentApiKey = () =>
    this._get({
      first: true,
      key: "REACT_APP_COVALENT_API_KEY",
      err: "Please provide an API key for Covalent (https://www.covalenthq.com) in your .env file",
    });

  public static getZapperApiKey = () =>
    this._get({
      first: true,
      key: "REACT_APP_ZAPPER_API",
      // NOTE: default Zapper API key. Won't work in production with any real volume of usage.
      fallback: "96e0cc51-a62e-42ca-acee-910ea7d2a241",
    });

  /**
   * a feature flag for denoting when we are on the staging server
   * @returns {string} true or false
   */
  public static getStagingFlag = (): string =>
    this._get({
      first: true,
      key: "REACT_APP_STAGING_ENV",
      fallback: "false",
    });

  public static getNodeUrls = (networkId: NetworkId) => {
    switch (networkId) {
      case NetworkId.MAINNET:
        return this._get({
          key: `REACT_APP_ETHEREUM_NODE_URL`,
          fallback: "https://eth-mainnet.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
        });
      case NetworkId.TESTNET_GOERLI:
        return this._get({
          key: `REACT_APP_ETHEREUM_TESTNET_NODE_URL`,
          fallback: "https://eth-goerli.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
        });
      case NetworkId.ARBITRUM:
        return this._get({
          key: `REACT_APP_ARBITRUM_NODE_URL`,
          fallback: "https://arb-mainnet.g.alchemy.com/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
        });
      case NetworkId.ARBITRUM_TESTNET:
        return this._get({
          key: `REACT_APP_ARBITRUM_TESTNET_NODE_URL`,
          fallback: "https://arb-rinkeby.g.alchemy.com/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
        });
      case NetworkId.AVALANCHE:
        return this._get({
          key: `REACT_APP_AVALANCHE_NODE_URL`,
          fallback: "https://api.avax.network/ext/bc/C/rpc",
        });
      case NetworkId.AVALANCHE_TESTNET:
        return this._get({
          key: `REACT_APP_AVALANCHE_TESTNET_NODE_URL`,
          fallback: "https://api.avax-test.network/ext/bc/C/rpc",
        });
      case NetworkId.POLYGON:
        return this._get({
          key: `REACT_APP_POLYGON_NODE_URL`,
          fallback: "https://polygon-mainnet.g.alchemy.com/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
        });
      case NetworkId.POLYGON_TESTNET:
        return this._get({
          key: `REACT_APP_POLYGON_TESTNET_NODE_URL`,
          fallback: "https://polygon-mumbai.g.alchemy.com/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
        });
      case NetworkId.FANTOM:
        return this._get({
          key: `REACT_APP_FANTOM_NODE_URL`,
          fallback: "https://rpc.ftm.tools/",
        });
      case NetworkId.FANTOM_TESTNET:
        return this._get({
          key: `REACT_APP_FANTOM_TESTNET_NODE_URL`,
          fallback: "https://rpc.testnet.fantom.network/",
        });
      case NetworkId.OPTIMISM:
        return this._get({
          key: `REACT_APP_OPTIMISM_NODE_URL`,
          fallback: "https://mainnet.optimism.io/",
        });
      case NetworkId.OPTIMISM_TESTNET:
        return this._get({
          key: `REACT_APP_OPTIMISM_TESTNET_NODE_URL`,
          fallback: "https://kovan.optimism.io/",
        });
      case NetworkId.BOBA:
        return this._get({
          key: `REACT_APP_BOBA_NODE_URL`,
          fallback: "https://mainnet.boba.network	",
        });
      case NetworkId.BOBA_TESTNET:
        return this._get({
          key: `REACT_APP_BOBA_TESTNET_NODE_URL`,
          fallback: "https://rinkeby.boba.network/",
        });
    }
  };

  public static isWalletNewsEnabled() {
    return this.env.REACT_APP_DISABLE_NEWS !== "true";
  }
}
