import { minutesAgo } from "./index";
import { EnvHelper } from "./Environment";

interface ICurrentStats {
  failedConnectionCount: number;
  lastFailedConnectionAt: number;
}

/**
 * NodeHelper used to parse which nodes are valid / invalid, working / not working
 * NodeHelper.currentRemovedNodes is Object representing invalidNodes
 * NodeHelper.logBadConnectionWithTimer logs connection stats for Nodes
 * NodeHelper.getNodesUris returns an array of valid node uris
 */
export class NodeHelper {
  static _invalidNodesKey = "invalidNodes";
  static _maxFailedConnections = 1;
  /**
   * failedConnectionsMinuteLimit is the number of minutes that _maxFailedConnections must occur within
   * for the node to be blocked.
   */
  static _failedConnectionsMinutesLimit = 15;

  // use sessionStorage so that we don't have to worry about resetting the invalidNodes list
  static _storage = window.sessionStorage;

  static currentRemovedNodes = JSON.parse(NodeHelper._storage.getItem(NodeHelper._invalidNodesKey) || "{}");
  static currentRemovedNodesURIs = Object.keys(NodeHelper.currentRemovedNodes);

  /**
   * remove the invalidNodes list entirely
   * should be used as a failsafe IF we have invalidated ALL nodes AND we have no fallbacks
   */
  static _emptyInvalidNodesList() {
    // if all nodes are removed && there are no fallbacks, then empty the list
    if (
      EnvHelper.getFallbackURIs().length === 0 &&
      Object.keys(NodeHelper.currentRemovedNodes).length === EnvHelper.getAPIUris().length
    ) {
      NodeHelper._storage.removeItem(NodeHelper._invalidNodesKey);
    }
  }

  static _updateConnectionStatsForProvider(currentStats: ICurrentStats) {
    const failedAt = new Date().getTime();
    const failedConnectionCount = currentStats.failedConnectionCount || 0;
    if (
      failedConnectionCount > 0 &&
      currentStats.lastFailedConnectionAt > minutesAgo(NodeHelper._failedConnectionsMinutesLimit)
    ) {
      // more than 0 failed connections in the last (15) minutes
      currentStats = {
        lastFailedConnectionAt: failedAt,
        failedConnectionCount: failedConnectionCount + 1,
      };
    } else {
      currentStats = {
        lastFailedConnectionAt: failedAt,
        failedConnectionCount: 1,
      };
    }
    return currentStats;
  }

  static _removeNodeFromProviders(providerKey: string, providerUrl: string) {
    // get Object of current removed Nodes
    // key = providerUrl, value = removedAt Timestamp
    let currentRemovedNodesObj = NodeHelper.currentRemovedNodes;
    if (Object.keys(currentRemovedNodesObj).includes(providerUrl)) {
      // already on the removed nodes list
    } else {
      // add to list
      currentRemovedNodesObj[providerUrl] = new Date().getTime();
      NodeHelper._storage.setItem(NodeHelper._invalidNodesKey, JSON.stringify(currentRemovedNodesObj));
      // remove connection stats for this Node
      NodeHelper._storage.removeItem(providerKey);
    }

    // will only empty if no Fallbacks are provided
    NodeHelper._emptyInvalidNodesList();
  }

  /**
   * adds a bad connection stat to NodeHelper._storage for a given node
   * if greater than `_maxFailedConnections` previous failures in last `_failedConnectionsMinuteLimit` minutes will remove node from list
   * @param provider an Ethers provider
   */
  static logBadConnectionWithTimer(providerUrl: string) {
    const providerKey: string = "-nodeHelper:" + providerUrl;

    let currentConnectionStats = JSON.parse(NodeHelper._storage.getItem(providerKey) || "{}");
    currentConnectionStats = NodeHelper._updateConnectionStatsForProvider(currentConnectionStats);

    if (currentConnectionStats.failedConnectionCount > NodeHelper._maxFailedConnections) {
      // then remove this node from our provider list for 24 hours
      NodeHelper._removeNodeFromProviders(providerKey, providerUrl);
    } else {
      NodeHelper._storage.setItem(providerKey, JSON.stringify(currentConnectionStats));
    }
  }

  /**
   * returns Array of APIURIs where NOT on invalidNodes list
   */
  static getNodesUris = () => {
    let allURIs = EnvHelper.getAPIUris();
    let invalidNodes = NodeHelper.currentRemovedNodesURIs;
    // filter invalidNodes out of allURIs
    // this allows duplicates in allURIs, removes both if invalid, & allows both if valid
    allURIs = allURIs.filter(item => !invalidNodes.includes(item));

    // return the remaining elements
    if (allURIs.length === 0) {
      // the invalidNodes list will be emptied when the user starts a new session
      // In the meantime use the fallbacks
      allURIs = EnvHelper.getFallbackURIs();
    }
    return allURIs;
  };

  /**
   * iterate through all the nodes we have with a chainId check.
   * - log the failing nodes
   * - _maxFailedConnections fails in < _failedConnectionsMinutesLimit sends the node to the invalidNodes list
   * returns an Array of working mainnet nodes
   */
  static checkAllNodesStatus = async () => {
    return await Promise.all(
      NodeHelper.getNodesUris().map(async URI => {
        let workingUrl = await NodeHelper.checkNodeStatus(URI);
        return workingUrl;
      }),
    );
  };

  /**
   * 403 errors are not caught by fetch so we check response.status, too
   * this func returns a workingURL string or false;
   */
  static checkNodeStatus = async (url: string) => {
    let liveURL;
    try {
      let resp = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        // NOTE (appleseed): are there other basic requests for other chain types (Arbitrum)???
        // https://documenter.getpostman.com/view/4117254/ethereum-json-rpc/RVu7CT5J
        // chainId works... but is net_version lighter-weight?
        // body: JSON.stringify({ method: "eth_chainId", params: [], id: 42, jsonrpc: "2.0" }),
        body: JSON.stringify({ method: "net_version", params: [], id: 67, jsonrpc: "2.0" }),
      });
      if (resp.status >= 400) {
        // probably 403 or 429 -> no more alchemy capacity
        NodeHelper.logBadConnectionWithTimer(resp.url);
        liveURL = false;
      } else {
        // this is a working node
        // TODO (appleseed) use response object to prioritize it
        liveURL = url;
      }
    } catch {
      // some other type of issue
      NodeHelper.logBadConnectionWithTimer(url);
      liveURL = false;
    }
    return liveURL;
  };
}
