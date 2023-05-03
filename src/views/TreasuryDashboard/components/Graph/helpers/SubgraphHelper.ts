/**
 * Returns a URL to the subgraph query explorer for the given query document and subgraph URL.
 *
 * NOTE: if the subgraph is deployed on the decentralized network, the URL will be the playground interface
 * for the subgraph. There is currently no mechanism to pass a query to that interface.
 *
 * TODO: add support for blockchain-specific decentralized network subgraph URLs
 */
export const getSubgraphQueryExplorerUrl = (queryDocument: string, subgraphUrl: string): string => {
  try {
    const url = new URL(subgraphUrl);
    if (["gateway.thegraph.com"].includes(url.hostname)) {
      return `https://thegraph.com/explorer/subgraphs/DTcDcUSBRJjz9NeoK5VbXCVzYbRTyuBwdPUqMi8x32pY?view=Playground&chain=mainnet`;
    }
  } catch {
    console.log("not a valid subgraphUrl");
  }

  return `${subgraphUrl}/graphql?query=${encodeURIComponent(queryDocument)}`;
};
