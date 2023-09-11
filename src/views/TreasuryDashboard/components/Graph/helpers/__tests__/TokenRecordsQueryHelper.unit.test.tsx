import { TokenRecord } from "src/hooks/useFederatedSubgraphQuery";
import {
  getDateTokenRecordMap,
  getDateTokenRecordSummary,
} from "src/views/TreasuryDashboard/components/Graph/helpers/TokenRecordsQueryHelper";
import { describe, expect, it } from "vitest";

const createTokenRecord = (
  date?: string,
  block?: string,
  token?: string,
  category?: string,
  value?: string,
  valueExcludingOhm?: string,
): TokenRecord => {
  return {
    balance: "0",
    block: block || "0",
    blockchain: "Ethereum",
    category: category || "",
    date: date || "",
    id: "",
    isBluechip: false,
    isLiquid: true,
    multiplier: "0",
    rate: "0",
    source: "",
    sourceAddress: "",
    timestamp: "1",
    token: token || "",
    tokenAddress: "",
    value: value || "0",
    valueExcludingOhm: valueExcludingOhm || "0",
  };
};

describe("getTokenRecordDateMap", () => {
  it("groups by date", () => {
    const records: TokenRecord[] = [createTokenRecord("2022-06-06", "2"), createTokenRecord("2022-06-05", "1")];

    const byDateRecords = getDateTokenRecordMap(records);

    const dateOne = byDateRecords.get("2022-06-05");
    expect(dateOne).toBeDefined();
    expect(dateOne![0].date).toEqual("2022-06-05");
    expect(dateOne!.length).toEqual(1);

    const dateTwo = byDateRecords.get("2022-06-06");
    expect(dateTwo).toBeDefined();
    expect(dateTwo![0].date).toEqual("2022-06-06");
    expect(dateTwo!.length).toEqual(1);
  });
});

describe("getDateTokenSummary", () => {
  it("groups by date", () => {
    const records: TokenRecord[] = [
      createTokenRecord("2022-06-06", "2", "token", "POL", "1", "0.5"),
      createTokenRecord("2022-06-05", "1", "token", "Foo", "2", "1.5"),
    ];

    const byDateRecords = getDateTokenRecordSummary(records);

    const tokenId = "token/Ethereum";

    const dateTwo = byDateRecords[0];
    expect(dateTwo).toBeDefined();
    expect(dateTwo.date).toEqual("2022-06-06");
    expect(dateTwo.block).toEqual(2);
    expect(dateTwo.tokens[tokenId].id).toEqual(tokenId);
    expect(dateTwo.tokens[tokenId].category).toEqual("POL");
    expect(dateTwo.tokens[tokenId].value).toEqual("1");
    expect(dateTwo.tokens[tokenId].valueExcludingOhm).toEqual("0.5");
    expect(Object.keys(dateTwo.tokens).length).toEqual(1);

    const dateOne = byDateRecords[1];
    expect(dateOne).toBeDefined();
    expect(dateOne.date).toEqual("2022-06-05");
    expect(dateOne.block).toEqual(1);
    expect(dateOne.tokens[tokenId].id).toEqual(tokenId);
    expect(dateOne.tokens[tokenId].category).toEqual("Foo");
    expect(dateOne.tokens[tokenId].value).toEqual("2");
    expect(dateOne.tokens[tokenId].valueExcludingOhm).toEqual("1.5");
    expect(Object.keys(dateOne.tokens).length).toEqual(1);

    expect(byDateRecords.length).toEqual(2);
  });
});
