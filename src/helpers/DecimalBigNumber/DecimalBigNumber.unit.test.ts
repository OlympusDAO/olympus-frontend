import { DecimalBigNumber } from "./DecimalBigNumber";

describe("DecimalBigNumber", () => {
  it("handles unexpected inputs", () => {
    expect(new DecimalBigNumber("", 9).toAccurateString()).toEqual("0.0");
    expect(new DecimalBigNumber("      ", 9).toAccurateString()).toEqual("0.0");
    expect(new DecimalBigNumber("text", 1).toAccurateString()).toEqual("0.0");
    expect(new DecimalBigNumber(".0", 1).toAccurateString()).toEqual("0.0");
    expect(new DecimalBigNumber(".", 1).toAccurateString()).toEqual("0.0");
    expect(new DecimalBigNumber("....", 1).toAccurateString()).toEqual("0.0");
    expect(new DecimalBigNumber("1.1.1.1.1", 1).toAccurateString()).toEqual("0.0");
  });

  it("accurately formats strings", () => {
    expect(new DecimalBigNumber(".1", 1).toAccurateString()).toEqual("0.1");
    expect(new DecimalBigNumber("1.1", 9).toAccurateString()).toEqual("1.1");
    expect(new DecimalBigNumber("1.123", 9).toAccurateString()).toEqual("1.123");
  });

  it("discards irrelevant precision", () => {
    expect(new DecimalBigNumber("1.12345678913139872398723", 9).toAccurateString()).toEqual("1.123456789");
  });

  it("adds numbers correctly", () => {
    expect(new DecimalBigNumber("1.1", 9).add(new DecimalBigNumber("1.2", 18)).toAccurateString()).toEqual("2.3");
  });

  it("compares numbers correctly", () => {
    expect(new DecimalBigNumber("1.1", 9).gt(new DecimalBigNumber("1.2", 18))).toEqual(false);
    expect(new DecimalBigNumber("1.21", 9).gt(new DecimalBigNumber("1.2", 18))).toEqual(true);
  });

  it("multiples numbers correctly", () => {
    // gOHM to OHM
    const gohm = new DecimalBigNumber("1", 18); // 90 OHM
    const index = new DecimalBigNumber("90", 9); // Index of 90
    expect(gohm.mul(index, 9).toAccurateString()).toEqual("90.0"); // OHM to gOHM
  });

  it("divides numbers correctly", () => {
    // OHM to gOHM
    const ohm = new DecimalBigNumber("90", 9); // 90 OHM
    const index = new DecimalBigNumber("90", 9); // Index of 90
    expect(ohm.div(index, 18).toAccurateString()).toEqual("1.0"); // OHM to gOHM
  });
});
