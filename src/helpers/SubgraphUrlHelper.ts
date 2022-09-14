const SUBGRAPH_URL_ETHEREUM = "https://api.thegraph.com/subgraphs/id/QmVxcAWUBy32Xepsps45V3igRHoMXyAJECs6c8ZQZnZKU8";
const SUBGRAPH_URL_ARBITRUM = "https://api.thegraph.com/subgraphs/name/0xjem/protocol-metrics-test-arbitrum";
const SUBGRAPH_URL_FANTOM = "https://api.thegraph.com/subgraphs/name/0xjem/protocol-metrics-test-fantom";
const SUBGRAPH_URL_POLYGON = "https://api.thegraph.com/subgraphs/name/0xjem/protocol-metrics-test-polygon";

const SUBGRAPH_URL_STAGING_STUB = "https://api.thegraph.com/subgraphs/id/";

const PARAM_SUBGRAPH = "subgraphId";
export enum BLOCKCHAINS {
  Arbitrum = "Arbitrum",
  Ethereum = "Ethereum",
  Fantom = "Fantom",
  Polygon = "Polygon",
}

export type SUBGRAPH_URLS = Record<BLOCKCHAINS, string>;

const BLOCKCHAIN_SUBGRAPH_URLS: SUBGRAPH_URLS = {
  Arbitrum: SUBGRAPH_URL_ARBITRUM,
  Ethereum: SUBGRAPH_URL_ETHEREUM,
  Fantom: SUBGRAPH_URL_FANTOM,
  Polygon: SUBGRAPH_URL_POLYGON,
};

/**
 * Obtains the value of the subgraphId parameter using window.location
 *
 * useSearchParams was previously used, but it was asynchronous and led to
 * data being fetched from the standard subgraph URL before the subgraphId
 * parameter was resolved.
 */
export const getSubgraphIdForBlockchain = (blockchain: BLOCKCHAINS): string | undefined => {
  const source = window.location.hash.split(`${PARAM_SUBGRAPH}${blockchain}=`);
  return source.length > 1 && source[1] ? source[1].split("&")[0] : undefined;
};

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
export const getSubgraphUrlForBlockchain = (blockchain: BLOCKCHAINS, subgraphId?: string) => {
  if (subgraphId) {
    console.info("Using subgraph with id " + subgraphId);
    return SUBGRAPH_URL_STAGING_STUB + subgraphId;
  } else {
    console.info(`Using production subgraph for blockchain ${blockchain}`);
    return BLOCKCHAIN_SUBGRAPH_URLS[blockchain];
  }
};

/**
 * Returns an object containing blockchain names and the corresponding subgraph URL.
 *
 * @returns
 */
export const getSubgraphUrls = (): SUBGRAPH_URLS => {
  return {
    Arbitrum: getSubgraphUrlForBlockchain(BLOCKCHAINS.Arbitrum, getSubgraphIdForBlockchain(BLOCKCHAINS.Arbitrum)),
    Ethereum: getSubgraphUrlForBlockchain(BLOCKCHAINS.Ethereum, getSubgraphIdForBlockchain(BLOCKCHAINS.Ethereum)),
    Fantom: getSubgraphUrlForBlockchain(BLOCKCHAINS.Fantom, getSubgraphIdForBlockchain(BLOCKCHAINS.Fantom)),
    Polygon: getSubgraphUrlForBlockchain(BLOCKCHAINS.Polygon, getSubgraphIdForBlockchain(BLOCKCHAINS.Polygon)),
  };
};

/**
 * Obtains the value of the subgraphId parameter using window.location
 *
 * useSearchParams was previously used, but it was asynchronous and led to
 * data being fetched from the standard subgraph URL before the subgraphId
 * parameter was resolved.
 *
 * @deprecated
 */
export const getSubgraphIdParameter = (): string | undefined => {
  const source = window.location.hash.split(`${PARAM_SUBGRAPH}=`);
  return source.length > 1 && source[1] ? source[1].split("&")[0] : undefined;
};

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
  if (subgraphId) {
    console.info("Using subgraph with id " + subgraphId);
    return SUBGRAPH_URL_STAGING_STUB + subgraphId;
  } else {
    console.info("Using production subgraph");
    return SUBGRAPH_URL_ETHEREUM;
  }
};
