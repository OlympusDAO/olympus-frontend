import { GOHM_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import {
  CATEGORY_POL,
  CATEGORY_STABLE,
  CATEGORY_VOLATILE,
  CHAIN_ETHEREUM,
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
import { TokenRecord, TokenSupply } from "src/hooks/useFederatedSubgraphQuery";

export const getLiquidBackingPerOhmBacked = (liquidBacking: number, tokenSupplies: TokenSupply[], ohmIndex: number) =>
  liquidBacking / getOhmBackedSupply(tokenSupplies, ohmIndex)[0];

export const getLiquidBackingPerOhmFloating = (liquidBacking: number, tokenSupplies: TokenSupply[], ohmIndex: number) =>
  liquidBacking / getOhmFloatingSupply(tokenSupplies, ohmIndex)[0];

export const getLiquidBackingPerGOhmSynthetic = (
  liquidBacking: number,
  currentIndex: number,
  tokenSupplies: TokenSupply[],
) => liquidBacking / getGOhmSyntheticSupply(currentIndex, getOhmBackedSupply(tokenSupplies, currentIndex)[0]);

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
  if (!getSupportedTokens().includes(record.tokenAddress.toLowerCase())) {
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
 * @param records TokenSupply records for the given day
 * @param ohmIndex The index of OHM for the given day
 * @param includedTypes
 * @returns [balance, included records]
 */
const getBalanceForTypes = (
  records: TokenSupply[],
  includedTypes: string[],
  ohmIndex: number,
): [number, TokenSupply[]] => {
  const filteredRecords = records.filter(record => isSupportedToken(record) && includedTypes.includes(record.type));
  const balance = filteredRecords.reduce(
    (previousValue, record) => previousValue + +record.balance * getBalanceMultiplier(record, ohmIndex),
    0,
  );

  return [balance, filteredRecords];
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
 * @param records TokenSupply records for the given day
 * @param ohmIndex The index of OHM for the given day
 * @param includedTypes
 * @returns [balance, included records]
 */
const getSupplyBalanceForTypes = (
  records: TokenSupply[],
  includedTypes: string[],
  ohmIndex: number,
): [number, TokenSupply[]] => {
  const filteredRecords = records.filter(record => isSupportedToken(record) && includedTypes.includes(record.type));

  const supplyBalance = filteredRecords.reduce(
    (previousValue, record) => previousValue + +record.supplyBalance * getBalanceMultiplier(record, ohmIndex),
    0,
  );

  return [supplyBalance, filteredRecords];
};

export const getProtocolOwnedLiquiditySupply = (records: TokenSupply[], ohmIndex: number): [number, TokenSupply[]] => {
  return getBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_LIQUIDITY], ohmIndex);
};

export const getTreasurySupply = (records: TokenSupply[], ohmIndex: number): [number, TokenSupply[]] => {
  return getBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_TREASURY], ohmIndex);
};

export const getMigrationOffsetSupply = (records: TokenSupply[], ohmIndex: number): [number, TokenSupply[]] => {
  return getBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_OFFSET], ohmIndex);
};

export const getBondDepositsSupply = (records: TokenSupply[], ohmIndex: number): [number, TokenSupply[]] => {
  return getBalanceForTypes(
    records,
    [TOKEN_SUPPLY_TYPE_BONDS_VESTING_DEPOSITS, TOKEN_SUPPLY_TYPE_BONDS_DEPOSITS],
    ohmIndex,
  );
};

export const getBondVestingTokensSupply = (records: TokenSupply[], ohmIndex: number): [number, TokenSupply[]] => {
  return getBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_BONDS_VESTING_TOKENS], ohmIndex);
};

export const getLendingSupply = (records: TokenSupply[], ohmIndex: number): [number, TokenSupply[]] => {
  return getBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_LENDING], ohmIndex);
};

export const getBondPremintedSupply = (records: TokenSupply[], ohmIndex: number): [number, TokenSupply[]] => {
  return getBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_BONDS_PREMINTED], ohmIndex);
};

export const getBoostedLiquidityVaultSupply = (records: TokenSupply[], ohmIndex: number): [number, TokenSupply[]] => {
  return getBalanceForTypes(records, [TOKEN_SUPPLY_TYPE_BOOSTED_LIQUIDITY_VAULT], ohmIndex);
};

