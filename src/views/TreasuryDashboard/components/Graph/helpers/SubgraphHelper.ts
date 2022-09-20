import { adjustDateByDays, getISO8601String } from "src/helpers/DateHelper";

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
