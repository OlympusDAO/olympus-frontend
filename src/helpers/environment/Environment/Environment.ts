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

  public static getSubgraphApiKey = (): string | undefined =>
    this._get({
      first: true,
      key: "VITE_SUBGRAPH_API_KEY",
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

  public static getGovernanceStartBlock = (): number =>
    parseInt(
      this._get({
        first: true,
        key: "VITE_GOVERNANCE_START_BLOCK",
        fallback: "0",
      }),
    );

  public static getEmissionsManagerEnabled = (): boolean =>
    this._get({
      first: true,
      key: "VITE_EMISSIONS_MANAGER_ENABLED",
      fallback: "false",
    }) === "true";

  public static getRbsDisabled = (): boolean =>
    this._get({
      first: true,
      key: "VITE_RBS_DISABLED",
      fallback: "false",
    }) === "true";

  public static getGovernanceSubgraphUrl = (): string => {
    const subgraphApiKey = this.getSubgraphApiKey();
    return this._get({
      first: true,
      key: "VITE_GOVERNANCE_SUBGRAPH_URL",
      fallback: `https://gateway.thegraph.com/api/${subgraphApiKey}/subgraphs/id/AQoLCXebY1Ga7DrqVaVQ85KMwS7iFof73tv9XMVGRtyJ`,
    });
  };

  public static getNodeUrls = (networkId: NetworkId) => {
    switch (networkId) {
      case NetworkId.MAINNET:
        return this._get({
          key: `VITE_ETHEREUM_NODE_URL`,
          fallback: "https://ethereum-rpc.publicnode.com",
        });
      case NetworkId.TESTNET_GOERLI:
        return this._get({
          key: `VITE_ETHEREUM_TESTNET_NODE_URL`,
          fallback: "https://rpc.ankr.com/eth_goerli",
        });
      case NetworkId.ARBITRUM:
        return this._get({
          key: `VITE_ARBITRUM_NODE_URL`,
          fallback: "https://arbitrum.drpc.org",
        });
      case NetworkId.ARBITRUM_GOERLI:
        return this._get({
          key: `VITE_ARBITRUM_GOERLI_NODE_URL`,
          fallback: "https://endpoints.omniatech.io/v1/arbitrum/goerli/public",
        });
      case NetworkId.AVALANCHE:
        return this._get({
          key: `VITE_AVALANCHE_NODE_URL`,
          fallback: "https://avalanche.drpc.org",
        });
      case NetworkId.AVALANCHE_TESTNET:
        return this._get({
          key: `VITE_AVALANCHE_TESTNET_NODE_URL`,
          fallback: "https://rpc.ankr.com/avalanche_fuji",
        });
      case NetworkId.POLYGON:
        return this._get({
          key: `VITE_POLYGON_NODE_URL`,
          fallback: "https://polygon.drpc.org",
        });
      case NetworkId.POLYGON_TESTNET:
        return this._get({
          key: `VITE_POLYGON_TESTNET_NODE_URL`,
          fallback: "https://rpc.ankr.com/polygon_mumbai",
        });
      case NetworkId.FANTOM:
        return this._get({
          key: `VITE_FANTOM_NODE_URL`,
          fallback: "https://fantom.drpc.org",
        });
      case NetworkId.FANTOM_TESTNET:
        return this._get({
          key: `VITE_FANTOM_TESTNET_NODE_URL`,
          fallback: "https://rpc.ankr.com/fantom_testnet",
        });
      case NetworkId.OPTIMISM:
        return this._get({
          key: `VITE_OPTIMISM_NODE_URL`,
          fallback: "https://optimism.drpc.org",
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
      case NetworkId.BASE:
        return this._get({
          key: `VITE_BASE_NODE_URL`,
          fallback: "https://base.drpc.org",
        });
      case NetworkId.BASE_TESTNET:
        return this._get({
          key: `VITE_BASE_TESTNET_NODE_URL`,
          fallback: "https://sepolia.base.org",
        });
      case NetworkId.HOLESKY:
        return this._get({
          key: `VITE_HOLESKY_NODE_URL`,
          fallback: "https://ethereum-holesky.publicnode.com",
        });
      case NetworkId.BERACHAIN:
        return this._get({
          key: `VITE_BERACHAIN_NODE_URL`,
          fallback: "https://rpc.berachain.com",
        });
      case NetworkId.BERACHAIN_TESTNET:
        return this._get({
          key: `VITE_BERACHAIN_TESTNET_NODE_URL`,
          fallback: "https://bartio.rpc.berachain.com",
        });
    }
  };
  public static getArchiveNodeUrls = (networkId: NetworkId) => {
    switch (networkId) {
      case NetworkId.MAINNET:
        return this._get({
          key: `VITE_ETHEREUM_ARCHIVE_NODE_URL`,
          fallback: "https://ethereum-rpc.publicnode.com",
        });
      default:
        return this._get({
          key: `VITE_ETHEREUM_ARCHIVE_NODE_URL`,
          fallback: "https://ethereum-rpc.publicnode.com",
        });
    }
  };
}
