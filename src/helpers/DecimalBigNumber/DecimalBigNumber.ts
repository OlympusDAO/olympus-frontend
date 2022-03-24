import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits, parseUnits } from "@ethersproject/units";

import { formatNumber } from "..";

export class DecimalBigNumber {
  private _decimals: number;
  private _number: BigNumber;

  constructor(number: BigNumber | string | number, decimals: number) {
    this._decimals = decimals;

    if (typeof number === "string") {
      const formatted = this._prepareInputString(number, decimals);
      this._number = parseUnits(formatted, decimals);
      return;
    }

    if (typeof number === "number") {
      const formatted = this._prepareInputString(number.toString(), decimals);
      this._number = parseUnits(formatted, decimals);
      return;
    }

    this._number = number;
  }

  private _prepareInputString(number: string, decimals: number): string {
    const _number = number.trim() === "" || isNaN(Number(number)) ? "0" : number;

    return this._omitIrrelevantDecimals(_number, decimals);
  }

  private _omitIrrelevantDecimals(number: string, decimals: number): string {
    const [integer, _decimals] = number.split(".");

    if (!_decimals) return integer;

    return integer + "." + _decimals.substring(0, decimals);
  }

  /**
   * Returns a copy of the current DecimalBigNumber
   *
   * @returns a new instance of DecimalBigNumber
   */
  public copy(): DecimalBigNumber {
    return new DecimalBigNumber(this._number, this._decimals);
  }

  /**
   * Used when performing accurate calculations with
   * the number where precision is important.
   */
  public toBigNumber(): BigNumber {
    return this._number;
  }

  /**
   * Used to display the value accurately to the user
   */
  public toAccurateString(): string {
    return formatUnits(this._number, this._decimals);
  }

  /**
   * Used when performing approximate calculations with
   * the number where precision __is not__ important.
   */
  public toApproxNumber(): number {
    return parseFloat(this.toAccurateString());
  }

  /**
   * Used to display a formatted approximate value to the user
   *
   * @param decimals The number of decimal places to show.
   *                 Defaults to 0 decimal places
   */
  public toFormattedString: {
    (decimals?: number): string;
    (options?: {
      decimals?: number;
      /**
       * Removes unnecessary trailing zeroes from the result.
       * Defaults to `false`
       */
      trimTrailingZeroes?: boolean;
    }): string;
  } = decimalsOrOptions => {
    if (typeof decimalsOrOptions === "object") {
      const options = decimalsOrOptions || {};
      const string = formatNumber(this.toApproxNumber(), options.decimals);

      return options.trimTrailingZeroes ? string.replace(/(?:\.|(\..*?))0+$/, "$1") : string;
    }

    return formatNumber(this.toApproxNumber(), decimalsOrOptions || 0);
  };

  /**
   * Determines if the two values are equal
   *
   * @param value the number to compare against
   */
  public eq(value: DecimalBigNumber): boolean {
    // Normalize precision to the largest of the two values
    const decimals = Math.max(value._decimals, this._decimals);

    // Normalize values to correct precision
    const _this = new DecimalBigNumber(this.toAccurateString(), decimals);
    const _value = new DecimalBigNumber(value.toAccurateString(), decimals);

    return _this._number.eq(_value._number);
  }

  /**
   * Subtracts this number by the value provided
   */
  public sub(value: DecimalBigNumber): DecimalBigNumber {
    // Normalize precision to the largest of the two values
    const decimals = Math.max(value._decimals, this._decimals);

    // Normalize values to correct precision
    const _this = new DecimalBigNumber(this.toAccurateString(), decimals);
    const _value = new DecimalBigNumber(value.toAccurateString(), decimals);

    return new DecimalBigNumber(_this._number.sub(_value._number), decimals);
  }

  /**
   * Adds the value provided to this number
   */
  public add(value: DecimalBigNumber): DecimalBigNumber {
    // Normalize precision to the largest of the two values
    const decimals = Math.max(value._decimals, this._decimals);

    // Normalize values to correct precision
    const _this = new DecimalBigNumber(this.toAccurateString(), decimals);
    const _value = new DecimalBigNumber(value.toAccurateString(), decimals);

    return new DecimalBigNumber(_this._number.add(_value._number), decimals);
  }

  /**
   * Determines if this number is greater than the provided value
   */
  public gt(value: DecimalBigNumber): boolean {
    // Normalize precision to the largest of the two values
    const decimals = Math.max(value._decimals, this._decimals);

    // Normalize values to correct precision
    const _this = new DecimalBigNumber(this.toAccurateString(), decimals);
    const _value = new DecimalBigNumber(value.toAccurateString(), decimals);

    return _this._number.gt(_value._number);
  }

  /**
   * Determines if this number is less than the provided value
   */
  public lt(value: DecimalBigNumber): boolean {
    // Normalize precision to the largest of the two values
    const decimals = Math.max(value._decimals, this._decimals);

    // Normalize values to correct precision
    const _this = new DecimalBigNumber(this.toAccurateString(), decimals);
    const _value = new DecimalBigNumber(value.toAccurateString(), decimals);

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
    return new DecimalBigNumber(normalized.toAccurateString(), decimals);
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
    const _this = new DecimalBigNumber(this.toAccurateString(), _decimals);

    const quotient = _this._number.div(value._number);

    // Return result with the expected precision
    return new DecimalBigNumber(quotient, decimals);
  }
}