export const getExternalSupply = (records: TokenSupply[], ohmIndex: number): number => {
  return (
    getOhmTotalSupply(records, ohmIndex)[0] -
    getProtocolOwnedLiquiditySupply(records, ohmIndex)[0] -
    getTreasurySupply(records, ohmIndex)[0] -
    getMigrationOffsetSupply(records, ohmIndex)[0] -
    getBondDepositsSupply(records, ohmIndex)[0] -
    getBondVestingTokensSupply(records, ohmIndex)[0] -
    getBondPremintedSupply(records, ohmIndex)[0] -
    getLendingSupply(records, ohmIndex)[0] -
    getBoostedLiquidityVaultSupply(records, ohmIndex)[0]
  );
};

/**
 * The block from which the inclusion of BLV in floating and circulating supply
 * was changed for the Ethereum subgraph.
 */
const ETHEREUM_BLV_INCLUSION_BLOCK = "17620000";

const isBLVIncluded = (records: TokenSupply[]): boolean => {
  // Filter for Ethereum records
  const ethereumRecords = records.filter(record => record.blockchain === CHAIN_ETHEREUM);
  if (!ethereumRecords.length) {
    return false;
  }

  // Get the block number of the first Ethereum record
  const firstEthereumRecord = ethereumRecords[0];
  const firstEthereumRecordBlock = firstEthereumRecord.block;
  console.log("firstEthereumRecordBlock", firstEthereumRecordBlock);
  console.log("ETHEREUM_BLV_INCLUSION_BLOCK", ETHEREUM_BLV_INCLUSION_BLOCK);

  // If the first Ethereum record is before the BLV inclusion block, then BLV is included in calculations
  if (Number(firstEthereumRecordBlock) < Number(ETHEREUM_BLV_INCLUSION_BLOCK)) {
    return true;
  }

  return false;
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
 * - minus: OHM in boosted liquidity vaults (before `BLV_INCLUSION_BLOCK`)
 *
 * @param records TokenSupply records for the given day
 * @param ohmIndex The index of OHM for the given day
 * @returns
 */
export const getOhmCirculatingSupply = (records: TokenSupply[], ohmIndex: number): [number, TokenSupply[]] => {
  const includedTypes = [
    TOKEN_SUPPLY_TYPE_TOTAL_SUPPLY,
    TOKEN_SUPPLY_TYPE_TREASURY,
    TOKEN_SUPPLY_TYPE_OFFSET,
    TOKEN_SUPPLY_TYPE_BONDS_PREMINTED,
    TOKEN_SUPPLY_TYPE_BONDS_VESTING_DEPOSITS,
    TOKEN_SUPPLY_TYPE_BONDS_DEPOSITS,
  ];

  if (isBLVIncluded(records)) {
    includedTypes.push(TOKEN_SUPPLY_TYPE_BOOSTED_LIQUIDITY_VAULT);
  }

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
 * - minus: OHM in boosted liquidity vaults (before `BLV_INCLUSION_BLOCK`)
 *
 * @param records TokenSupply records for the given day
 * @param ohmIndex The index of OHM for the given day
 * @returns
 */
export const getOhmFloatingSupply = (records: TokenSupply[], ohmIndex: number): [number, TokenSupply[]] => {
  const includedTypes = [
    TOKEN_SUPPLY_TYPE_TOTAL_SUPPLY,
    TOKEN_SUPPLY_TYPE_TREASURY,
    TOKEN_SUPPLY_TYPE_OFFSET,
    TOKEN_SUPPLY_TYPE_BONDS_PREMINTED,
    TOKEN_SUPPLY_TYPE_BONDS_VESTING_DEPOSITS,
    TOKEN_SUPPLY_TYPE_BONDS_DEPOSITS,
    TOKEN_SUPPLY_TYPE_LIQUIDITY,
  ];

  if (isBLVIncluded(records)) {
    includedTypes.push(TOKEN_SUPPLY_TYPE_BOOSTED_LIQUIDITY_VAULT);
  }

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
 *
 * @param records TokenSupply records for the given day
 * @param ohmIndex The index of OHM for the given day
 */
export const getOhmBackedSupply = (records: TokenSupply[], ohmIndex: number): [number, TokenSupply[]] => {
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
 * @param records TokenSupply records for the given day
 * @param ohmIndex The index of OHM for the given day
 * @returns
 */
export const getOhmTotalSupply = (records: TokenSupply[], ohmIndex: number): [number, TokenSupply[]] => {
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
