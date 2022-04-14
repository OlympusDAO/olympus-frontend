import { removeTrailingZeros } from "../checkDecimalLength";

describe("removeTrailingZeros", () => {
  it("Should remove all but one trailing zeros", () => {
    expect(removeTrailingZeros("000000")).toEqual("0");
  });

  it("Should remove all trailing zeros when there is a non-zero value", () => {
    expect(removeTrailingZeros("01000")).toEqual("01");
  });
});
