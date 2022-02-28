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
});
