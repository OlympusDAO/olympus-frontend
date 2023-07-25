import { CATEGORY_POL, CATEGORY_STABLE, CATEGORY_VOLATILE } from "src/helpers/subgraph/Constants";
import { TokenRecord } from "src/hooks/useFederatedSubgraphQuery";

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
