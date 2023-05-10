import { ChartType } from "src/components/Chart/Constants";
import { getDataKeysFromTokens, getMaximumValue } from "src/helpers/subgraph/ProtocolMetricsHelper";
import { describe, expect, test } from "vitest";

describe("getDataKeysFromTokens", () => {
  test("works as expected", () => {
    const tokenNames = ["DAI", "LUSD"];

    const dataKeys = getDataKeysFromTokens(tokenNames);

    expect(dataKeys).toEqual(["tokens.DAI.value", "tokens.LUSD.value"]);
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
