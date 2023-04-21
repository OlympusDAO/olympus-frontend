import { normalizeSymbol } from "src/helpers/normalizeSymbol";
import { describe, expect, it } from "vitest";

describe("normalizeSymbol", () => {
  it("should return correct values", () => {
    const upperAndLower = (input: string) => {
      return [input.toLowerCase(), input.toUpperCase()];
    };
    expect(upperAndLower("weth")).toEqual(["weth", "WETH"]);

    expect(normalizeSymbol(upperAndLower("weth"))).toEqual(["wETH", "wETH"]);
    expect(normalizeSymbol(upperAndLower("wsteth"))).toEqual(["wstETH", "wstETH"]);
    expect(normalizeSymbol(upperAndLower("gohm"))).toEqual(["gOHM", "gOHM"]);
    expect(normalizeSymbol(upperAndLower("wftm"))).toEqual(["FTM", "FTM"]);
    expect(normalizeSymbol(upperAndLower("fraxbp"))).toEqual(["FRAX", "FRAX"]);
    expect(normalizeSymbol(upperAndLower("wavax"))).toEqual(["AVAX", "AVAX"]);
    expect(normalizeSymbol(upperAndLower("crvfrax"))).toEqual(["CRV", "CRV"]);

    expect(normalizeSymbol(upperAndLower("lowerCaseString"))).toEqual(["lowercasestring", "LOWERCASESTRING"]);
  });
});
