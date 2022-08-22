import { MutableRefObject } from "react";
import { TokenRecord_Filter, TokenRecordsQuery, TokenRecordsQueryVariables } from "src/generated/graphql";
import { getNextPageStartDate } from "src/views/TreasuryDashboard/components/Graph/SubgraphHelper";

/**
 * Generates a function that can be assigned to the `getNextPageParam` property
 * of the variables of {useInfiniteTokenRecordsQuery}.
 *
 * The {currentStartDate} mutable reference is used to keep track of the
 * start date across multiple calls to this function.
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
  currentStartDate: MutableRefObject<string>,
  dateOffset?: number,
) => {
  console.debug(
    `${queryName}-${earliestDate}: create getNextPageParam with earliestDate ${earliestDate} and currentStartDate ${currentStartDate.current}`,
  );
  return (lastPage: TokenRecordsQuery): TokenRecordsQueryVariables | undefined => {
    // console.debug(
    //   `${queryName}-${earliestDate}: Received ${lastPage.tokenRecords.length} records with currentStartDate ${currentStartDate.current}`,
    // );
    console.debug(`${queryName}-${earliestDate}: Received ${lastPage.tokenRecords.length} records`);

    if (lastPage.tokenRecords.length === 0) {
      console.debug(`${queryName}-${earliestDate}: No records. Exiting.`);
      return;
    }

    const existingStartDate = lastPage.tokenRecords[lastPage.tokenRecords.length - 1].date;
    if (new Date(existingStartDate).getTime() <= new Date(earliestDate).getTime()) {
      console.debug(`${queryName}-${earliestDate}: Hit earliestDate.`);
      return;
    }

    // /**
    //  * If we are at the earliestDate, then there is no need to fetch the next page.
    //  *
    //  * Returning undefined tells react-query not to fetch the next page.
    //  */
    // if (new Date(currentStartDate.current).getTime() <= new Date(earliestDate).getTime()) {
    //   console.debug(`${queryName}-${earliestDate}: Data loading done`);
    //   return;
    // }

    /**
     * We adjust the date range and trigger the next query.
     */
    const newFinishDate = existingStartDate;
    const newStartDate = getNextPageStartDate(newFinishDate, earliestDate, dateOffset);
    // currentStartDate.current = newStartDate;

    console.debug(
      `${queryName}-${earliestDate}: Loading next page with start date ${newStartDate} and finish date ${newFinishDate}`,
    );
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
