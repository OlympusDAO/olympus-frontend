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
  static alchemyTestnetURI = `https://eth-rinkeby.alchemyapi.io/v2/${EnvHelper.env.REACT_APP_TESTNET_ALCHEMY}`;
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
  static getAlchemyAPIKeyList() {
    let ALCHEMY_ID_LIST: string[];

    // split the provided API keys on whitespace
    if (EnvHelper.env.REACT_APP_ALCHEMY_IDS && EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_ALCHEMY_IDS)) {
      ALCHEMY_ID_LIST = EnvHelper.env.REACT_APP_ALCHEMY_IDS.split(EnvHelper.whitespaceRegex);
    } else {
      ALCHEMY_ID_LIST = [];
    }

    // now add the uri path
    if (ALCHEMY_ID_LIST.length > 0) {
      ALCHEMY_ID_LIST = ALCHEMY_ID_LIST.map(alchemyID => `https://eth-mainnet.alchemyapi.io/v2/${alchemyID}`);
    } else {
      ALCHEMY_ID_LIST = [];
    }
    return ALCHEMY_ID_LIST;
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
  static getSelfHostedNode() {
    let URI_LIST: string[];
    if (EnvHelper.env.REACT_APP_SELF_HOSTED_NODE && EnvHelper.isNotEmpty(EnvHelper.env.REACT_APP_SELF_HOSTED_NODE)) {
      URI_LIST = EnvHelper.env.REACT_APP_SELF_HOSTED_NODE.split(new RegExp(EnvHelper.whitespaceRegex));
    } else {
      URI_LIST = [];
    }
    return URI_LIST;
  }

  /**
   * in development will always return the `ethers` community key url even if .env is blank
   * in prod if .env is blank API connections will fail
   * @returns array of API urls
   */
  static getAPIUris() {
    let ALL_URIs = EnvHelper.getSelfHostedNode();
    if (EnvHelper.env.NODE_ENV === "development" && ALL_URIs.length === 0) {
      // push in the common ethers key in development
      ALL_URIs.push("https://eth-mainnet.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC");
    }
    if (ALL_URIs.length === 0) console.error("API keys must be set in the .env");
    return ALL_URIs;
  }

  static getFallbackURIs() {
    const ALL_URIs = [...EnvHelper.getAlchemyAPIKeyList(), ...EnvHelper.getInfuraIdList()];
    return ALL_URIs;
  }

  static getGeoapifyAPIKey() {
    var apiKey = EnvHelper.env.REACT_APP_GEOAPIFY_API_KEY;
    if (!apiKey) {
      console.warn("Missing REACT_APP_GEOAPIFY_API_KEY environment variable");
      return null;
    }

    return apiKey;
  }
}
