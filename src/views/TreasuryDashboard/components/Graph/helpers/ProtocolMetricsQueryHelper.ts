import {
  ProtocolMetric,
  ProtocolMetric_Filter,
  ProtocolMetricsQuery,
  ProtocolMetricsQueryVariables,
} from "src/generated/graphql";
import { getNextPageStartDate } from "src/views/TreasuryDashboard/components/Graph/helpers/SubgraphHelper";

/**
 * Generates a function that can be assigned to the `getNextPageParam` property
 * of the variables of {useInfiniteProtocolMetricsQuery}.
 *
 * Note: a previous iteration used a mutable reference, currentStartDate, as a cursor.
 * This led to issues with the fetching of subsequent pages, so it was removed. The
 * effect of this is that if a subgraphId is specified as a URL parameter and that
 * subgraph has not completed indexing to within {DEFAULT_DATE_OFFSET} of the current date,
 * the graphs will not display any data.
 *
 * @param earliestDate The earliest date that should be fetched via the query
 * @param recordCount The number of records to fetch per API call
 * @param baseFilter The standard filter to apply to all queries
 * @returns
 */
export const getNextPageParamFactory = (
  queryName: string,
  earliestDate: string,
  recordCount: number,
  baseFilter: ProtocolMetric_Filter,
  endpoint: string,
  dateOffset?: number,
) => {
  const logPrefix = `${queryName}/ProtocolMetric/${earliestDate}`;
  console.debug(`${logPrefix}: create getNextPageParam with earliestDate ${earliestDate}`);
  return (lastPage: ProtocolMetricsQuery): ProtocolMetricsQueryVariables | undefined => {
    // lastPage is sometimes undefined
    if (typeof lastPage === "undefined") {
      return;
    }

    console.debug(`${logPrefix}: Received ${lastPage.protocolMetrics.length} records`);

    if (lastPage.protocolMetrics.length === 0) {
      console.debug(`${logPrefix}: No records. Exiting.`);
      return;
    }

    /**
     * If we are at the earliestDate, then there is no need to fetch the next page.
     *
     * Returning undefined tells react-query not to fetch the next page.
     */
    const existingStartDate = lastPage.protocolMetrics[lastPage.protocolMetrics.length - 1].date;
    if (new Date(existingStartDate).getTime() <= new Date(earliestDate).getTime()) {
      console.debug(`${logPrefix}: Hit earliestDate. Exiting`);
      return;
    }

    /**
     * We adjust the date range and trigger the next query.
     */
    const newFinishDate = existingStartDate;
    const newStartDate = getNextPageStartDate(newFinishDate, earliestDate, dateOffset);

    console.debug(`${logPrefix}: Loading next page with start date ${newStartDate} and finish date ${newFinishDate}`);
    return {
      filter: {
        ...baseFilter,
        date_gte: newStartDate,
        date_lt: newFinishDate,
      },
      recordCount: recordCount,
      endpoint: endpoint,
    };
  };
};

/**
 * Extract the tokenRecords into a map, indexed by the date string.
 *
 * By default, this will include entries only from the latest block on each day, to avoid incorrect aggregation of data.
 *
 * @param tokenRecords
 * @param latestOnly Defaults to true
 * @returns
 */
export const getProtocolMetricDateMap = (
  tokenRecords: ProtocolMetric[],
  latestOnly = true,
): Map<string, ProtocolMetric[]> => {
  // For each date, determine the latest block
  const dateBlockMap = new Map<string, number>();
  tokenRecords.map(value => {
    const currentDateBlock = dateBlockMap.get(value.date);
    // New date, record the block
    if (typeof currentDateBlock == "undefined") {
      dateBlockMap.set(value.date, value.block);
    }
    // Greater than what is recorded
    else if (currentDateBlock < value.block) {
      dateBlockMap.set(value.date, value.block);
    }
  });

  const dateTokenRecords: Map<string, ProtocolMetric[]> = new Map<string, ProtocolMetric[]>();
  tokenRecords.map(value => {
    const currentDateRecords = dateTokenRecords.get(value.date) || [];

    const latestBlock = dateBlockMap.get(value.date);
    if (latestOnly && typeof latestBlock !== "undefined" && value.block < latestBlock) {
      return;
    }

    currentDateRecords.push(value);
    dateTokenRecords.set(value.date, currentDateRecords);
  });

  return dateTokenRecords;
};
