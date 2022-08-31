import get from "get-value";
import { CSSProperties } from "react";
import { ChartType } from "src/components/Chart/Constants";
import { getFloat } from "src/helpers/NumberHelper";

export const objectHasProperty = (object: unknown, property: string): object is Record<string, unknown> => {
  return typeof object === "object" && object !== null && property in object;
};

/**
 * As the subgraph data source takes a long time to re-index, we alter
 * the display name of certain tokens here.
 *
 * This should be used sparingly, and the updated display names should be integrated
 * into the subgraph ASAP.
 */
export const renameToken = (value: string): string => {
  const tokenMap = new Map<string, string>([
    ["Uniswap V2 OHM V2-DAI Liquidity Pool", "SushiSwap OHM-DAI Liquidity Pool"],
    ["Uniswap V2 OHM V2-ETH Liquidity Pool", "SushiSwap OHM-ETH Liquidity Pool"],
    ["cvxOHMETH", "Curve OHM-ETH Pool (Staked in Convex)"],
    ["Balancer OHM-DAI-WETH Pool", "Balancer V2 OHM-DAI-WETH Liquidity Pool"],
    ["Balancer WETH-FDT Pool", "Balancer V2 WETH-FDT Liquidity Pool"],
    ["vlCVX V2", "vlCVX"],
  ]);

  const mapValue = tokenMap.get(value);
  if (!mapValue) return value;

  return mapValue;
};

/**
 * Converts an array of token names into the relevant data keys, which
 * will be used by the charting library.
 *
 * @param tokens
 * @param key
 * @returns
 */
export const getDataKeysFromTokens = (tokens: string[]): string[] => {
  return tokens.map(value => `tokens.${value}.value`);
};

/**
 * Creates a map that can be used to determine tooltip categories, with the values
 * of {dataKeys} as the keys and the values of {tokens} as the values.
 *
 * If required, the display name of the token is also altered.
 *
 * @param tokens
 * @param dataKeys
 * @returns
 */
export const getCategoriesMap = (tokens: string[], dataKeys: string[]): Map<string, string> => {
  const categoriesMap = new Map<string, string>();
  dataKeys.map((value, index) => {
    categoriesMap.set(value, renameToken(tokens[index]));
  });

  return categoriesMap;
};

/**
 * Creates a map that can be used to determine the color corresponding with data keys, with the values
 * of {dataKeys} as the keys and the values of {colors} as the values.
 *
 * @param colors
 * @param dataKeys
 * @returns
 */
export const getDataKeyColorsMap = (colors: string[], dataKeys: string[]): Map<string, string> => {
  const categoriesMap = new Map<string, string>();
  dataKeys.map((value, index) => {
    categoriesMap.set(value, colors[index]);
  });

  return categoriesMap;
};

/**
 * Creates a map that can be used to determine tooltip bulletpoint styles, with the values
 * of {dataKeys} as the keys and the values of {styles} as the values.
 *
 * @param styles
 * @param dataKeys
 * @returns
 */
export const getBulletpointStylesMap = (styles: CSSProperties[], dataKeys: string[]): Map<string, CSSProperties> => {
  const categoriesMap = new Map<string, CSSProperties>();
  dataKeys.map((value, index) => {
    categoriesMap.set(value, styles[index]);
  });

  return categoriesMap;
};

/**
 * Returns the maximum value found in any of the {keys} properties across all elements of
 * {data}.
 *
 * This supports using nested keys ("records.DAI.value"), using the `get-value` library.
 *
 * If {type} is stacked, the maximum value of the sum of the values corresponding to
 * {keys} will be returned.
 *
 * If {type} is ChartType.Composed and {composedLineDataKeys} is specified, the maximum
 * value corresponding to {composedLineDataKeys} and the sum of the stacked values will
 * be returned.
 *
 * @param data
 * @param keys
 * @param stacked
 * @returns
 */
export const getMaximumValue = (
  data: Record<string, unknown>[],
  keys: string[],
  type: ChartType,
  composedLineDataKeys?: string[],
): number => {
  const stacked = type === ChartType.StackedArea || type === ChartType.Composed;

  return Math.max(
    ...data.map(value => {
      if (!stacked) {
        return Math.max(
          ...keys.map(key => {
            return getFloat(get(value, key));
          }),
        );
      }

      // If we are stacking values, then we want to add the values for the keys,
      // but only if they are not within composedLineDataKeys
      const stackedTotal = keys.reduce((previousValue, key) => {
        if (composedLineDataKeys && composedLineDataKeys.includes(key)) {
          return previousValue;
        }

        return previousValue + getFloat(get(value, key));
      }, 0);
      // Grab the maximum value corresponding to the keys specified in composedLineDataKeys
      const maxComposedLineDataKeyValue = Math.max(
        ...keys.map(key => {
          if (!composedLineDataKeys || type !== ChartType.Composed) return 0;

          if (!composedLineDataKeys.includes(key)) return 0;

          return getFloat(get(value, key));
        }),
      );

      return Math.max(maxComposedLineDataKeyValue, stackedTotal);
    }),
  );
};
