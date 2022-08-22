import { TokenRecord } from "src/generated/graphql";
import { getTokenRecordDateMap } from "src/views/TreasuryDashboard/components/Graph/helpers/TokenRecordsQueryHelper";

const createTokenRecord = (date?: string, block?: number): TokenRecord => {
  return {
    balance: 0,
    block: block || 0,
    category: "",
    date: date || "",
    id: "",
    isBluechip: false,
    isLiquid: true,
    multiplier: 0,
    rate: 0,
    source: "",
    sourceAddress: "",
    timestamp: 1,
    token: "",
    tokenAddress: "",
    value: 0,
  };
};

describe("getTokenRecordDateMap", () => {
  test("groups by date", () => {
    const records: TokenRecord[] = [createTokenRecord("2022-06-06", 2), createTokenRecord("2022-06-05", 1)];

    const byDateRecords = getTokenRecordDateMap(records, false);

    const dateOne = byDateRecords.get("2022-06-05");
    expect(dateOne).toBeDefined();
    expect(dateOne![0].date).toEqual("2022-06-05");
    expect(dateOne!.length).toEqual(1);

    const dateTwo = byDateRecords.get("2022-06-06");
    expect(dateTwo).toBeDefined();
    expect(dateTwo![0].date).toEqual("2022-06-06");
    expect(dateTwo!.length).toEqual(1);
  });

  test("groups by date with latest block only", () => {
    const records: TokenRecord[] = [createTokenRecord("2022-06-06", 2), createTokenRecord("2022-06-06", 1)];

    const byDateRecords = getTokenRecordDateMap(records);

    const dateOne = byDateRecords.get("2022-06-06");
    expect(dateOne).toBeDefined();
    expect(dateOne![0].block).toEqual(2);
    expect(dateOne!.length).toEqual(1);
  });
});
