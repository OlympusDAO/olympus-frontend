import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

import { GetCorrectContractUnits, GetCorrectStaticUnits } from "../GetCorrectUnits";

describe("GetCorrectUnits", () => {
  it("GetCorrectContractUnits should convert correctly", () => {
    const index1 = new DecimalBigNumber("100", 9);
    expect(GetCorrectContractUnits("1", "gOHM", index1)).toEqual(new DecimalBigNumber("1", 18));
    expect(GetCorrectContractUnits("12.4", "gOHM", index1)).toEqual(new DecimalBigNumber("12.4", 18));
    expect(GetCorrectContractUnits("1", "sOHM", index1)).toEqual(index1);
    expect(GetCorrectContractUnits("12.4", "sOHM", index1)).toEqual(new DecimalBigNumber("1240", 9));
    expect(GetCorrectContractUnits("0.001", "gOHM", index1).toString()).toEqual(
      new DecimalBigNumber("0.001", 18).toString(),
    );
    expect(GetCorrectContractUnits("0.1", "sOHM", index1).toString()).toEqual(new DecimalBigNumber("10", 9).toString());

    const index2 = new DecimalBigNumber("104.3", 9);
    expect(GetCorrectContractUnits("1", "gOHM", index2)).toEqual(new DecimalBigNumber("1", 18));
    expect(GetCorrectContractUnits("12.4", "gOHM", index2)).toEqual(new DecimalBigNumber("12.4", 18));
    expect(GetCorrectContractUnits("1", "sOHM", index2)).toEqual(index2);
    expect(GetCorrectContractUnits("12.4", "sOHM", index2)).toEqual(new DecimalBigNumber("1293.32", 9));
  });

  it("GetCorrectStaticUnits should convert correctly", () => {
    const index1 = new DecimalBigNumber("100", 9);
    expect(GetCorrectStaticUnits("1", "sOHM", index1)).toEqual(new DecimalBigNumber("1", 9));
    expect(GetCorrectStaticUnits("12.4", "sOHM", index1)).toEqual(new DecimalBigNumber("12.4", 9));
    expect(GetCorrectStaticUnits("1", "gOHM", index1)).toEqual(new DecimalBigNumber("0.01", 18));
    expect(GetCorrectStaticUnits("12.4", "gOHM", index1)).toEqual(new DecimalBigNumber("0.124", 18));

    const index2 = new DecimalBigNumber("104.3", 9);
    expect(GetCorrectStaticUnits("1", "sOHM", index2)).toEqual(new DecimalBigNumber("1", 9));
    expect(GetCorrectStaticUnits("12.4", "sOHM", index2)).toEqual(new DecimalBigNumber("12.4", 9));
    expect(GetCorrectStaticUnits("1.043", "gOHM", index2)).toEqual(new DecimalBigNumber("0.01", 18));
    expect(GetCorrectStaticUnits("52.15", "gOHM", index2)).toEqual(new DecimalBigNumber("0.5", 18));
  });
});
