import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { minutesAgo } from "./index";
import { EnvHelper } from "./Environment";

interface ICurrentStats {
  failedConnectionCount: number;
  lastFailedConnectionAt: number;
}

interface IInvalidNode {
  key: string;
  value: number;
}

/**
 * NodeHelper used to parse which nodes are valid / invalid, working / not working
 * NodeHelper.currentRemovedNodes is Object representing invalidNodes
 * NodeHelper.logBadConnectionWithTimer logs connection stats for Nodes
 * NodeHelper.getNodesUris returns an array of valid node uris
 */
export class NodeHelper {
  static _invalidNodesKey = "invalidNodes";

  // use sessionStorage so that we don't have to worry about resetting the invalidNodes list
  static _storage = window.sessionStorage;

  static currentRemovedNodes = JSON.parse(NodeHelper._storage.getItem(NodeHelper._invalidNodesKey) || "{}");
  static currentRemovedNodesURIs = Object.keys(NodeHelper.currentRemovedNodes);

  /**
   * remove the invalidNodes list entirely
   * should be used as a failsafe IF we have invalidated ALL nodes
   */
  static _emptyInvalidNodesList() {
    NodeHelper._storage.removeItem(NodeHelper._invalidNodesKey);
  }

  static _updateConnectionStatsForProvider(currentStats: ICurrentStats) {
    const failedAt = new Date().getTime();
    const failedConnectionCount = currentStats.failedConnectionCount || 0;
    if (failedConnectionCount > 0 && currentStats.lastFailedConnectionAt > minutesAgo(15)) {
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
    // if all nodes are removed, then empty the list
    if (Object.keys(currentRemovedNodesObj).length === EnvHelper.getAPIUris().length) {
      NodeHelper._emptyInvalidNodesList();
    }
  }

  /**
   * adds a bad connection stat to NodeHelper._storage for a given node
   * if greater than 3 previous failures in last 15 minutes will remove node from list
   * @param provider an Ethers provider
   */
  static logBadConnectionWithTimer(provider: StaticJsonRpcProvider) {
    const providerUrl: string = provider.connection.url;
    const providerKey: string = "-nodeHelper:" + providerUrl;

    let currentConnectionStats = JSON.parse(NodeHelper._storage.getItem(providerKey) || "{}");
    currentConnectionStats = NodeHelper._updateConnectionStatsForProvider(currentConnectionStats);

    if (currentConnectionStats.failedConnectionCount > 3) {
      // then remove this node from our provider list for 24 hours
      NodeHelper._removeNodeFromProviders(providerKey, providerUrl);
    } else {
      NodeHelper._storage.setItem(providerKey, JSON.stringify(currentConnectionStats));
    }
  }

  /**
   * returns Array of APIURIs where NOT on invalidNodes list
   * also removes nodes that have been invalid for > 24 hours
   */
  static getNodesUris = () => {
    let allURIs = EnvHelper.getAPIUris();
    let invalidNodes = NodeHelper.currentRemovedNodesURIs;

    // iterate through invalid & remove each from allURIs.
    invalidNodes.forEach(URI => allURIs.splice(allURIs.indexOf(URI), 1));

    // return the remaining elements
    if (allURIs.length === 0) {
      NodeHelper._emptyInvalidNodesList();
      allURIs = EnvHelper.getAPIUris();
    }
    return allURIs;
  };
}
