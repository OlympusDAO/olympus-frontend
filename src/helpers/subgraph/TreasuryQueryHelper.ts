import { GOHM_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import { TokenRecord, TokenSupply } from "src/generated/graphql";
import {
  CATEGORY_POL,
  CATEGORY_STABLE,
  CATEGORY_VOLATILE,
  TOKEN_SUPPLY_TYPE_BONDS_DEPOSITS,
  TOKEN_SUPPLY_TYPE_BONDS_PREMINTED,
  TOKEN_SUPPLY_TYPE_BONDS_VESTING_DEPOSITS,
  TOKEN_SUPPLY_TYPE_BONDS_VESTING_TOKENS,
  TOKEN_SUPPLY_TYPE_BOOSTED_LIQUIDITY_VAULT,
  TOKEN_SUPPLY_TYPE_LENDING,
  TOKEN_SUPPLY_TYPE_LIQUIDITY,
  TOKEN_SUPPLY_TYPE_OFFSET,
  TOKEN_SUPPLY_TYPE_TOTAL_SUPPLY,
  TOKEN_SUPPLY_TYPE_TREASURY,
} from "src/helpers/subgraph/Constants";

export const getLiquidBackingPerOhmBacked = (liquidBacking: number, tokenSupplies: TokenSupply[], ohmIndex: number) =>
  liquidBacking / getOhmBackedSupply(tokenSupplies, ohmIndex);

export const getLiquidBackingPerOhmFloating = (liquidBacking: number, tokenSupplies: TokenSupply[], ohmIndex: number) =>
  liquidBacking / getOhmFloatingSupply(tokenSupplies, ohmIndex);

export const getLiquidBackingPerGOhmSynthetic = (
  liquidBacking: number,
  currentIndex: number,
  tokenSupplies: TokenSupply[],
) => liquidBacking / getGOhmSyntheticSupply(currentIndex, getOhmBackedSupply(tokenSupplies, currentIndex));

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

let supportedTokens: string[];

const getOhmAddresses = (): string[] => {
  return Object.values(OHM_ADDRESSES).map(address => address.toLowerCase());
};

const getGOhmAddresses = (): string[] => {
  return Object.values(GOHM_ADDRESSES).map(address => address.toLowerCase());
};

const getSupportedTokens = (): string[] => {
  if (!supportedTokens) {
    const tokens: string[] = [];
    tokens.push(...getOhmAddresses());
    tokens.push(...getGOhmAddresses());

    supportedTokens = tokens;
  }

  return supportedTokens;
};

const isSupportedToken = (record: TokenSupply) => {
  if (!getSupportedTokens().includes(record.tokenAddress.toLocaleLowerCase())) {
    return false;
  }

  return true;
};

const getBalanceMultiplier = (record: TokenSupply, ohmIndex: number): number => {
  if (getOhmAddresses().includes(record.tokenAddress.toLowerCase())) {
    return 1;
  }

  if (getGOhmAddresses().includes(record.tokenAddress.toLowerCase())) {
    return ohmIndex;
  }

  throw new Error(`Unsupported token address: ${record.tokenAddress}`);
};

/**
 * Returns the sum of balances for different supply types.
 *
 * Note that this will return positive balances for each type.
 *
 * For example, passing [TOKEN_SUPPLY_TYPE_LIQUIDITY, TOKEN_SUPPLY_TYPE_TREASURY]
 * in the {includedTypes} parameter will return a number that is
 * the sum of the balance property all records with matching types.
 *
 * @param records
 * @param includedTypes
 * @returns
 */
const getBalanceForTypes = (records: TokenSupply[], includedTypes: string[], ohmIndex: number): number => {
  return records
    .filter(record => isSupportedToken(record) && includedTypes.includes(record.type))
    .reduce((previousValue, record) => previousValue + +record.balance * getBalanceMultiplier(record, ohmIndex), 0);
};

/**
 * Returns the sum of balances for different supply types.
 *
 * Note that this will return positive or negative balances, depending on the type.
 *
 * For example, passing [TOKEN_SUPPLY_TYPE_LIQUIDITY, TOKEN_SUPPLY_TYPE_TREASURY]
 * in the {includedTypes} parameter will return a number that is
 * the sum of the supplyBalance property all records with matching types.
 *
 * @param records
 * @param includedTypes
 * @returns
 */
const getSupplyBalanceForTypes = (records: TokenSupply[], includedTypes: string[], ohmIndex: number): number => {
  return records
    .filter(record => isSupportedToken(record) && includedTypes.includes(record.type))
    .reduce(
      (previousValue, record) => previousValue + +record.supplyBalance * getBalanceMultiplier(record, ohmIndex),
      0,
    );
};

export const getProtocolOwnedLiquiditySupply = (records: TokenSupply[], ohmIndex: number): number => {
  return getBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_LIQUIDITY], ohmIndex);
};

export const getTreasurySupply = (records: TokenSupply[], ohmIndex: number): number => {
  return getBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_TREASURY], ohmIndex);
};

export const getMigrationOffsetSupply = (records: TokenSupply[], ohmIndex: number): number => {
  return getBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_OFFSET], ohmIndex);
};

