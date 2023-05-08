import { getFloat } from "src/helpers/NumberHelper";
import { describe, expect, it } from "vitest";

describe("NumberHelper", () => {
  it("getFloat should return 0 when undefined", () => {
    expect(getFloat(undefined)).toEqual(0);
  });
  it("getFloat should return the number when number", () => {
    expect(getFloat(1.9)).toEqual(1.9);
    expect(getFloat(1)).toEqual(1);
  });
  it("getFloat should return the number when string", () => {
    expect(getFloat("1.9")).toEqual(1.9);
    expect(getFloat("1")).toEqual(1);
  });
  it("should throw error when wrong type", async () => {
    const shouldThrow = async () => {
      getFloat(true);
    };
    await expect(shouldThrow()).rejects.toThrow("Unable to get float value");
  });
});
