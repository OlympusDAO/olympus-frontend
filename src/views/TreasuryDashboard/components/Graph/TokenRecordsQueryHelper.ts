import { TokenRecord_Filter, TokenRecordsQuery, TokenRecordsQueryVariables } from "src/generated/graphql";
import { getNextPageStartDate } from "src/views/TreasuryDashboard/components/Graph/SubgraphHelper";

/**
 * Generates a function that can be assigned to the `getNextPageParam` property
 * of the variables of {useInfiniteTokenRecordsQuery}.
 *
 * @param earliestDate The earliest date that should be fetched via the query
 * @param recordCount The number of records to fetch per API call
 * @param baseFilter The standard filter to apply to all queries
 * @returns
 */
export const getNextPageParamFactory =
  (queryName: string, earliestDate: string, recordCount: number, baseFilter: TokenRecord_Filter) =>
  (lastPage: TokenRecordsQuery): TokenRecordsQueryVariables | undefined => {
    /**
     * The last element of lastPage will have the earliest date.
     *
     * The current start date (and hence, current page) is determined using
     * {lastPage}, as defining constant or state variables outside of this
     * code block leads to undesired behaviour.
     *
     * However, this presents a problem in that trying to access a subgraph that
     * has not finished indexing is impossible, since there is no data for today,
     * hence no elements in {lastPage.tokenRecords} that would give a date to
     * use for pagination.
     *
     * TODO consider how to solve this pagination issue
     */
    if (!lastPage.tokenRecords.length) {
      console.debug(queryName + ": lastPage has no records. Exiting.");
      return;
    }

    const currentStartDate = lastPage.tokenRecords.slice(-1)[0].date;

    /**
     * If we are at the earliestDate, then there is no need to fetch the next page.
     *
     * Returning undefined tells react-query not to fetch the next page.
     */
    if (new Date(currentStartDate).getTime() <= new Date(earliestDate).getTime()) {
      console.debug(queryName + ": Data loading done");
      return;
    }

    /**
     * We adjust the date range and trigger the next query.
     */
    const newStartDate = getNextPageStartDate(currentStartDate, earliestDate);
    console.debug(queryName + ": Loading data for " + newStartDate);
    return {
      filter: {
        ...baseFilter,
        date_gte: newStartDate,
        date_lt: currentStartDate,
      },
      recordCount: recordCount,
    };
  };
