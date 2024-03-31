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

  public static getNodeUrls = (networkId: NetworkId) => {
    switch (networkId) {
      case NetworkId.MAINNET:
        return ["https://rpc.tenderly.co/fork/f7571dd4-342e-457a-a83b-670b6a84e4c4"]; //TODO: revert this after testing. this is like this so we dont have to mess w/ fleek environments for fork testing
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
}
