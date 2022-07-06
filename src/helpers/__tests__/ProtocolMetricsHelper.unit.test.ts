import { getByTokenSummary } from "../ProtocolMetricsHelper";

const getTokenRecord = (token: string, value: string) => {
  return {
    token: token,
    value: value,
  };
};

describe("getFlatComponentValues", () => {
  test("works as expected", () => {
    const records = [getTokenRecord("Aave", "100"), getTokenRecord("Aave", "102.2"), getTokenRecord("DAI", "20.02")];
    const recordsValue = records.reduce((accumulator, obj) => {
      return accumulator + parseFloat(obj.value);
    }, 0);

    const timestamp = "1122200";
    const metrics = [
      {
        timestamp: timestamp,
        treasuryLPValueComponents: {
          value: recordsValue,
          records: records,
        },
      },
    ];

    const flatData = getByTokenSummary(metrics, ["treasuryLPValueComponents"], ["Protocol-Owned Liquidity"]);

    // Data has been flattened
    const recordOne = flatData[0];
    expect(recordOne["timestamp"]).toEqual(timestamp);
    // 50 * 2 + 51.1 * 2
    expect(recordOne.tokens["Aave"].value).toEqual("202.2");
    // 20.02 * 1
    expect(recordOne.tokens["DAI"].value).toEqual("20.02");

    expect(flatData.length).toEqual(1);
  });

  test("incorrect key", () => {
    const metrics = [{}];

    expect(getByTokenSummary(metrics, ["somevalue"], ["somevalue"])).toThrow();
  });
});
