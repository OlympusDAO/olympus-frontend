import { TokenSupply } from "src/generated/graphql";
import { TOKEN_SUPPLY_TYPE_LIQUIDITY } from "src/views/TreasuryDashboard/components/Graph/Constants";

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
