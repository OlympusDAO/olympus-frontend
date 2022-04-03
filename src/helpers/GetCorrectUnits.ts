import { BigNumber } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";

import { convertGohmToOhm, convertOhmToGohm } from ".";

export const GetCorrectContractUnits = (value: string, asset: string, index: BigNumber | undefined): string => {
  if (isNaN(Number(value)) || value.indexOf("e") != -1 || !index) return "0";

  const [integer, decimals] = value.split(".");

  // We only ever care about the first 9 decimals to prevent underflow errors
  const _value = decimals ? `${integer}.${decimals.substring(0, 9)}` : integer;

  let convertedValue: string;

  if (asset === "gOHM") {
    convertedValue = _value;
  } else {
    convertedValue = formatUnits(convertGohmToOhm(parseUnits(_value), index));
  }

  return convertedValue;
};

export const GetCorrectStaticUnits = (value: string, asset: string, index: BigNumber | undefined): string => {
  if (isNaN(Number(value)) || !index) return "0";

  const [integer, decimals] = value.split(".");

  // We only ever care about the first 9 decimals to prevent underflow errors
  const _value = decimals ? `${integer}.${decimals.substring(0, 9)}` : integer;

  let convertedValue: string;

  if (asset === "sOHM") {
    convertedValue = _value;
  } else {
    convertedValue = formatUnits(convertOhmToGohm(parseUnits(_value), index));
  }

  return convertedValue;
};
