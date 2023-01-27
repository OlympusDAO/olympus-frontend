import { TokenRecord, TokenSupply } from "src/generated/graphql";
import {
  CATEGORY_POL,
  CATEGORY_STABLE,
  CATEGORY_VOLATILE,
  TOKEN_SUPPLY_TYPE_BONDS_DEPOSITS,
  TOKEN_SUPPLY_TYPE_BONDS_PREMINTED,
  TOKEN_SUPPLY_TYPE_BONDS_VESTING_DEPOSITS,
  TOKEN_SUPPLY_TYPE_BONDS_VESTING_TOKENS,
  TOKEN_SUPPLY_TYPE_LIQUIDITY,
  TOKEN_SUPPLY_TYPE_OFFSET,
  TOKEN_SUPPLY_TYPE_TOTAL_SUPPLY,
  TOKEN_SUPPLY_TYPE_TREASURY,
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
 * Returns the sum of balances for different supply types.
 *
 * For example, passing [TOKEN_SUPPLY_TYPE_LIQUIDITY, TOKEN_SUPPLY_TYPE_TREASURY]
 * in the {includedTypes} parameter will return a number that is
 * the sum of the balance property all records with matching types.
 *
 * @param records
 * @param includedTypes
 * @returns
 */
export const getTokenSupplyBalanceForTypes = (records: TokenSupply[], includedTypes: string[]): number => {
  return records
    .filter(record => includedTypes.includes(record.type))
    .reduce((previousValue, record) => previousValue + +record.balance, 0);
};

export const getProtocolOwnedLiquiditySupply = (records: TokenSupply[]): number => {
  return getTokenSupplyBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_LIQUIDITY]);
};

export const getTreasurySupply = (records: TokenSupply[]): number => {
  return getTokenSupplyBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_TREASURY]);
};

export const getMigrationOffsetSupply = (records: TokenSupply[]): number => {
  return getTokenSupplyBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_OFFSET]);
};

export const getBondVestingDepositsSupply = (records: TokenSupply[]): number => {
  return getTokenSupplyBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_BONDS_VESTING_DEPOSITS]);
};

export const getBondVestingTokensSupply = (records: TokenSupply[]): number => {
  return getTokenSupplyBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_BONDS_VESTING_TOKENS]);
};

export const getBondPremintedSupply = (records: TokenSupply[]): number => {
  return getTokenSupplyBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_BONDS_PREMINTED]);
};

export const getBondBurnableDepositsSupply = (records: TokenSupply[]): number => {
  return getTokenSupplyBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_BONDS_DEPOSITS]);
};

export const getExternalSupply = (records: TokenSupply[]): number => {
  return (
    getOhmTotalSupply(records) -
    getProtocolOwnedLiquiditySupply(records) -
    getTreasurySupply(records) -
    getMigrationOffsetSupply(records) -
    getBondVestingDepositsSupply(records) -
    getBondVestingTokensSupply(records) -
    getBondPremintedSupply(records) -
    getBondBurnableDepositsSupply(records)
  );
};

/**
 * For a given array of TokenSupply records (assumed to be at the same point in time),
 * this function returns the OHM circulating supply.
 *
 * Circulating supply is defined as:
 * - OHM total supply
 * - minus: OHM in circulating supply wallets
 * - minus: migration offset
 * - minus: pre-minted OHM for bonds
 * - minus: OHM user deposits for vesting bonds
 *
 * @param records
 * @returns
 */
export const getOhmCirculatingSupply = (records: TokenSupply[]): number => {
  const includedTypes = [
    TOKEN_SUPPLY_TYPE_TOTAL_SUPPLY,
    TOKEN_SUPPLY_TYPE_TREASURY,
    TOKEN_SUPPLY_TYPE_OFFSET,
    TOKEN_SUPPLY_TYPE_BONDS_PREMINTED,
    TOKEN_SUPPLY_TYPE_BONDS_VESTING_DEPOSITS,
  ];

  return records
    .filter(record => includedTypes.includes(record.type))
    .reduce((previousValue, record) => previousValue + +record.supplyBalance, 0);
};

/**
 * For a given array of TokenSupply records (assumed to be at the same point in time),
 * this function returns the OHM floating supply.
 *
 * Floating supply is defined as:
 * - OHM total supply
 * - minus: OHM in circulating supply wallets
 * - minus: migration offset
 * - minus: pre-minted OHM for bonds
 * - minus: OHM user deposits for vesting bonds
 * - minus: protocol-owned OHM in liquidity pools
 *
 * @param records
 * @returns
 */
export const getOhmFloatingSupply = (records: TokenSupply[]): number => {
  const includedTypes = [
    TOKEN_SUPPLY_TYPE_TOTAL_SUPPLY,
    TOKEN_SUPPLY_TYPE_TREASURY,
    TOKEN_SUPPLY_TYPE_OFFSET,
    TOKEN_SUPPLY_TYPE_BONDS_PREMINTED,
    TOKEN_SUPPLY_TYPE_BONDS_VESTING_DEPOSITS,
    TOKEN_SUPPLY_TYPE_LIQUIDITY,
  ];

  return records
    .filter(record => includedTypes.includes(record.type))
    .reduce((previousValue, record) => previousValue + +record.supplyBalance, 0);
};

/**
 * For a given array of TokenSupply records (assumed to be at the same point in time),
 * this function returns the OHM total supply.
 *
 * @param records
 * @returns
 */
export const getOhmTotalSupply = (records: TokenSupply[]): number => {
  return records
    .filter(record => record.type === TOKEN_SUPPLY_TYPE_TOTAL_SUPPLY)
    .reduce((previousValue, record) => previousValue + +record.supplyBalance, 0);
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
