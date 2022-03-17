import { DecimalBigNumber } from "./DecimalBigNumber";

describe("DecimalBigNumber", () => {
  it("should handle unexpected inputs when initialized", () => {
    expect(new DecimalBigNumber("", 9).toAccurateString()).toEqual("0.0");
    expect(new DecimalBigNumber("      ", 9).toAccurateString()).toEqual("0.0");
    expect(new DecimalBigNumber("text", 1).toAccurateString()).toEqual("0.0");
    expect(new DecimalBigNumber(".0", 1).toAccurateString()).toEqual("0.0");
    expect(new DecimalBigNumber(".", 1).toAccurateString()).toEqual("0.0");
    expect(new DecimalBigNumber("....", 1).toAccurateString()).toEqual("0.0");
    expect(new DecimalBigNumber("1.1.1.1.1", 1).toAccurateString()).toEqual("0.0");
    expect(new DecimalBigNumber("-", 1).toAccurateString()).toEqual("0.0");
    expect(new DecimalBigNumber("-0.", 1).toAccurateString()).toEqual("0.0");
  });

  it("should discard irrelevant precision when initialized", () => {
    expect(new DecimalBigNumber("1.12345678913139872398723", 9).toAccurateString()).toEqual("1.123456789");
  });

  it("should accurately format number to string", () => {
    expect(new DecimalBigNumber(".1", 1).toAccurateString()).toEqual("0.1");
    expect(new DecimalBigNumber("1.1", 9).toAccurateString()).toEqual("1.1");
    expect(new DecimalBigNumber("1.123", 9).toAccurateString()).toEqual("1.123");
    expect(new DecimalBigNumber("-1.123", 9).toAccurateString()).toEqual("-1.123");
  });

  it("should add another number correctly", () => {
    expect(new DecimalBigNumber("1.1", 9).add(new DecimalBigNumber("1.2", 18)).toAccurateString()).toEqual("2.3");
    expect(new DecimalBigNumber("-1.1", 9).add(new DecimalBigNumber("-1.2", 18)).toAccurateString()).toEqual("-2.3");
  });

  it("should subtract another number correctly", () => {
    expect(new DecimalBigNumber("1.2", 9).sub(new DecimalBigNumber("1.1", 18)).toAccurateString()).toEqual("0.1");
    expect(new DecimalBigNumber("1.1", 9).sub(new DecimalBigNumber("1.2", 18)).toAccurateString()).toEqual("-0.1");
  });

  it("should compares the magnitude against another number correctly", () => {
    expect(new DecimalBigNumber("1.1", 9).gt(new DecimalBigNumber("1.2", 18))).toEqual(false);
    expect(new DecimalBigNumber("1.21", 9).gt(new DecimalBigNumber("1.2", 18))).toEqual(true);
  });

  it("should multiply by a number correctly", () => {
    // gOHM to OHM
    const gohm = new DecimalBigNumber("2", 18); // 180 OHM
    const index = new DecimalBigNumber("90", 9); // Index of 90
    expect(gohm.mul(index, 9).toAccurateString()).toEqual("180.0");
    expect(index.mul(gohm, 9).toAccurateString()).toEqual("180.0");
  });

  it("should divide by a number correctly", () => {
    // OHM to gOHM
    const ohm = new DecimalBigNumber("180", 9); // 2 gOHM
    const index = new DecimalBigNumber("90", 9); // Index of 90
    expect(ohm.div(index, 18).toAccurateString()).toEqual("2.0");
    expect(index.div(ohm, 18).toAccurateString()).toEqual("0.5");
  });
});
