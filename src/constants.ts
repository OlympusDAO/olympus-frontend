export const SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/olympusdao/olympus-protocol-metrics";
export const SUBGRAPH_URL_STAGING_STUB = "https://api.thegraph.com/subgraphs/id/";

/**
 * Returns the subgraph URL
 *
 * By default, this is the production URL, defined by {SUBGRAPH_URL}.
 *
 * If the `subgraphId` parameter is specified in the URL, that will be used.
 *
 * e.g. http://localhost:3000/#/dashboard?subgraphId=foobar would cause the
 * subgraph with id to be used.
 *
 * @returns
 */
export const getSubgraphUrl = () => {
  /**
   * window.location.search (where the query parameters normally are) can't be used,
   * as the "#" in the URL causes everything to be included in window.location.hash.
   */
  const source = window.location.hash.split("?subgraphId=");
  const subgraphId = source.length > 1 && source[1] ? source[1] : null;

  // If the "staging" parameter is specified, use the staging subgraph
  if (subgraphId) {
    console.info("Using subgraph with id " + subgraphId);
    return SUBGRAPH_URL_STAGING_STUB + subgraphId;
  } else {
    return SUBGRAPH_URL;
  }
};

export const EPOCH_INTERVAL = 2200;

export * from "./networkDetails";
