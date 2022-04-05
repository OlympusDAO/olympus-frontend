import { DecimalBigNumber } from "./DecimalBigNumber/DecimalBigNumber";

export const GetCorrectContractUnits = (
  value: string,
  asset: string,
  currentIndex: DecimalBigNumber | undefined,
): DecimalBigNumber => {
  if (isNaN(Number(value)) || value.indexOf("e") != -1 || !currentIndex) return new DecimalBigNumber("0", 18);

  const _value: DecimalBigNumber = new DecimalBigNumber(value, 18);
  let convertedValue: DecimalBigNumber;

  if (asset === "gOHM") {
    convertedValue = _value;
  } else {
    convertedValue = new DecimalBigNumber(_value.mul(currentIndex).toString(), 9);
  }

  return convertedValue;
};

export const GetCorrectStaticUnits = (
  value: string,
  asset: string,
  currentIndex: DecimalBigNumber | undefined,
): DecimalBigNumber => {
  if (isNaN(Number(value)) || !currentIndex) return new DecimalBigNumber("0", 18);

  const _value: DecimalBigNumber = new DecimalBigNumber(value, 9);
  let convertedValue: DecimalBigNumber;

  if (asset === "sOHM") {
    convertedValue = _value;
  } else {
    convertedValue = new DecimalBigNumber(_value.div(currentIndex, 18).toString(), 18);
  }

  return convertedValue;
};
