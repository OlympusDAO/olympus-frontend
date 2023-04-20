import { defiLlamaChainToNetwork } from "src/helpers/defiLlamaChainToNetwork";
import { describe, expect, it } from "vitest";

describe("defiLlamaChainToNetwork", () => {
  it('should return "ETH" for "ethereum"', () => {
    expect(defiLlamaChainToNetwork("ethereum")).toEqual("ETH");
  });

  it('should return "MATIC" for "polygon"', () => {
    expect(defiLlamaChainToNetwork("polygon")).toEqual("MATIC");
  });

  it("should return uppercase version of input for unknown chain", () => {
    expect(defiLlamaChainToNetwork("bsc")).toEqual("BSC");
  });
});