export const getBondDepositsSupply = (records: TokenSupply[], ohmIndex: number): number => {
  return getBalanceForTypes(
    records,
    [TOKEN_SUPPLY_TYPE_BONDS_VESTING_DEPOSITS, TOKEN_SUPPLY_TYPE_BONDS_DEPOSITS],
    ohmIndex,
  );
};

export const getBondVestingTokensSupply = (records: TokenSupply[], ohmIndex: number): number => {
  return getBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_BONDS_VESTING_TOKENS], ohmIndex);
};

export const getLendingSupply = (records: TokenSupply[], ohmIndex: number): number => {
  return getBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_LENDING], ohmIndex);
};

export const getBondPremintedSupply = (records: TokenSupply[], ohmIndex: number): number => {
  return getBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_BONDS_PREMINTED], ohmIndex);
};

export const getBoostedLiquidityVaultSupply = (records: TokenSupply[], ohmIndex: number): number => {
  return getBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_BOOSTED_LIQUIDITY_VAULT], ohmIndex);
};

export const getExternalSupply = (records: TokenSupply[], ohmIndex: number): number => {
  return (
    getOhmTotalSupply(records, ohmIndex) -
    getProtocolOwnedLiquiditySupply(records, ohmIndex) -
    getTreasurySupply(records, ohmIndex) -
    getMigrationOffsetSupply(records, ohmIndex) -
    getBondDepositsSupply(records, ohmIndex) -
    getBondVestingTokensSupply(records, ohmIndex) -
    getBondPremintedSupply(records, ohmIndex) -
    getLendingSupply(records, ohmIndex) -
    getBoostedLiquidityVaultSupply(records, ohmIndex)
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
 * - minus: OHM user deposits for bonds
 *
 * @param records
 * @returns
 */
export const getOhmCirculatingSupply = (records: TokenSupply[], ohmIndex: number): number => {
  const includedTypes = [
    TOKEN_SUPPLY_TYPE_TOTAL_SUPPLY,
    TOKEN_SUPPLY_TYPE_TREASURY,
    TOKEN_SUPPLY_TYPE_OFFSET,
    TOKEN_SUPPLY_TYPE_BONDS_PREMINTED,
    TOKEN_SUPPLY_TYPE_BONDS_VESTING_DEPOSITS,
    TOKEN_SUPPLY_TYPE_BONDS_DEPOSITS,
    TOKEN_SUPPLY_TYPE_BOOSTED_LIQUIDITY_VAULT,
  ];

  return getSupplyBalanceForTypes(records, includedTypes, ohmIndex);
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
 * - minus: OHM user deposits for bonds
 * - minus: protocol-owned OHM in liquidity pools
 *
 * @param records
 * @returns
 */
export const getOhmFloatingSupply = (records: TokenSupply[], ohmIndex: number): number => {
  const includedTypes = [
    TOKEN_SUPPLY_TYPE_TOTAL_SUPPLY,
    TOKEN_SUPPLY_TYPE_TREASURY,
    TOKEN_SUPPLY_TYPE_OFFSET,
    TOKEN_SUPPLY_TYPE_BONDS_PREMINTED,
    TOKEN_SUPPLY_TYPE_BONDS_VESTING_DEPOSITS,
    TOKEN_SUPPLY_TYPE_BONDS_DEPOSITS,
    TOKEN_SUPPLY_TYPE_BOOSTED_LIQUIDITY_VAULT,
    TOKEN_SUPPLY_TYPE_LIQUIDITY,
  ];

  return getSupplyBalanceForTypes(records, includedTypes, ohmIndex);
};

/**
 * For a given array of TokenSupply records (assumed to be at the same point in time),
 * this function returns the OHM backed supply.
 *
 * Backed supply is the quantity of OHM backed by treasury assets.
 *
 * Backed supply is calculated as:
 * - OHM total supply
 * - minus: OHM in circulating supply wallets
 * - minus: migration offset
 * - minus: pre-minted OHM for bonds
 * - minus: OHM user deposits for bonds
 * - minus: protocol-owned OHM in liquidity pools
 * - minus: OHM minted and deployed into lending markets
 */
export const getOhmBackedSupply = (records: TokenSupply[], ohmIndex: number): number => {
  const includedTypes = [
    TOKEN_SUPPLY_TYPE_TOTAL_SUPPLY,
    TOKEN_SUPPLY_TYPE_TREASURY,
    TOKEN_SUPPLY_TYPE_OFFSET,
    TOKEN_SUPPLY_TYPE_BONDS_PREMINTED,
    TOKEN_SUPPLY_TYPE_BONDS_VESTING_DEPOSITS,
    TOKEN_SUPPLY_TYPE_BONDS_DEPOSITS,
    TOKEN_SUPPLY_TYPE_BOOSTED_LIQUIDITY_VAULT,
    TOKEN_SUPPLY_TYPE_LIQUIDITY,
    TOKEN_SUPPLY_TYPE_LENDING,
  ];

  return getSupplyBalanceForTypes(records, includedTypes, ohmIndex);
};

/**
 * For a given array of TokenSupply records (assumed to be at the same point in time),
 * this function returns the OHM total supply.
 *
 * @param records
 * @returns
 */
export const getOhmTotalSupply = (records: TokenSupply[], ohmIndex: number): number => {
  return getSupplyBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_TOTAL_SUPPLY], ohmIndex);
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
