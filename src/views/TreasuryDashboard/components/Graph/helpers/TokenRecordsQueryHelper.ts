import { TokenRecord, TokenRecord_Filter, TokenRecordsQuery, TokenRecordsQueryVariables } from "src/generated/graphql";
import { getNextPageStartDate } from "src/views/TreasuryDashboard/components/Graph/helpers/SubgraphHelper";

export type TokenRow = {
  id: string;
  token: string;
  category: string;
  isLiquid: boolean;
  blockchain: string;
  balance: string;
  value: string;
  valueExcludingOhm: string;
};

type TokenMap = {
  [key: string]: TokenRow;
};

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
  endpoint: string,
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
    console.debug(`${logPrefix}: existing start date is ${existingStartDate}`);
    if (new Date(existingStartDate).getTime() <= new Date(earliestDate).getTime()) {
      console.debug(`${logPrefix}: Hit earliestDate. Exiting`);
      return;
    }

    /**
     * We adjust the date range and trigger the next query.
     */
    const newFinishDate = existingStartDate;
    const newStartDate = getNextPageStartDate(newFinishDate, earliestDate, dateOffset);
    const filter = {
      ...baseFilter,
      date_gte: newStartDate,
      date_lt: newFinishDate,
    };
    console.debug(`${logPrefix}: Loading next page with filter: ${JSON.stringify(filter, null, 2)}`);
    return {
      filter: filter,
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
export const getTokenRecordDateMap = (tokenRecords: TokenRecord[], latestOnly = true): Map<string, TokenRecord[]> => {
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

  const dateTokenRecords: Map<string, TokenRecord[]> = new Map<string, TokenRecord[]>();
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
 * By default, this will include entries only from the latest block on each day, to avoid incorrect aggregation of data.
 *
 * The array is sorted in descending order by date.
 *
 * @param tokenRecords
 * @param latestOnly Defaults to true
 * @returns
 */
export const getDateTokenSummary = (tokenRecords: TokenRecord[], latestOnly = true): DateTokenSummary[] => {
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

  // tokenRecords is an array of flat records, one token each. We need to aggregate that date, then token-blockchain combination
  const dateSummaryMap: Map<string, DateTokenSummary> = new Map<string, DateTokenSummary>();
  tokenRecords.forEach(record => {
    const latestBlock = dateBlockMap.get(record.date);
    if (latestOnly && typeof latestBlock !== "undefined" && record.block < latestBlock) {
      return;
    }

    const dateSummary = dateSummaryMap.get(record.date) || {
      date: record.date,
      timestamp: new Date(record.date).getTime(), // We inject the timestamp, as it's used by the Chart component
      block: record.block,
      tokens: {} as TokenMap,
    };
    dateSummaryMap.set(record.date, dateSummary);

    const tokenId = `${record.token}/${record.blockchain}`;
    const tokenRecord = dateSummary.tokens[tokenId] || ({} as TokenRow);
    tokenRecord.id = tokenId;
    tokenRecord.token = record.token;
    tokenRecord.category = record.category;
    tokenRecord.isLiquid = record.isLiquid;
    tokenRecord.blockchain = record.blockchain;
    tokenRecord.balance = record.balance.toString();

    const existingValue = tokenRecord.value ? parseFloat(tokenRecord.value) : 0;
    // record.value is typed as a number, but is actually a string
    tokenRecord.value = (existingValue + +record.value).toString(); // TODO consider shifting to use number

    const existingValueExcludingOhm = tokenRecord.valueExcludingOhm ? parseFloat(tokenRecord.valueExcludingOhm) : 0;
    // record.valueExcludingOhm is typed as a number, but is actually a string
    tokenRecord.valueExcludingOhm = (existingValueExcludingOhm + +record.valueExcludingOhm).toString(); // TODO consider shifting to use number

    dateSummary.tokens[tokenId] = tokenRecord;
  });

  return Array.from(dateSummaryMap.values()).sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};
