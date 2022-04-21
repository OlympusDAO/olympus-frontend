import { BigNumber } from "@ethersproject/bignumber";
import { commify, formatUnits, parseUnits } from "@ethersproject/units";

import { assert } from "../types/assert";

export class DecimalBigNumber {
  private _decimals: number;
  private _value: BigNumber;

  /**
   * Creates a new instance of `DecimalBigNumber`.
   *
   * This class expects and suggests that numbers be handled using `DecimalBigNumber`, instead of the inherently inaccurate
   * use of `number` and `string` types.
   *
   * The constructor accepts the following as inputs to the number parameter:
   * - `BigNumber` (from @ethersproject/bignumber): to easily shift from `BigNumber` used in smart contracts to `DecimalBigNumber`
   * - `string`: to take input from the user
   *
   * Given these design decisions, there are some recommended approaches:
   * - Obtain user input with type text, instead of a number, in order to retain precision. e.g. `<input type="text" />`
   * - Where a `number` value is present, convert it to a `DecimalBigNumber` in the manner the developer deems appropriate. This will most commonly be `new DecimalBigNumber((1000222000.2222).toString(), 4)`. While a convenience method could be offered, it could lead to unexpected behaviour around precision.
   *
   * @param value the BigNumber or string used to initialise the object
   * @param decimals the number of decimal places supported by the number. If `number` is a string, this parameter is optional.
   * @returns a new, immutable instance of `DecimalBigNumber`
   */
  constructor(value: string, decimals?: number);
  constructor(value: BigNumber, decimals: number);
  constructor(value: BigNumber | string, decimals?: number) {
    if (typeof value === "string") {
      const _value = value.trim() === "" || isNaN(Number(value)) ? "0" : value;
      const _decimals = decimals === undefined ? this._inferDecimalAmount(value) : this._ensurePositive(decimals);
      const formatted = this._setDecimalAmount(_value, _decimals);

      this._value = parseUnits(formatted, _decimals);
      this._decimals = _decimals;

      return;
    }

    assert(decimals !== undefined, "Decimal cannot be undefined");

    this._value = value;
    this._decimals = decimals;
  }

  private _inferDecimalAmount(value: string): number {
    const [, decimalStringOrUndefined] = value.split(".");

    return decimalStringOrUndefined?.length || 0;
  }

  /**
   * Sets a value to a specific decimal amount
   *
   * Trims unnecessary decimals
   * Or pads decimals if needed
   *
   * @param value Input value as a string
   * @param decimals Desired decimal amount
   */
  private _setDecimalAmount(value: string, decimals: number): string {
    const [integer, _decimalsOrUndefined] = value.split(".");

    const _decimals = _decimalsOrUndefined || "";

    const paddingRequired = this._ensurePositive(decimals - _decimals.length);

    return integer + "." + _decimals.substring(0, decimals) + "0".repeat(paddingRequired);
  }

  /**
   * Ensures the desired decimal amount is positive
   */
  private _ensurePositive(decimals: number) {
    return Math.max(0, decimals);
  }

  /**
   * Converts this value to a BigNumber
   *
   * Often used when passing this value as
   * an argument to a contract method
   */
  public toBigNumber(decimals?: number): BigNumber {
    return decimals === undefined ? this._value : new DecimalBigNumber(this.toString(), decimals)._value;
  }

  /**
   * Converts this value to a string
   *
   * By default, the string returned will:
   * - Have the same decimal amount that it was initialised with
   * - Have trailing zeroes removed
   * - Not have thousands separators
   *
   * This ensures that the number string is accurate.
   *
   * To override any of these settings, add the `args` object as a parameter.
   *
   * @param args an object containing any of the properties: decimals, trim, format
   * @returns a string version of the number
   */
  public toString({
    decimals,
    trim = true,
    format = false,
  }: {
    trim?: boolean;
    format?: boolean;
    decimals?: number;
  } = {}): string {
    let result = formatUnits(this._value, this._decimals);

    // Add thousands separators
    if (format) result = commify(result);

    // We default to the number of decimal places specified
    const _decimals = decimals === undefined ? this._decimals : this._ensurePositive(decimals);
    result = this._setDecimalAmount(result, _decimals);

    // We default to trimming trailing zeroes (and decimal points), unless there is an override
    if (trim) result = result.replace(/(?:\.|(\..*?))\.?0*$/, "$1");

    return result;
  }

  /**
   * @deprecated
   * Please avoid using this method.
   * If used for calculations: rather than converting this DecimalBigNumber
   * "down" to a number, convert the other number "up" to a DecimalBigNumber.
   *
   * Used when performing approximate calculations with
   * the number where precision __is not__ important.
   */
  public toApproxNumber(): number {
    return parseFloat(this.toString());
  }

  /**
   * Determines if the two values are equal
   */
  public eq(value: DecimalBigNumber | string): boolean {
    const valueAsDBN = value instanceof DecimalBigNumber ? value : new DecimalBigNumber(value);

    // Normalize decimals to the largest of the two values
    const largestDecimalAmount = Math.max(valueAsDBN._decimals, this._decimals);

    // Normalize values to the correct decimal amount
    const normalisedThis = new DecimalBigNumber(this.toString(), largestDecimalAmount);
    const normalisedValue = new DecimalBigNumber(valueAsDBN.toString(), largestDecimalAmount);

    return normalisedThis._value.eq(normalisedValue._value);
  }

