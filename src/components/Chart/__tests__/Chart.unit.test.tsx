import { formatCurrencyTick, formatPercentTick } from "src/components/Chart/Chart";
import { describe, expect, test } from "vitest";

describe("curency tick formatter", () => {
  test("shortens millions", () => {
    expect(formatCurrencyTick(10000000)).toEqual("$10M");
  });

  test("shortens millions with decimal", () => {
    expect(formatCurrencyTick(10000000.01)).toEqual("$10M");
  });

  test("shortens thousands", () => {
    expect(formatCurrencyTick(500000)).toEqual("$500k");
  });

  test("shortens thousands with decimal", () => {
    expect(formatCurrencyTick(500000.01)).toEqual("$500k");
  });

  test("small number", () => {
    expect(formatCurrencyTick(18.01)).toEqual("$18.01");
  });

  test("empty value", () => {
    expect(formatCurrencyTick(0)).toEqual("");
  });
});

describe("percentage tick formatter", () => {
  test("normal number", () => {
    expect(formatPercentTick(23.02)).toEqual("23.02%");
  });

  test("normal string", () => {
    expect(formatPercentTick("23.02")).toEqual("23.02%");
  });

  test("empty value", () => {
    expect(formatPercentTick(0)).toEqual("");
  });
});
