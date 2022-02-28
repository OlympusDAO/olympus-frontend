import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits, parseUnits } from "@ethersproject/units";

import { formatNumber } from "..";

export class DecimalBigNumber {
  private _decimals: number;
  private _number: BigNumber;

  constructor(number: BigNumber | string, decimals: number) {
    this._decimals = decimals;

    if (typeof number === "string") {
      const _number = number.trim() === "" || isNaN(Number(number)) ? "0" : number;

      const formatted = this._omitIrrelevantDecimals(_number, decimals);
      this._number = parseUnits(formatted, decimals);
      return;
    }

    this._number = number;
  }

  private _omitIrrelevantDecimals(number: string, decimals: number) {
    const [integer, _decimals] = number.split(".");

    if (!_decimals) return integer;

    return integer + "." + _decimals.substring(0, decimals);
  }

  /**
   * Use when performing accurate calculations with
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
   * Use when performing approximate calculations with
   * the number where precision __is not__ important.
   */
  public toApproxNumber(): number {
    return parseFloat(this.toAccurateString());
  }

  /**
   * Used to display a formatted approximate value to the user
   * @param decimals The number of decimal places to show
   */
  public toFormattedString(decimals = 0): string {
    return formatNumber(this.toApproxNumber(), decimals);
  }

  /**
   * Subtraacts this number by the value provided
   */
  public sub(value: DecimalBigNumber) {
    const decimals = Math.max(value._decimals, this._decimals);

    // Normalize decimal places
    const _this = new DecimalBigNumber(this.toAccurateString(), decimals);
    const _value = new DecimalBigNumber(value.toAccurateString(), decimals);

    return new DecimalBigNumber(_this._number.sub(_value._number), decimals);
  }
  /**
   * Adds the value provided to this number
   */
  public add(value: DecimalBigNumber) {
    const decimals = Math.max(value._decimals, this._decimals);

    // Normalize decimal places
    const _this = new DecimalBigNumber(this.toAccurateString(), decimals);
    const _value = new DecimalBigNumber(value.toAccurateString(), decimals);

    return new DecimalBigNumber(_this._number.add(_value._number), decimals);
  }

  /**
   * Determines if this number is greater than the provided value
   */
  public gt(value: DecimalBigNumber) {
    const decimals = Math.max(value._decimals, this._decimals);

    // Normalize decimal places
    const _this = new DecimalBigNumber(this.toAccurateString(), decimals);
    const _value = new DecimalBigNumber(value.toAccurateString(), decimals);

    return _this._number.gt(_value._number);
  }

  /**
   * Multiplies this number by the provided value
   * @param decimals The expected number of decimals of the output value
   */
  public mul(value: DecimalBigNumber, decimals: number) {
    const product = new DecimalBigNumber(this._number.mul(value._number), this._decimals + value._decimals);

    return new DecimalBigNumber(product.toAccurateString(), decimals);
  }

  /**
   * Divides this number by the provided value
   * @param decimals The expected number of decimals of the output value
   */
  public div(value: DecimalBigNumber, decimals: number) {
    const _this = new DecimalBigNumber(this.toAccurateString(), decimals + value._decimals);

    const quotient = _this._number.div(value._number);

    return new DecimalBigNumber(quotient, decimals);
  }
}
