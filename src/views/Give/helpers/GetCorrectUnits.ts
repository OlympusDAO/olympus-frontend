import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";

import { GIVE_MAX_DECIMALS } from "../constants";

/**
 * @notice Helper function to convert units from Give contract into correct units for the user based
 * on the given token symbol. If the given token symbol is gOHM, we return the value back, but as
 * a DecimalBigNumber. If the given token symbol is sOHM, we convert gOHM to sOHM based on the
 * passed index and return the value back as a DecimalBigNumber.
 * @param value String. The value to convert
 * @param asset String. The token symbol to convert to
 * @param currentIndex DecimalBigNumber | undefined. Current sOHM index
 * @returns DecimalBigNumber
 */
export const GetCorrectContractUnits = (
  value: string,
  asset: string,
  currentIndex: DecimalBigNumber | undefined,
): DecimalBigNumber => {
  // If the value is NaN, or contains an "e" (meaning that it is a tiny, scientific notation number), or
  // current index has not yet been defined, return a 0 DecimalBigNumber
  if (isNaN(Number(value)) || value.indexOf("e") != -1 || !currentIndex) return new DecimalBigNumber("0", 18);

  // Set passed value to 18 decimal place DecimalBigNumber and define return type
  const _value: DecimalBigNumber = new DecimalBigNumber(value, 18);
  let convertedValue: DecimalBigNumber;

  if (asset === "gOHM") {
    convertedValue = _value;
  } else {
    // Multiply the value by the current index and set to a DecimalBigNumber with 9 decimal places
    convertedValue = new DecimalBigNumber(_value.mul(currentIndex).toString(), GIVE_MAX_DECIMALS);
  }

  // Return the converted value
  return convertedValue;
};

/**
 * Helper function to convert units from various storage locations (projects.json for example) into
 * correct units for the user based on the given token symbol. If the given token symbol is sOHM,
 * we return the value back, but as a DecimalBigNumber. If the given token symbol is gOHM, we convert
 * sOHM to gOHM based on the passed index and return the value back as a DecimalBigNumber.
 * @param value String. The value to convert
 * @param asset String. The token symbol to convert to
 * @param currentIndex DecimalBigNumber | undefined. Current sOHM index
 * @returns DecimalBigNumber
 */
export const GetCorrectStaticUnits = (
  value: string,
  asset: string,
  currentIndex: DecimalBigNumber | undefined,
): DecimalBigNumber => {
  // If the value is NaN, or current index has not yet been defined, return a 0 DecimalBigNumber
  if (isNaN(Number(value)) || !currentIndex) return new DecimalBigNumber("0", 18);

  // Set passed value to 9 decimal place DecimalBigNumber and define return type
  const _value: DecimalBigNumber = new DecimalBigNumber(value, GIVE_MAX_DECIMALS);
  let convertedValue: DecimalBigNumber;

  if (asset === "sOHM") {
    convertedValue = _value;
  } else {
    // Divide the value by the current index and set to a DecimalBigNumber with 18 decimal places
    convertedValue = new DecimalBigNumber(_value.div(currentIndex, 18).toString(), 18);
  }

  // Return the converted value
  return convertedValue;
};
