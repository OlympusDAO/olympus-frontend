import { TokenRecord } from "src/generated/graphql";
import {
  getDateTokenSummary,
  getTokenRecordDateMap,
} from "src/views/TreasuryDashboard/components/Graph/helpers/TokenRecordsQueryHelper";

const createTokenRecord = (
  date?: string,
  block?: number,
  token?: string,
  category?: string,
  value?: number,
  valueExcludingOhm?: number,
): TokenRecord => {
  return {
    balance: 0,
    block: block || 0,
    category: category || "",
    date: date || "",
    id: "",
    isBluechip: false,
    isLiquid: true,
    multiplier: 0,
    rate: 0,
    source: "",
    sourceAddress: "",
    timestamp: 1,
    token: token || "",
    tokenAddress: "",
    value: value || 0,
    valueExcludingOhm: valueExcludingOhm || 0,
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

describe("getDateTokenSummary", () => {
  test("groups by date", () => {
    const records: TokenRecord[] = [
      createTokenRecord("2022-06-06", 2, "token", "POL", 1, 0.5),
      createTokenRecord("2022-06-05", 1, "token", "Foo", 2, 1.5),
    ];

    const byDateRecords = getDateTokenSummary(records, false);

    const dateTwo = byDateRecords[0];
    expect(dateTwo).toBeDefined();
    expect(dateTwo.date).toEqual("2022-06-06");
    expect(dateTwo.block).toEqual(2);
    expect(dateTwo.tokens["token"].category).toEqual("POL");
    expect(dateTwo.tokens["token"].value).toEqual("1");
    expect(dateTwo.tokens["token"].valueExcludingOhm).toEqual("0.5");
    expect(Object.keys(dateTwo.tokens).length).toEqual(1);

    const dateOne = byDateRecords[1];
    expect(dateOne).toBeDefined();
    expect(dateOne.date).toEqual("2022-06-05");
    expect(dateOne.block).toEqual(1);
    expect(dateOne.tokens["token"].category).toEqual("Foo");
    expect(dateOne.tokens["token"].value).toEqual("2");
    expect(dateOne.tokens["token"].valueExcludingOhm).toEqual("1.5");
    expect(Object.keys(dateOne.tokens).length).toEqual(1);

    expect(byDateRecords.length).toEqual(2);
  });

  test("groups by date with latest block only", () => {
    const records: TokenRecord[] = [
      createTokenRecord("2022-06-06", 2, "token", "POL", 1, 0.5),
      createTokenRecord("2022-06-06", 1, "token", "Foo", 2, 1.5),
    ];

    const byDateRecords = getDateTokenSummary(records);

    const dateTwo = byDateRecords[0];
    expect(dateTwo).toBeDefined();
    expect(dateTwo.date).toEqual("2022-06-06");
    expect(dateTwo.block).toEqual(2);
    expect(dateTwo.tokens["token"].category).toEqual("POL");
    expect(dateTwo.tokens["token"].value).toEqual("1");
    expect(dateTwo.tokens["token"].valueExcludingOhm).toEqual("0.5");
    expect(Object.keys(dateTwo.tokens).length).toEqual(1);

    expect(byDateRecords.length).toEqual(1);
  });
});
