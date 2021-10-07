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
  static alchemyEthereumTestnetURI = `https://eth-rinkeby.alchemyapi.io/v2/${EnvHelper.env.REACT_APP_ETHEREUM_TESTNET_ALCHEMY}`;
  static alchemyArbitrumTestnetURI = `https://arb-rinkeby.g.alchemy.com/v2/${EnvHelper.env.REACT_APP_ARBITRUM_TESTNET_ALCHEMY}`;

  static whitespaceRegex = /\s+/;

  /**
   * Returns env contingent segment api key
   * @returns segment
   */
  static getSegmentKey() {
    return EnvHelper.env.REACT_APP_SEGMENT_API_KEY;
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
  static getAlchemyAPIKeyList(chainId: number): string[] {
    let ALCHEMY_ID_LIST: string[] = [];
    let uriPath: string;

    // If in production, split the provided API keys on whitespace. Otherwise use default.
    switch (chainId) {
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
    }

    return ALCHEMY_ID_LIST.map(alchemyID => uriPath + alchemyID);
  }

  /**
   * NOTE(zx): Want to move away from infura. Will probably remove these.
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
   * @returns {Array} Array of websocket addresses or empty set
   */
  static getSelfHostedSockets(chainId: number) {
    let WS_LIST: string[] = [];
    switch (chainId) {
      case 1:
        if (
          EnvHelper.env.REACT_APP_ETHEREUM_SELF_HOSTED_WEBSOCKETS &&
          EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_ETHEREUM_SELF_HOSTED_WEBSOCKETS)
        ) {
          WS_LIST = EnvHelper.env.REACT_APP_ETHEREUM_SELF_HOSTED_WEBSOCKETS.split(
            new RegExp(EnvHelper.whitespaceRegex),
          );
        }
        break;
      case 42161:
        if (
          EnvHelper.env.REACT_APP_ARBITRUM_SELF_HOSTED_WEBSOCKETS &&
          EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_ARBITRUM_SELF_HOSTED_WEBSOCKETS)
        ) {
          WS_LIST = EnvHelper.env.REACT_APP_ARBITRUM_SELF_HOSTED_WEBSOCKETS.split(
            new RegExp(EnvHelper.whitespaceRegex),
          );
        }
        break;
    }
    return WS_LIST;
  }

  /**
   * in development will always return the `ethers` community key url even if .env is blank
   * in prod if .env is blank API connections will fail
   * @returns array of API urls
   */
  static getAPIUris(chainId: number) {
    // Debug log
    // console.log("uris", EnvHelper.getAlchemyAPIKeyList(), EnvHelper.getSelfHostedSockets());
    const ALL_URIs = [...EnvHelper.getAlchemyAPIKeyList(chainId), ...EnvHelper.getSelfHostedSockets(chainId)];
    if (ALL_URIs.length === 0) console.error("API keys must be set in the .env");
    return ALL_URIs;
  }
}
