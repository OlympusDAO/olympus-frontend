import { BigNumber } from "@ethersproject/bignumber";
import { commify, formatUnits, parseUnits } from "@ethersproject/units";

import { assert } from "../types/assert";

export class DecimalBigNumber {
  private _precision: number;
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
   * @param precision the number of decimal places supported by the number. If `number` is a string, this parameter is optional.
   * @returns a new, immutable instance of `DecimalBigNumber`
   */
  constructor(value: string, precision?: number);
  constructor(value: BigNumber, precision: number);
  constructor(value: BigNumber | string, precision?: number) {
    if (typeof value === "string") {
      const _value = value.trim() === "" || isNaN(Number(value)) ? "0" : value;
      const _precision = precision === undefined ? this._inferPrecision(value) : this._ensurePositive(precision);
      const formatted = this._setPrecision(_value, _precision);

      this._value = parseUnits(formatted, _precision);
      this._precision = _precision;

      return;
    }

    assert(precision !== undefined, "Decimal cannot be undefined");

    this._value = value;
    this._precision = precision;
  }

  private _inferPrecision(value: string): number {
    const [, precisionOrUndefined] = value.split(".");

    return precisionOrUndefined?.length || 0;
  }

  /**
   * Ensures that the value has the expected precision
   *
   * Trims unnecessary precision
   * Or pads precision if needed
   *
   * @param value Input value as a string
   * @param precision Desired precision
   */
  private _setPrecision(value: string, precision: number): string {
    const [integer, _precisionOrUndefined] = value.split(".");

    const _precision = _precisionOrUndefined || "";

    const paddingRequired = Math.max(0, precision - _precision.length);

    return integer + "." + _precision.substring(0, precision) + "0".repeat(paddingRequired);
  }

  /**
   * Ensures the desired precision is positive
   */
  private _ensurePositive(precision: number) {
    return Math.max(0, precision);
  }

  /**
   * Converts this value to a BigNumber
   *
   * Often used when passing this value as
   * an argument to a contract method
   */
  public toBigNumber(): BigNumber {
    return this._value;
  }

  /**
   * Converts this value to a string
   *
   * By default, the string returned will:
   * - Have the same precision that it was initialised with
   * - Have trailing zeroes removed
   * - Not have thousands separators
   *
   * This ensures that the number string is accurate.
   *
   * To override any of these settings, add the `args` object as a parameter.
   *
   * @param args an object containing any of the properties: precision, trim, format
   * @returns a string version of the number
   */
  public toString({
    precision,
    format = false,
    trim = true,
  }: { precision?: number; trim?: boolean; format?: boolean } = {}): string {
    let result = formatUnits(this._value, this._precision);

    // Add thousands separators
    if (format) result = commify(result);

    // We default to the number of decimal places specified
    const _precision = precision === undefined ? this._precision : this._ensurePositive(precision);
    result = this._setPrecision(result, _precision);

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
   * @param value the va;ie to compare against
   */
  public eq(value: DecimalBigNumber): boolean {
    // Normalize precision to the largest of the two values
    const precision = Math.max(value._precision, this._precision);

    // Normalize values to correct precision
    const _this = new DecimalBigNumber(this.toString(), precision);
    const _value = new DecimalBigNumber(value.toString(), precision);

    return _this._value.eq(_value._value);
  }

  /**
   * Subtracts this value by the value provided
   */
  public sub(value: DecimalBigNumber): DecimalBigNumber {
    // Normalize precision to the largest of the two values
    const precision = Math.max(value._precision, this._precision);

    // Normalize values to correct precision
    const _this = new DecimalBigNumber(this.toString(), precision);
    const _value = new DecimalBigNumber(value.toString(), precision);

    return new DecimalBigNumber(_this._value.sub(_value._value), precision);
  }

  /**
   * Sums this value and the value provided
   */
  public add(value: DecimalBigNumber): DecimalBigNumber {
    // Normalize precision to the largest of the two values
    const precision = Math.max(value._precision, this._precision);

    // Normalize values to correct precision
    const _this = new DecimalBigNumber(this.toString(), precision);
    const _value = new DecimalBigNumber(value.toString(), precision);

    return new DecimalBigNumber(_this._value.add(_value._value), precision);
  }

  /**
   * Determines if this va;ie is greater than the provided value
   */
  public gt(value: DecimalBigNumber): boolean {
    // Normalize precision to the largest of the two values
    const precision = Math.max(value._precision, this._precision);

    // Normalize values to correct precision
    const _this = new DecimalBigNumber(this.toString(), precision);
    const _value = new DecimalBigNumber(value.toString(), precision);

    return _this._value.gt(_value._value);
  }

  /**
   * Determines if this value is less than the provided value
   */
  public lt(value: DecimalBigNumber): boolean {
    // Normalize precision to the largest of the two values
    const precision = Math.max(value._precision, this._precision);

    // Normalize values to correct precision
    const _this = new DecimalBigNumber(this.toString(), precision);
    const _value = new DecimalBigNumber(value.toString(), precision);

    return _this._value.lt(_value._value);
  }

  /**
   * Multiplies this value by the provided value
   */
  public mul(value: DecimalBigNumber): DecimalBigNumber {
    const product = this._value.mul(value._value);

    // Multiplying two BigNumbers produces a product with a decimal
    // value equal to the sum of the decimal values of the two input numbers
    return new DecimalBigNumber(product, this._precision + value._precision);
  }

  /**
   * Divides this value by the provided value
   *
   * By default, this returns a value whose precision is equal
   * to the sum of the precisions of the two values used.
   * If this isn't enough, you can specify a desired
   * precision using the second function argument.
   *
   * @param precision The expected precision of the output value
   */
  public div(value: DecimalBigNumber, precision?: number): DecimalBigNumber {
    const _precision = precision === undefined ? this._precision + value._precision : this._ensurePositive(precision);

    // When we divide two BigNumbers, the result will never
    // include any decimal places because BigNumber only deals
    // with whole integer values. Therefore, in order for us to
    // include precision in our calculation, we need to normalize
    // the precision of the two numbers, such that the difference
    // in precision is equal to the expected precision of the result,
    // before we do the calculation
    //
    // E.g:
    // 22/5 = 4.4
    //
    // But ethers would return:
    // 22/5 = 4 (no precision)
    //
    // So before we calculate, we add n precision to the numerator,
    // where n is the expected precision of the result:
    // 220/5 = 44
    //
    // Normalized to the expected precision of the result
    // 4.4

    const _this = new DecimalBigNumber(this.toString(), _precision + value._precision);

    const quotient = _this._value.div(value._value);

    // Return result with the expected output precision
    return new DecimalBigNumber(quotient, _precision);
  }
}
