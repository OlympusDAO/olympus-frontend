import { TokenRecord, TokenSupply } from "src/generated/graphql";
import {
  CATEGORY_POL,
  CATEGORY_STABLE,
  CATEGORY_VOLATILE,
  TOKEN_SUPPLY_TYPE_LIQUIDITY,
} from "src/helpers/subgraph/Constants";

export const getLiquidBackingPerOhmFloating = (liquidBacking: number, tokenSupplies: TokenSupply[]) =>
  liquidBacking / getOhmFloatingSupply(tokenSupplies);

export const getLiquidBackingPerGOhmSynthetic = (
  liquidBacking: number,
  currentIndex: number,
  tokenSupplies: TokenSupply[],
) => liquidBacking / getGOhmSyntheticSupply(currentIndex, getOhmFloatingSupply(tokenSupplies));

export const filterReduce = (
  records: TokenRecord[],
  filterPredicate: (value: TokenRecord) => unknown,
  valueExcludingOhm = false,
): number => {
  return records.filter(filterPredicate).reduce((previousValue, currentRecord) => {
    return previousValue + (valueExcludingOhm ? +currentRecord.valueExcludingOhm : +currentRecord.value);
  }, 0);
};

export const getTreasuryAssetValue = (
  records: TokenRecord[],
  liquidBacking: boolean,
  categories = [CATEGORY_STABLE, CATEGORY_VOLATILE, CATEGORY_POL],
): number => {
  if (liquidBacking) {
    return filterReduce(records, record => categories.includes(record.category) && record.isLiquid == true, true);
  }

  return filterReduce(records, record => categories.includes(record.category), false);
};

/**
 * For a given array of TokenSupply records (assumed to be at the same point in time),
 * this function returns the OHM circulating supply.
 *
 * Circulating supply is defined as:
 * - OHM total supply
 * - minus: OHM in treasury wallets
 * - minus: migration offset
 *
 * In practice, this is everything except OHM in liquidity pools.
 *
 * @param records
 * @returns
 */
export const getOhmCirculatingSupply = (records: TokenSupply[]): number => {
  return records
    .filter(record => record.type !== TOKEN_SUPPLY_TYPE_LIQUIDITY)
    .reduce((previousValue, record) => previousValue + +record.supplyBalance, 0);
};

/**
 * For a given array of TokenSupply records (assumed to be at the same point in time),
 * this function returns the OHM circulating supply.
 *
 * Circulating supply is defined as:
 * - OHM total supply
 * - minus: OHM in treasury wallets
 * - minus: migration offset
 * - minus: OHM in liquidity pools
 *
 * @param records
 * @returns
 */
export const getOhmFloatingSupply = (records: TokenSupply[]): number => {
  return records.reduce((previousValue, record) => previousValue + +record.supplyBalance, 0);
};

/**
 * gOHM circulating supply is synthetically calculated as:
 *
 * OHM floating supply / current index
 *
 * @param currentIndex
 * @param ohmFloatingSupply
 * @returns
 */
export const getGOhmSyntheticSupply = (currentIndex: number, ohmFloatingSupply: number) =>
  ohmFloatingSupply / currentIndex;
