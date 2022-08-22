import { TokenRecord, TokenRecord_Filter, TokenRecordsQuery, TokenRecordsQueryVariables } from "src/generated/graphql";
import {
  CATEGORY_POL,
  CATEGORY_STABLE,
  CATEGORY_VOLATILE,
} from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getNextPageStartDate } from "src/views/TreasuryDashboard/components/Graph/helpers/SubgraphHelper";

/**
 * Generates a function that can be assigned to the `getNextPageParam` property
 * of the variables of {useInfiniteTokenRecordsQuery}.
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
  baseFilter: TokenRecord_Filter,
  dateOffset?: number,
) => {
  const logPrefix = `${queryName}/TokenRecord/${earliestDate}`;
  console.debug(`${logPrefix}: create getNextPageParam with earliestDate ${earliestDate}`);
  return (lastPage: TokenRecordsQuery): TokenRecordsQueryVariables | undefined => {
    console.debug(`${logPrefix}: Received ${lastPage.tokenRecords.length} records`);

    if (lastPage.tokenRecords.length === 0) {
      console.debug(`${logPrefix}: No records. Exiting.`);
      return;
    }

    /**
     * If we are at the earliestDate, then there is no need to fetch the next page.
     *
     * Returning undefined tells react-query not to fetch the next page.
     */
    const existingStartDate = lastPage.tokenRecords[lastPage.tokenRecords.length - 1].date;
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
    };
  };
};

export const filterReduce = (records: TokenRecord[], filterPredicate: (value: TokenRecord) => unknown): number => {
  return records.filter(filterPredicate).reduce((previousValue, currentRecord) => {
    return previousValue + +currentRecord.value;
  }, 0);
};

export const getLiquidBackingValue = (records: TokenRecord[]): number => {
  return filterReduce(
    records,
    record => [CATEGORY_STABLE, CATEGORY_VOLATILE, CATEGORY_POL].includes(record.category) && record.isLiquid == true,
  );
};

/**
 * Extract the tokenRecords into a map, indexed by the date string
 * @param tokenRecords
 * @returns
 */
export const getTokenRecordDateMap = (tokenRecords: TokenRecord[]): Map<string, TokenRecord[]> => {
  const dateTokenRecords: Map<string, TokenRecord[]> = new Map<string, TokenRecord[]>();
  tokenRecords.map(value => {
    const currentDateRecords = dateTokenRecords.get(value.date) || [];
    currentDateRecords.push(value);
    dateTokenRecords.set(value.date, currentDateRecords);
  });

  return dateTokenRecords;
};
