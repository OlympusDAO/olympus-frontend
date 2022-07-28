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
export const getSubgraphUrl = (subgraphId?: string) => {
  // If the "staging" parameter is specified, use the staging subgraph
  if (subgraphId) {
    console.info("Using subgraph with id " + subgraphId);
    return SUBGRAPH_URL_STAGING_STUB + subgraphId;
  } else {
    console.info("Using production subgraph");
    return SUBGRAPH_URL;
  }
};

export const EPOCH_INTERVAL = 2200;

export * from "./networkDetails";
