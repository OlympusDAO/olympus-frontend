import { ChartType } from "src/components/Chart/Constants";
import {
  getDataKeysFromTokens,
  getKeysTokenSummary,
  getMaximumValue,
  getTokensFromKey,
  reduceKeysTokenSummary,
} from "src/helpers/ProtocolMetricsHelper";

const getTokenRecord = (token: string, value: string) => {
  return {
    token: token,
    value: value,
  };
};

describe("getKeysTokenSummary", () => {
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

    const flatData = getKeysTokenSummary(metrics, ["treasuryLPValueComponents"], ["Protocol-Owned Liquidity"]);

    // Data has been flattened
    const recordOne = flatData[0];
    expect(recordOne["timestamp"]).toEqual(timestamp);
    // 50 * 2 + 51.1 * 2
    expect(recordOne["treasuryLPValueComponents"]["tokens"]["Aave"].value).toEqual("202.2");
    expect(recordOne["treasuryLPValueComponents"]["tokens"]["Aave"].category).toEqual("Protocol-Owned Liquidity");
    // 20.02 * 1
    expect(recordOne["treasuryLPValueComponents"]["tokens"]["DAI"].value).toEqual("20.02");
    expect(recordOne["treasuryLPValueComponents"]["tokens"]["DAI"].category).toEqual("Protocol-Owned Liquidity");
    expect(Object.keys(recordOne["treasuryLPValueComponents"]["tokens"]).length).toEqual(2);

    expect(flatData.length).toEqual(1);
  });

  test("error when keys and categories have different lengths", () => {
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

    expect(() => {
      getKeysTokenSummary(metrics, ["treasuryLPValueComponents"], ["one", "two"]);
    }).toThrow();
  });

  test("missing records property", () => {
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
          records2: records, // Should be `records`
        },
      },
    ];

    expect(() => {
      getKeysTokenSummary(metrics, ["treasuryLPValueComponents"], ["POL"]);
    }).toThrow();
  });

  test("incorrect key", () => {
    const metrics = [{}];

    expect(() => {
      getKeysTokenSummary(metrics, ["sometoken"], ["somecategory"]);
    }).toThrow();
  });
});

describe("reduceKeysTokenSummary", () => {
  test("works as expected", () => {
    const timestamp = "1122200";
    const metrics = [
      {
        timestamp: timestamp,
        treasuryLPValueComponents: {
          tokens: {
            DAI: { token: "DAI", category: "Stablecoins", value: "100.0" },
            LUSD: { token: "LUSD", category: "Stablecoins", value: "150.0" },
          },
        },
      },
    ];

    const reducedData = reduceKeysTokenSummary(metrics, ["treasuryLPValueComponents"]);

    expect(reducedData[0]["tokens"][0].token).toEqual("DAI");
    expect(reducedData[0]["tokens"][1].token).toEqual("LUSD");
    expect(reducedData[0]["tokens"].length).toEqual(2);
  });

  test("missing tokens property", () => {
    const timestamp = "1122200";
    const metrics = [
      {
        timestamp: timestamp,
        treasuryLPValueComponents: {
          tokens2: {
            DAI: { token: "DAI", category: "stable", value: "100.0" },
          }, // Should be `tokens`
        },
      },
    ];

    expect(() => {
      reduceKeysTokenSummary(metrics, ["treasuryLPValueComponents"]);
    }).toThrow();
  });

  test("incorrect key", () => {
    const metrics = [{}];

    expect(() => {
      reduceKeysTokenSummary(metrics, ["treasuryLPValueComponents"]);
    }).toThrow();
  });
});

describe("getTokensFromKey", () => {
  test("works as expected", () => {
    const timestamp = "1122200";
    const metrics = [
      {
        timestamp: timestamp,
        treasuryLPValueComponents: {
          tokens: {
            DAI: { token: "DAI", category: "Stablecoins", value: "100.0" },
            LUSD: { token: "LUSD", category: "Stablecoins", value: "150.0" },
          },
        },
      },
    ];

    const tokenNames = getTokensFromKey(metrics, "treasuryLPValueComponents");

    expect(tokenNames).toEqual(["DAI", "LUSD"]);
  });
});