  /**
   * Subtracts this value by the value provided
   */
  public sub(value: DecimalBigNumber | string): DecimalBigNumber {
    const valueAsDBN = value instanceof DecimalBigNumber ? value : new DecimalBigNumber(value);

    // Normalize decimals to the largest of the two values
    const largestDecimalAmount = Math.max(valueAsDBN._decimals, this._decimals);

    // Normalize values to the correct decimal amount
    const normalisedThis = new DecimalBigNumber(this.toString(), largestDecimalAmount);
    const normalisedValue = new DecimalBigNumber(valueAsDBN.toString(), largestDecimalAmount);

    return new DecimalBigNumber(normalisedThis._value.sub(normalisedValue._value), largestDecimalAmount);
  }

  /**
   * Sums this value and the value provided
   */
  public add(value: DecimalBigNumber | string): DecimalBigNumber {
    const valueAsDBN = value instanceof DecimalBigNumber ? value : new DecimalBigNumber(value);

    // Normalize decimals to the largest of the two values
    const largestDecimalAmount = Math.max(valueAsDBN._decimals, this._decimals);

    // Normalize values to the correct decimal amount
    const normalisedThis = new DecimalBigNumber(this.toString(), largestDecimalAmount);
    const normalisedValue = new DecimalBigNumber(valueAsDBN.toString(), largestDecimalAmount);

    return new DecimalBigNumber(normalisedThis._value.add(normalisedValue._value), largestDecimalAmount);
  }

  /**
   * Determines if this value is greater than the provided value
   */
  public gt(value: DecimalBigNumber | string): boolean {
    const valueAsDBN = value instanceof DecimalBigNumber ? value : new DecimalBigNumber(value);

    // Normalize decimals to the largest of the two values
    const largestDecimalAmount = Math.max(valueAsDBN._decimals, this._decimals);

    // Normalize values to the correct decimal amount
    const normalisedThis = new DecimalBigNumber(this.toString(), largestDecimalAmount);
    const normalisedValue = new DecimalBigNumber(valueAsDBN.toString(), largestDecimalAmount);

    return normalisedThis._value.gt(normalisedValue._value);
  }

  /**
   * Determines if this value is less than the provided value
   */
  public lt(value: DecimalBigNumber | string): boolean {
    const valueAsDBN = value instanceof DecimalBigNumber ? value : new DecimalBigNumber(value);

    // Normalize decimals to the largest of the two values
    const largestDecimalAmount = Math.max(valueAsDBN._decimals, this._decimals);

    // Normalize values to the correct decimal amount
    const normalisedThis = new DecimalBigNumber(this.toString(), largestDecimalAmount);
    const normalisedValue = new DecimalBigNumber(valueAsDBN.toString(), largestDecimalAmount);

    return normalisedThis._value.lt(normalisedValue._value);
  }

  /**
   * Multiplies this value by the provided value
   */
  public mul(value: DecimalBigNumber | string): DecimalBigNumber {
    const valueAsDBN = value instanceof DecimalBigNumber ? value : new DecimalBigNumber(value);

    const product = this._value.mul(valueAsDBN._value);

    // Multiplying two BigNumbers produces a product with a decimal
    // amount equal to the sum of the decimal amounts of the two input numbers
    return new DecimalBigNumber(product, this._decimals + valueAsDBN._decimals);
  }

  /**
   * Divides this value by the provided value
   *
   * By default, this returns a value whose decimal amount is equal
   * to the sum of the decimal amounts of the two values used.
   * If this isn't enough, you can specify a desired
   * decimal amount using the second function argument.
   *
   * @param decimals The expected decimal amount of the output value
   */
  public div(value: DecimalBigNumber | string, decimals?: number): DecimalBigNumber {
    const valueAsDBN = value instanceof DecimalBigNumber ? value : new DecimalBigNumber(value);

    const _decimals = decimals === undefined ? this._decimals + valueAsDBN._decimals : this._ensurePositive(decimals);

    // When we divide two BigNumbers, the result will never
    // include any decimal places because BigNumber only deals
    // with whole integer values. Therefore, in order for us to
    // include a specific decimal amount in our calculation, we need to
    // normalize the decimal amount of the two numbers, such that the difference
    // in their decimal amount is equal to the expected decimal amount
    // of the result, before we do the calculation
    //
    // E.g:
    // 22/5 = 4.4
    //
    // But ethers would return:
    // 22/5 = 4 (no decimals)
    //
    // So before we calculate, we add n padding zeros to the
    // numerator, where n is the expected decimal amount of the result:
    // 220/5 = 44
    //
    // Normalized to the expected decimal amount of the result
    // 4.4

    const normalisedThis = new DecimalBigNumber(this.toString(), _decimals + valueAsDBN._decimals);

    const quotient = normalisedThis._value.div(valueAsDBN._value);

    // Return result with the expected output decimal amount
    return new DecimalBigNumber(quotient, _decimals);
  }
}
