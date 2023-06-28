import { NetworkId } from "src/networkDetails";
export class Environment {
  public static env = import.meta.env;

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

  public static getWalletConnectProjectId = () =>
    this._get({
      first: true,
      key: "VITE_WALLETCONNECT_PROJECT_ID",
      err: "Please provide a VITE_WALLETCONNECT_PROJECT_ID in your .env file",
    });

  public static getGoogleAnalyticsApiKey = () =>
    this._get({
      first: true,
      key: "VITE_GOOGLE_ANALYTICS_API_KEY",
      err: "Please provide an Google Analytics API key in your .env file",
    });

  public static getGA4ApiKey = () =>
    this._get({
      first: true,
      key: "VITE_GA_4_API_KEY",
      err: "Please provide an Google Analytics 4 API key in your .env file",
    });

  public static getCovalentApiKey = () =>
    this._get({
      first: true,
      key: "VITE_COVALENT_API_KEY",
      err: "Please provide an API key for Covalent (https://www.covalenthq.com) in your .env file",
    });

  public static getZapperApiKey = () =>
    this._get({
      first: true,
      key: "VITE_ZAPPER_API",
      // NOTE: default Zapper API key. Won't work in production with any real volume of usage.
      fallback: "96e0cc51-a62e-42ca-acee-910ea7d2a241",
    });

  public static getWundergraphNodeUrl = (): string | undefined =>
    this._get({
      first: true,
      key: "VITE_WG_PUBLIC_NODE_URL",
    });

  /**
   * a feature flag for denoting when we are on the staging server
   * @returns {string} true or false
   */
  public static getStagingFlag = (): string =>
    this._get({
      first: true,
      key: "VITE_STAGING_ENV",
      fallback: "false",
    });

  public static getArchiveNodeUrl = (networkId: number) => {
    switch (networkId) {
      case NetworkId.MAINNET:
        return this._get({
          key: `VITE_ETHEREUM_ARCHIVE_NODE_URL`,
          err: "Please provide a VITE_ETHEREUM_ARCHIVE_NODE_URL for governance to function properly",
        });
      case NetworkId.TESTNET_GOERLI:
        return this._get({
          key: `VITE_ETHEREUM_TESTNET_ARCHIVE_NODE_URL`,
          err: "Please provide a VITE_ETHEREUM_TESTNET_ARCHIVE_NODE_URL for governance to function properly",
        });
      case NetworkId.ARBITRUM_GOERLI:
        return this._get({
          key: `VITE_ARBITRUM_GOERLI_ARCHIVE_NODE_URL`,
          err: "Please provide a VITE_ARBITRUM_GOERLI_ARCHIVE_NODE_URL for governance to function properly",
        });
      case NetworkId.ARBITRUM:
        return this._get({
          key: `VITE_ARBITRUM_ARCHIVE_NODE_URL`,
          err: "Please provide a VITE_ARBITRUM_ARCHIVE_NODE_URL for governance to function properly",
        });
    }
  };

  public static getNodeUrls = (networkId: NetworkId) => {
    switch (networkId) {
      case NetworkId.MAINNET:
        return this._get({
          key: `VITE_ETHEREUM_NODE_URL`,
          fallback: "https://rpc.ankr.com/eth",
        });
      case NetworkId.TESTNET_GOERLI:
        return this._get({
          key: `VITE_ETHEREUM_TESTNET_NODE_URL`,
          fallback: "https://rpc.ankr.com/eth_goerli",
        });
      case NetworkId.ARBITRUM:
        return this._get({
          key: `VITE_ARBITRUM_NODE_URL`,
          fallback: "https://rpc.ankr.com/arbitrum",
        });
      case NetworkId.ARBITRUM_TESTNET:
        return this._get({
          key: `VITE_ARBITRUM_TESTNET_NODE_URL`,
          fallback: "https://arb-rinkeby.g.alchemy.com/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
        });
      case NetworkId.ARBITRUM_GOERLI:
        return this._get({
          key: `VITE_ARBITRUM_GOERLI_NODE_URL`,
          fallback: "https://endpoints.omniatech.io/v1/arbitrum/goerli/public",
        });
      case NetworkId.AVALANCHE:
        return this._get({
          key: `VITE_AVALANCHE_NODE_URL`,
          fallback: "https://rpc.ankr.com/avalanche",
        });
      case NetworkId.AVALANCHE_TESTNET:
        return this._get({
          key: `VITE_AVALANCHE_TESTNET_NODE_URL`,
          fallback: "https://rpc.ankr.com/avalanche_fuji",
        });
      case NetworkId.POLYGON:
        return this._get({
          key: `VITE_POLYGON_NODE_URL`,
          fallback: "https://rpc.ankr.com/polygon",
        });
      case NetworkId.POLYGON_TESTNET:
        return this._get({
          key: `VITE_POLYGON_TESTNET_NODE_URL`,
          fallback: "https://rpc.ankr.com/polygon_mumbai",
        });
      case NetworkId.FANTOM:
        return this._get({
          key: `VITE_FANTOM_NODE_URL`,
          fallback: "https://rpc.ankr.com/fantom/",
        });
      case NetworkId.FANTOM_TESTNET:
        return this._get({
          key: `VITE_FANTOM_TESTNET_NODE_URL`,
          fallback: "https://rpc.ankr.com/fantom_testnet",
        });
      case NetworkId.OPTIMISM:
        return this._get({
          key: `VITE_OPTIMISM_NODE_URL`,
          fallback: "https://rpc.ankr.com/optimism",
        });
      case NetworkId.OPTIMISM_TESTNET:
        return this._get({
          key: `VITE_OPTIMISM_TESTNET_NODE_URL`,
          fallback: "https://rpc.ankr.com/optimism_testnet",
        });
      case NetworkId.BOBA:
        return this._get({
          key: `VITE_BOBA_NODE_URL`,
          fallback: "https://mainnet.boba.network	",
        });
      case NetworkId.BOBA_TESTNET:
        return this._get({
          key: `VITE_BOBA_TESTNET_NODE_URL`,
          fallback: "https://rinkeby.boba.network/",
        });
    }
  };

  public static isWalletNewsEnabled() {
    return this.env.VITE_DISABLE_NEWS !== "true";
  }
}
