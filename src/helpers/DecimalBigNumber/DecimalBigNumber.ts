import { BigNumber } from "@ethersproject/bignumber";
import { commify, formatUnits, parseUnits } from "@ethersproject/units";

import { assert } from "../types/assert";

export class DecimalBigNumber {
  private _decimals: number;
  private _number: BigNumber;

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
   * @param number the BigNumber or string used to initialise the object
   * @param decimals the number of decimal places supported by the number. If `number` is a string, this parameter is optional.
   * @returns a new, immutable instance of `DecimalBigNumber`
   */
  constructor(number: BigNumber, decimals: number);
  constructor(number: string, decimals?: number);
  constructor(number: BigNumber | string, decimals?: number) {
    if (typeof number === "string") {
      const _number = number.trim() === "" || isNaN(Number(number)) ? "0" : number;
      const stringDecimals = decimals === undefined ? this._inferDecimalAmount(number) : decimals;
      const formatted = this._setDecimalAmount(_number, stringDecimals);
      this._number = parseUnits(formatted, stringDecimals);
      this._decimals = stringDecimals;
      return;
    }

    assert(decimals, "Decimal cannot be undefined if we reach here, not sure why TS can't pick this up");

    this._number = number;
    this._decimals = decimals;
  }

  private _inferDecimalAmount(number: string): number {
    const [, decimalsOrUndefined] = number.split(".");

    return decimalsOrUndefined?.length || 0;
  }

  /**
   * Ensures that the number has the expected number of decimal places
   *
   * Trims unnecessary decimals places
   * Or pads decimals if needed
   *
   * @param number input number string
   * @param decimals number of decimal places
   */
  private _setDecimalAmount(number: string, decimals: number): string {
    const [integer, _decimalsOrUndefined] = number.split(".");

    const _decimals = _decimalsOrUndefined || "";

    const paddedDecimalsRequired = decimals > _decimals.length ? decimals - _decimals.length : 0;

    return integer + "." + _decimals.substring(0, decimals) + "0".repeat(paddedDecimalsRequired);
  }

  /**
   * Used when performing accurate calculations with
   * the number where precision is important.
   */
  public toBigNumber(): BigNumber {
    return this._number;
  }

  /**
   * Converts the number to a string
   *
   * By default, the string returned will:
   * - Have the same number of decimal places that it was initialised with
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
    format = false,
    trim = true,
  }: { decimals?: number; trim?: boolean; format?: boolean } = {}): string {
    if (decimals !== undefined && decimals < 0) throw new Error("The decimals parameter must be 0 or positive");

    let result = formatUnits(this._number, this._decimals);

    // Add thousands separators
    if (format) result = commify(result);

    // We default to the number of decimal places specified
    result = this._setDecimalAmount(result, decimals === undefined ? this._decimals : decimals);

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
   *
   * @param value the number to compare against
   */
  public eq(value: DecimalBigNumber): boolean {
    // Normalize precision to the largest of the two values
    const decimals = Math.max(value._decimals, this._decimals);

    // Normalize values to correct precision
    const _this = new DecimalBigNumber(this.toString(), decimals);
    const _value = new DecimalBigNumber(value.toString(), decimals);

    return _this._number.eq(_value._number);
  }

  /**
   * Subtracts this number by the value provided
   */
  public sub(value: DecimalBigNumber): DecimalBigNumber {
    // Normalize precision to the largest of the two values
    const decimals = Math.max(value._decimals, this._decimals);

    // Normalize values to correct precision
    const _this = new DecimalBigNumber(this.toString(), decimals);
    const _value = new DecimalBigNumber(value.toString(), decimals);

    return new DecimalBigNumber(_this._number.sub(_value._number), decimals);
  }

  /**
   * Adds the value provided to this number
   */
  public add(value: DecimalBigNumber): DecimalBigNumber {
    // Normalize precision to the largest of the two values
    const decimals = Math.max(value._decimals, this._decimals);

    // Normalize values to correct precision
    const _this = new DecimalBigNumber(this.toString(), decimals);
    const _value = new DecimalBigNumber(value.toString(), decimals);

    return new DecimalBigNumber(_this._number.add(_value._number), decimals);
  }

  /**
   * Determines if this number is greater than the provided value
   */
  public gt(value: DecimalBigNumber): boolean {
    // Normalize precision to the largest of the two values
    const decimals = Math.max(value._decimals, this._decimals);

    // Normalize values to correct precision
    const _this = new DecimalBigNumber(this.toString(), decimals);
    const _value = new DecimalBigNumber(value.toString(), decimals);

    return _this._number.gt(_value._number);
  }

  /**
   * Determines if this number is less than the provided value
   */
  public lt(value: DecimalBigNumber): boolean {
    // Normalize precision to the largest of the two values
    const decimals = Math.max(value._decimals, this._decimals);

    // Normalize values to correct precision
    const _this = new DecimalBigNumber(this.toString(), decimals);
    const _value = new DecimalBigNumber(value.toString(), decimals);

    return _this._number.lt(_value._number);
  }

  /**
   * Multiplies this number by the provided value
   * @param decimals The expected number of decimals of the output value
   */
  public mul(value: DecimalBigNumber, decimals: number): DecimalBigNumber {
    const product = this._number.mul(value._number);

    // Multiplying two BigNumbers produces a product whose precision
    // is the sum of the precisions of the two input numbers
    const _decimals = this._decimals + value._decimals;

    // Normalize the product
    const normalized = new DecimalBigNumber(product, _decimals);

    // Return result with the expected precision
    return new DecimalBigNumber(normalized.toString(), decimals);
  }

  /**
   * Divides this number by the provided value
   * @param decimals The expected number of decimals of the output value
   */
  public div(value: DecimalBigNumber, decimals: number): DecimalBigNumber {
    // When we divide two BigNumbers, the result will never
    // include any decimal places because BigNumber only deals
    // with whole integer values. Therefore, in order for us to
    // include precision in our calculation, we need to normalize
    // the precision of the two numbers, such that the difference
    // in precision is equal to the expected precision of the result.
    const _decimals = decimals + value._decimals;

    // Normalize according to the resultant precision calculated earlier
    const _this = new DecimalBigNumber(this.toString(), _decimals);

    const quotient = _this._number.div(value._number);

    // Return result with the expected precision
    return new DecimalBigNumber(quotient, decimals);
  }
}
