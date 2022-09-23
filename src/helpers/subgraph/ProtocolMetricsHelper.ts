import get from "get-value";
import { CSSProperties } from "react";
import { ChartType } from "src/components/Chart/Constants";
import { getFloat } from "src/helpers/NumberHelper";
import tinycolor from "tinycolor2";

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
    ["Balancer V2 OHM-DAI-WETH Liquidity Pool", "Balancer V2 OHM-DAI-wETH Liquidity Pool"],
    [
      "Balancer V2 OHM-DAI-WETH Liquidity Pool (Staked in AURA)",
      "Balancer V2 OHM-DAI-wETH Liquidity Pool (Staked in Aura)",
    ],
    ["Balancer V2 WETH-FDT Liquidity Pool", "Balancer V2 wETH-FDT Liquidity Pool"],
    ["Balancer V2 WETH-FDT Liquidity Pool - Gauge Deposit", "Balancer V2 wETH-FDT Liquidity Pool - Gauge Deposit"],
    ["Uniswap V2 OHM-BTRFLY V1 Liquidity Pool", "SushiSwap OHM-BTRFLY V1 Liquidity Pool"],
    ["UniswapV2 gOHM-wETH Liquidity Pool", "SushiSwap gOHM-wETH Liquidity Pool"],
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

const COLOR_INCREMENT = 20;

const adjustColor = (color: tinycolor.Instance, multiple: number): string => {
  return color.spin(multiple * COLOR_INCREMENT).toHex8String();
};

/**
 * Returns a color for the given index.
 *
 * If the index is beyond the bounds of the {colors} array,
 * it will darken the color at the corresponding index in
 * order to generate a unique color.
 *
 * @param colors
 * @param index
 * @returns
 */
const getCorrectedColor = (colors: string[], index: number): string => {
  // We want 0, 1, 2, etc
  const multiple = Math.floor(index / (colors.length - 1));
  const correctedIndex = index % (colors.length - 1);

  return adjustColor(tinycolor(colors[correctedIndex]), multiple);
};

const getCorrectedStyle = (styles: CSSProperties[], index: number): CSSProperties => {
  const multiple = index / (styles.length - 1);
  const correctedIndex = index % (styles.length - 1);

  return {
    background: adjustColor(tinycolor(styles[correctedIndex].background as string), multiple),
  };
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
    categoriesMap.set(value, getCorrectedColor(colors, index));
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
    categoriesMap.set(value, getCorrectedStyle(styles, index));
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
