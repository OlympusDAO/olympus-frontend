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
   * @returns Array of Alchemy API Keys
   */
  static getAlchemyAPIKeyList() {
    var ALCHEMY_ID_LIST: any[];
    if (EnvHelper.env.NODE_ENV !== "development" && EnvHelper.env.REACT_APP_ALCHEMY_IDS) {
      ALCHEMY_ID_LIST = EnvHelper.env.REACT_APP_ALCHEMY_IDS.split(EnvHelper.whitespaceRegex);
    } else {
      // this is the ethers common API key, suitable for testing, not prod
      ALCHEMY_ID_LIST = ["_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC"];
    }
    return ALCHEMY_ID_LIST;
  }

  /**
   * @returns {Array} Array of Infura API Ids
   */
  static getInfuraIdList() {
    var INFURA_ID_LIST: any[];
    if (EnvHelper.env.REACT_APP_INFURA_IDS) {
      INFURA_ID_LIST = EnvHelper.env.REACT_APP_INFURA_IDS.split(new RegExp(EnvHelper.whitespaceRegex));
    } else {
      INFURA_ID_LIST = [];
    }
    return INFURA_ID_LIST;
  }

  /**
   * @returns {Array} Array of websocket addresses
   */
  static getSelfHostedSockets() {
    var WS_LIST: any[];
    if (EnvHelper.env.REACT_APP_SELF_HOSTED_WEBSOCKETS) {
      WS_LIST = EnvHelper.env.REACT_APP_SELF_HOSTED_WEBSOCKETS.split(new RegExp(EnvHelper.whitespaceRegex));
    } else {
      WS_LIST = [];
    }
    return WS_LIST;
  }
}
