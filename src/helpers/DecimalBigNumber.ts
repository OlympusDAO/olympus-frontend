import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits, parseUnits } from "@ethersproject/units";

import { formatNumber } from ".";

export class DecimalBigNumber {
  private _decimals: number;
  private _number: BigNumber;

  constructor(number: BigNumber | string, decimals: number) {
    this._decimals = decimals;
    this._number = typeof number === "string" ? parseUnits(number, decimals) : number;
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
   * @param precision The number of decimal places to show
   */
  public toFormattedString(precision = this._decimals): string {
    const number = this.toApproxNumber();

    return formatNumber(number, precision);
  }

  /**
   * Adds two numbers
   */
  public add(value: DecimalBigNumber) {
    const difference = value._decimals - this._decimals;

    if (difference === 0) return new DecimalBigNumber(this._number.add(value._number), this._decimals);

    return difference > 0
      ? new DecimalBigNumber(this._number.mul(10 ** Math.abs(difference)).add(value._number), value._decimals)
      : new DecimalBigNumber(this._number.add(value._number.mul(10 ** Math.abs(difference))), this._decimals);
  }
}
