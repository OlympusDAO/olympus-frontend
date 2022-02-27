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

  private _normalize(first: DecimalBigNumber, second: DecimalBigNumber): [BigNumber, BigNumber] {
    const difference = first._decimals - second._decimals;

    const _first = first.toBigNumber();
    const _second = second.toBigNumber();

    if (difference === 0) return [_first, _second];

    return difference > 0 ? [_first, _second.mul(10 ** difference)] : [_first.mul(10 ** Math.abs(difference)), _second];
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
    const [_value, _this] = this._normalize(value, this);

    return new DecimalBigNumber(_value.add(_this), Math.max(value._decimals, this._decimals));
  }
}
