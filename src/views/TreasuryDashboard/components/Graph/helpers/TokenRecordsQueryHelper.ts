import { TokenRecord } from "src/hooks/useFederatedSubgraphQuery";

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

export type DateTokenSummary = {
  date: string;
  timestamp: number;
  block: number;
  tokens: TokenMap;
};

/**
 * Returns a mapping of date to token records.
 */
export const getDateTokenRecordMap = (tokenRecords: TokenRecord[]): Map<string, TokenRecord[]> => {
  const dateMap = new Map<string, TokenRecord[]>();
  tokenRecords.map(value => {
    // Group all records by date
    const currentDateRecords = dateMap.get(value.date) || [];
    currentDateRecords.push(value);
    dateMap.set(value.date, currentDateRecords);
  });

  return dateMap;
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
export const getDateTokenRecordSummary = (tokenRecords: TokenRecord[]): DateTokenSummary[] => {
  if (!tokenRecords) {
    return [];
  }

  // tokenRecords is an array of flat records, one token each. We need to aggregate that date, then token-blockchain combination
  const dateSummaryMap: Map<string, DateTokenSummary> = new Map<string, DateTokenSummary>();
  tokenRecords.forEach(record => {
    const recordTimestamp = +record.timestamp * 1000; // * 1000 as the number from the subgraph is in seconds
    const dateSummary = dateSummaryMap.get(record.date) || {
      date: record.date,
      timestamp: recordTimestamp,
      block: +record.block,
      tokens: {} as TokenMap,
    };

    // Ensure the timestamp is the latest for the date
    if (recordTimestamp > dateSummary.timestamp) {
      dateSummary.timestamp = recordTimestamp;
    }

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

export const getLatestTimestamp = (records: TokenRecord[]): number => {
  return (
    records.reduce((previousValue: number, currentValue: TokenRecord) => {
      if (previousValue == -1) return +currentValue.timestamp;

      if (+currentValue.timestamp > previousValue) return +currentValue.timestamp;

      return previousValue;
    }, -1) * 1000 // To convert from second to millisecond accuracy
  );
};
