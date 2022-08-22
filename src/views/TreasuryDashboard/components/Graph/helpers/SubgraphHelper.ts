import { TokenRecord } from "src/generated/graphql";
import { adjustDateByDays, getISO8601String } from "src/helpers/DateHelper";
import { TokenMap, TokenRow } from "src/helpers/ProtocolMetricsHelper";

const DEFAULT_DATE_OFFSET = -14;

export const getSubgraphQueryExplorerUrl = (queryDocument: string, subgraphUrl: string): string => {
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

export type DateTokenSummary = {
  date: string;
  timestamp: number;
  block: number;
  tokens: TokenMap;
};

/**
 * Generates an array containing one DateTokenSummary element for each date,
 * in which the token balances are contained.
 *
 * The array is sorted in descending order by date.
 *
 * @param tokenRecords
 * @returns
 */
export const getDateTokenSummary = (tokenRecords: TokenRecord[]): DateTokenSummary[] => {
  const dateSummaryMap: Map<string, DateTokenSummary> = new Map<string, DateTokenSummary>();

  // tokenRecords is an array of flat records, one token each. We need to aggregate that date, then token
  tokenRecords.forEach(record => {
    const dateSummary = dateSummaryMap.get(record.date) || {
      date: record.date,
      timestamp: new Date(record.date).getTime(), // We inject the timestamp, as it's used by the Chart component
      block: record.block,
      tokens: {} as TokenMap,
    };
    dateSummaryMap.set(record.date, dateSummary);

    const tokenRecord = dateSummary.tokens[record.token] || ({} as TokenRow);
    tokenRecord.token = record.token;
    tokenRecord.category = record.category;

    const existingValue = tokenRecord.value ? parseFloat(tokenRecord.value) : 0;
    // record.value is typed as a number, but is actually a string
    tokenRecord.value = (existingValue + +record.value).toString(); // TODO consider shifting to use number
    dateSummary.tokens[record.token] = tokenRecord;
  });

  return Array.from(dateSummaryMap.values()).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};
