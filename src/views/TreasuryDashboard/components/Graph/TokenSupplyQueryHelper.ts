import {
  TokenSuppliesQuery,
  TokenSuppliesQueryVariables,
  TokenSupply,
  TokenSupply_Filter,
} from "src/generated/graphql";
import { TOKEN_SUPPLY_TYPE_LIQUIDITY } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getNextPageStartDate } from "src/views/TreasuryDashboard/components/Graph/SubgraphHelper";

/**
 * Generates a function that can be assigned to the `getNextPageParam` property
 * of the variables of {useInfiniteTokenSuppliesQuery}.
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
  baseFilter: TokenSupply_Filter,
  dateOffset?: number,
) => {
  const logPrefix = `${queryName}/TokenSupply/${earliestDate}`;
  console.debug(`${logPrefix}: create getNextPageParam with earliestDate ${earliestDate}`);
  return (lastPage: TokenSuppliesQuery): TokenSuppliesQueryVariables | undefined => {
    console.debug(`${logPrefix}: Received ${lastPage.tokenSupplies.length} records`);

    if (lastPage.tokenSupplies.length === 0) {
      console.debug(`${logPrefix}: No records. Exiting.`);
      return;
    }

    /**
     * If we are at the earliestDate, then there is no need to fetch the next page.
     *
     * Returning undefined tells react-query not to fetch the next page.
     */
    const existingStartDate = lastPage.tokenSupplies[lastPage.tokenSupplies.length - 1].date;
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

export const getTokenSupplyDateMap = (tokenRecords: TokenSupply[]): Map<string, TokenSupply[]> => {
  const dateTokenRecords: Map<string, TokenSupply[]> = new Map<string, TokenSupply[]>();
  tokenRecords.map(value => {
    const currentDateRecords = dateTokenRecords.get(value.date) || [];
    currentDateRecords.push(value);
    dateTokenRecords.set(value.date, currentDateRecords);
  });

  return dateTokenRecords;
};

/**
 * For a given array of TokenSupply records (assumed to be at the same point in time),
 * this function returns the OHM circulating supply.
 *
 * Circulating supply is defined as:
 * - OHM total supply
 * - minus: OHM in treasury wallets
 * - minus: migration offset
 *
 * In practice, this is everything except OHM in liquidity pools.
 *
 * @param records
 * @returns
 */
export const getOhmCirculatingSupply = (records: TokenSupply[]): number => {
  return records
    .filter(record => record.type !== TOKEN_SUPPLY_TYPE_LIQUIDITY)
    .reduce((previousValue, record) => previousValue + +record.supplyBalance, 0);
};

/**
 * For a given array of TokenSupply records (assumed to be at the same point in time),
 * this function returns the OHM circulating supply.
 *
 * Circulating supply is defined as:
 * - OHM total supply
 * - minus: OHM in treasury wallets
 * - minus: migration offset
 * - minus: OHM in liquidity pools
 *
 * @param records
 * @returns
 */
export const getOhmFloatingSupply = (records: TokenSupply[]): number => {
  return records.reduce((previousValue, record) => previousValue + +record.supplyBalance, 0);
};

/**
 * gOHM circulating supply is synthetically calculated as:
 *
 * OHM floating supply / current index
 *
 * @param currentIndex
 * @param ohmFloatingSupply
 * @returns
 */
export const getGOhmSyntheticSupply = (currentIndex: number, ohmFloatingSupply: number) =>
  ohmFloatingSupply / currentIndex;
