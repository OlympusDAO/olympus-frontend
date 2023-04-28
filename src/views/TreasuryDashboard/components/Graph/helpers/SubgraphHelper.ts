import { adjustDateByDays, getISO8601String } from "src/helpers/DateHelper";

const DEFAULT_DATE_OFFSET = -14;

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

/**
 * Returns a date string (YYYY-MM-DD format) that represents the start date
 * for the next page in a react-query infinite query.
 *
 * If {earliestDateString} is greater than the adjusted date, it will be returned.
 *
 * @param dateString
 * @param earliestDateString
 * @returns
 */
export const getNextPageStartDate = (
  dateString: string,
  earliestDateString: string,
  offset = DEFAULT_DATE_OFFSET,
): string => {
  const date = adjustDateByDays(new Date(dateString), offset);
  const earliestDate = new Date(earliestDateString);
  // We don't want to go further back than the earliestDate
  const finalDate = date.getTime() < earliestDate.getTime() ? earliestDate : date;

  return getISO8601String(finalDate);
};