describe("getDataKeysFromTokens", () => {
  test("works as expected", () => {
    const tokenNames = ["DAI", "LUSD"];

    const dataKeys = getDataKeysFromTokens(tokenNames, "treasuryLPValueComponents");

    expect(dataKeys).toEqual([
      "treasuryLPValueComponents.tokens.DAI.value",
      "treasuryLPValueComponents.tokens.LUSD.value",
    ]);
  });
});

describe("getMaximumValue", () => {
  test("works as expected with string values", () => {
    const metrics = [
      {
        timestamp: "1122200",
        ohmPrice: "10.01",
        liquidBacking: "11",
      },
      {
        timestamp: "1122201",
        ohmPrice: "10.02",
        liquidBacking: "11.01",
      },
    ];

    const maxValue = getMaximumValue(metrics, ["ohmPrice", "liquidBacking"], ChartType.MultiLine);

    expect(maxValue).toEqual(11.01);
  });

  test("works as expected with number values", () => {
    const metrics = [
      {
        timestamp: "1122200",
        ohmPrice: 10.01,
        liquidBacking: 11,
      },
      {
        timestamp: "1122201",
        ohmPrice: 10.02,
        liquidBacking: 11.01,
      },
    ];

    const maxValue = getMaximumValue(metrics, ["ohmPrice", "liquidBacking"], ChartType.MultiLine);

    expect(maxValue).toEqual(11.01);
  });

  test("works with nested keys", () => {
    const metrics = [
      {
        timestamp: "1122200",
        treasuryLPValueComponents: {
          tokens: {
            DAI: { token: "DAI", category: "Stablecoins", value: "100.0" },
            LUSD: { token: "LUSD", category: "Stablecoins", value: "150.0" },
          },
        },
      },
      {
        timestamp: "1122201",
        treasuryLPValueComponents: {
          tokens: {
            DAI: { token: "DAI", category: "Stablecoins", value: "101.0" },
            LUSD: { token: "LUSD", category: "Stablecoins", value: "151.0" },
          },
        },
      },
    ];

    const maxValue = getMaximumValue(
      metrics,
      ["treasuryLPValueComponents.tokens.DAI.value", "treasuryLPValueComponents.tokens.LUSD.value"],
      ChartType.MultiLine,
    );

    expect(maxValue).toEqual(151.0);
  });

  test("stacking", () => {
    const metrics = [
      {
        timestamp: "1122200",
        ohmPrice: 10.01,
        liquidBacking: 11,
      },
      {
        timestamp: "1122201",
        ohmPrice: 10.02,
        liquidBacking: 11.01,
      },
    ];

    const maxValue = getMaximumValue(metrics, ["ohmPrice", "liquidBacking"], ChartType.StackedArea);

    expect(maxValue).toEqual(11.01 + 10.02);
  });

  test("stacked area > line", () => {
    const metrics = [
      {
        timestamp: "1122200",
        ohmPrice: 10.01,
        liquidBacking: 11,
        line: 15,
      },
      {
        timestamp: "1122201",
        ohmPrice: 10.02,
        liquidBacking: 11.01,
        line: 16,
      },
    ];

    const maxValue = getMaximumValue(metrics, ["ohmPrice", "liquidBacking", "line"], ChartType.Composed, ["line"]);

    // max value of line < ohmPrice + liquidBacking
    expect(maxValue).toEqual(11.01 + 10.02);
  });

  test("stacked area < line", () => {
    const metrics = [
      {
        timestamp: "1122200",
        ohmPrice: 10.01,
        liquidBacking: 11,
        line: 15,
      },
      {
        timestamp: "1122201",
        ohmPrice: 10.02,
        liquidBacking: 11.01,
        line: 25,
      },
    ];

    const maxValue = getMaximumValue(metrics, ["ohmPrice", "liquidBacking", "line"], ChartType.Composed, ["line"]);

    // max value of line < ohmPrice + liquidBacking
    expect(maxValue).toEqual(25);
  });

  test("respects key input", () => {
    const metrics = [
      {
        timestamp: "1122200",
        ohmPrice: "10.01",
        liquidBacking: "11",
      },
      {
        timestamp: "1122201",
        ohmPrice: "10.02",
        liquidBacking: "11.01",
      },
    ];

    const maxValue = getMaximumValue(metrics, ["ohmPrice"], ChartType.MultiLine);

    expect(maxValue).toEqual(10.02);
  });
});
