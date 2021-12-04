import { NetworkID } from "src/lib/Bond";

/**
 * Access `process.env` in an environment helper
 * Usage: `EnvHelper.env`
 * - Other static methods can be added as needed per
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
 */
export class EnvHelper {
  /**
   * @returns `process.env`
   */
  static env = process.env;
  // static alchemyEthereumTestnetURI = `https://eth-rinkeby.alchemyapi.io/v2/${EnvHelper.env.REACT_APP_ETHEREUM_TESTNET_ALCHEMY}`;
  static alchemyArbitrumTestnetURI = `https://arb-rinkeby.g.alchemy.com/v2/${EnvHelper.env.REACT_APP_ARBITRUM_TESTNET_ALCHEMY}`;
  static alchemyAvalancheTestnetURI = ``;

  static whitespaceRegex = /\s+/;

  /**
   * Returns env contingent segment api key
   * @returns segment
   */
  static getSegmentKey() {
    return EnvHelper.env.REACT_APP_SEGMENT_API_KEY;
  }

  static getGaKey() {
    return EnvHelper.env.REACT_APP_GA_API_KEY;
  }

  static isNotEmpty(envVariable: string) {
    if (envVariable.length > 10) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * in development environment will return the `ethers` community api key so that devs don't need to add elements to their .env
   * @returns Array of Alchemy API URIs or empty set
   */
  static getAlchemyAPIKeyList(networkId: number): string[] {
    let ALCHEMY_ID_LIST: string[] = [];
    let uriPath: string;

    // If in production, split the provided API keys on whitespace. Otherwise use default.
    switch (networkId) {
      case 1:
        if (
          EnvHelper.env.NODE_ENV !== "development" &&
          EnvHelper.env.REACT_APP_ETHEREUM_ALCHEMY_IDS &&
          EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_ETHEREUM_ALCHEMY_IDS)
        ) {
          ALCHEMY_ID_LIST = EnvHelper.env.REACT_APP_ETHEREUM_ALCHEMY_IDS.split(EnvHelper.whitespaceRegex);
        } else {
          ALCHEMY_ID_LIST = ["_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC"];
        }
        uriPath = "https://eth-mainnet.alchemyapi.io/v2/";
        break;
      case 4:
        if (
          EnvHelper.env.REACT_APP_ETHEREUM_TESTNET_ALCHEMY &&
          EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_ETHEREUM_TESTNET_ALCHEMY)
        ) {
          ALCHEMY_ID_LIST = EnvHelper.env.REACT_APP_ETHEREUM_TESTNET_ALCHEMY.split(EnvHelper.whitespaceRegex);
        } else {
          ALCHEMY_ID_LIST = ["aF5TH9E9RGZwaAUdUd90BNsrVkDDoeaO"];
        }
        uriPath = "https://eth-rinkeby.alchemyapi.io/v2/";
        break;
      case 42161:
        if (
          EnvHelper.env.NODE_ENV !== "development" &&
          EnvHelper.env.REACT_APP_ARBITRUM_ALCHEMY_IDS &&
          EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_ARBITRUM_ALCHEMY_IDS)
        ) {
          ALCHEMY_ID_LIST = EnvHelper.env.REACT_APP_ARBITRUM_ALCHEMY_IDS.split(EnvHelper.whitespaceRegex);
        } else {
          ALCHEMY_ID_LIST = ["7Fz2U-NiLphizjlRkJzWtK5jef-5rX-G"];
        }
        uriPath = "https://arb-mainnet.alchemyapi.io/v2/";
        break;
      case 43114:
        if (
          EnvHelper.env.NODE_ENV !== "development" &&
          EnvHelper.env.REACT_APP_AVALANCHE_ALCHEMY_IDS &&
          EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_AVALANCHE_ALCHEMY_IDS)
        ) {
          ALCHEMY_ID_LIST = EnvHelper.env.REACT_APP_AVALANCHE_ALCHEMY_IDS.split(EnvHelper.whitespaceRegex);
        } else {
          ALCHEMY_ID_LIST = [];
        }
        uriPath = "https://api.avax.network/ext/bc/C/rpc";
        break;
    }

    return ALCHEMY_ID_LIST.map(alchemyID => uriPath + alchemyID);
  }

  /**
   * NOTE(appleseed): Infura IDs are only used as Fallbacks & are not Mandatory
   * @returns {Array} Array of Infura API Ids
   */
  static getInfuraIdList() {
    let INFURA_ID_LIST: string[];

    // split the provided API keys on whitespace
    if (EnvHelper.env.REACT_APP_INFURA_IDS && EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_INFURA_IDS)) {
      INFURA_ID_LIST = EnvHelper.env.REACT_APP_INFURA_IDS.split(new RegExp(EnvHelper.whitespaceRegex));
    } else {
      INFURA_ID_LIST = [];
    }

    // now add the uri path
    if (INFURA_ID_LIST.length > 0) {
      INFURA_ID_LIST = INFURA_ID_LIST.map(infuraID => `https://mainnet.infura.io/v3/${infuraID}`);
    } else {
      INFURA_ID_LIST = [];
    }
    return INFURA_ID_LIST;
  }

  /**
   * @returns {Array} Array of node url addresses or empty set
   * node url addresses can be whitespace-separated string of "https" addresses
   * - functionality for Websocket addresses has been deprecated due to issues with WalletConnect
   *     - WalletConnect Issue: https://github.com/WalletConnect/walletconnect-monorepo/issues/193
   */
  static getSelfHostedNode(networkId: number) {
    let URI_LIST: string[] = [];
    switch (networkId) {
      case 1:
        if (
          EnvHelper.env.REACT_APP_ETHEREUM_SELF_HOSTED_NODE &&
          EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_ETHEREUM_SELF_HOSTED_NODE)
        ) {
          URI_LIST = EnvHelper.env.REACT_APP_ETHEREUM_SELF_HOSTED_NODE.split(new RegExp(EnvHelper.whitespaceRegex));
        }
        break;
      case 42161:
        if (
          EnvHelper.env.REACT_APP_ARBITRUM_SELF_HOSTED_NODE &&
          EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_ARBITRUM_SELF_HOSTED_NODE)
        ) {
          URI_LIST = EnvHelper.env.REACT_APP_ARBITRUM_SELF_HOSTED_NODE.split(new RegExp(EnvHelper.whitespaceRegex));
        }
        break;
      case 43114:
        if (
          EnvHelper.env.REACT_APP_AVALANCHE_SELF_HOSTED_NODE &&
          EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_AVALANCHE_SELF_HOSTED_NODE)
        ) {
          URI_LIST = EnvHelper.env.REACT_APP_AVALANCHE_SELF_HOSTED_NODE.split(new RegExp(EnvHelper.whitespaceRegex));
        }
        break;
    }
    return URI_LIST;
  }

  /**
   * in development will always return the `ethers` community key url even if .env is blank
   * in prod if .env is blank API connections will fail
   * @returns array of API urls
   */
  static getAPIUris(networkId: number) {
    let ALL_URIs = EnvHelper.getSelfHostedNode(networkId);
    // Debug log
    // console.log("uris", EnvHelper.getAlchemyAPIKeyList(), EnvHelper.getSelfHostedSockets());
    // ALL_URIs = [...EnvHelper.getAlchemyAPIKeyList(networkId), ...EnvHelper.getSelfHostedNode(networkId)];
    if (ALL_URIs.length === 0) {
      console.warn("API keys must be set in the .env, reverting to fallbacks");
      ALL_URIs = EnvHelper.getFallbackURIs(networkId);
    }
    return ALL_URIs;
  }

  static getFallbackURIs(networkId: number) {
    const ALL_URIs = [...EnvHelper.getAlchemyAPIKeyList(networkId), ...EnvHelper.getInfuraIdList()];
    return ALL_URIs;
  }

  static getZapperAPIKey() {
    // EnvHelper.env.REACT_APP_ZAPPER_API
    let apiKey = EnvHelper.env.REACT_APP_ZAPPER_API;
    if (!apiKey) {
      console.warn("zaps won't work without REACT_APP_ZAPPER_API key");
    }
    return apiKey;
  }

  static getZapperPoolAddress() {
    // EnvHelper.env.REACT_APP_ZAPPER_POOL
    let zapPool = EnvHelper.env.REACT_APP_ZAPPER_POOL;
    if (!zapPool) {
      console.warn("zaps won't work without REACT_APP_ZAPPER_POOL address");
    }
    return zapPool;
  }
}
