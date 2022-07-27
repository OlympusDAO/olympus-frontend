import get from "get-value";
import { CSSProperties } from "react";
import { ChartType } from "src/components/Chart/Constants";
import { getFloat } from "src/helpers/NumberHelper";

export type TokenRow = {
  token: string;
  category: string;
  value: string;
};

type TokenMap = {
  [key: string]: TokenRow;
};

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

type ComponentRecordRow = {
  token: string;
  value: string;
};

type Components = {
  value: number;
  records: ComponentRecordRow[];
  tokens: TokenMap;
};

export type MetricComponentsTokenSummary = {
  treasuryLiquidBackingProtocolOwnedLiquidityComponents?: Components;
  treasuryLiquidBackingStableComponents?: Components;
  treasuryLiquidBackingVolatileComponents?: Components;
  treasuryLPValueComponents?: Components;
  treasuryStableValueComponents?: Components;
  treasuryVolatileValueComponents?: Components;
};

export type BaseMetric = {
  timestamp: number;
} & Record<string, unknown>;

/**
 * For each of the {keys} specified, calculates a total for each token.
 *
 * @example
 * ```
 * {
 *   timestamp: "1229930",
 *   ...
 *   treasuryLPValueComponents {
 *     records: [
 *       { token: "DAI", value: "100.0" },
 *       { token: "DAI", value: "50.0" },
 *     ],
 *   }
 * }
 * ```
 *
 * Will be transformed into:
 * ```
 * {
 *   timestamp: "1229930",
 *   ...
 *   treasuryLPValueComponents {
 *     records: [
 *       { token: "DAI", value: "100.0" },
 *       { token: "DAI", value: "50.0" },
 *     ],
 *     tokens: {
 *       DAI: { token: "DAI", category: "stablecoins", value: "150.0" },
 *     }
 *   }
 * }
 * ```
 *
 * Note: {keys} and {categories} must have the same number of elements.
 *
 * @param metrics
 * @param keys properties to fetch from the {metrics} parameter
 * @param categories applies the given categories to the tokens that are returned, corresponding to the keys parameter
 * @returns
 */
export const getKeysTokenSummary = (
  metrics: BaseMetric[] | undefined,
  keys: readonly string[],
  categories: readonly string[],
): (BaseMetric & MetricComponentsTokenSummary)[] => {
  if (keys.length != categories.length) {
    throw new Error(
      `The length of the keys (${JSON.stringify(keys)}) and categories (${JSON.stringify(
        categories,
      )}) parameters must match`,
    );
  }

  if (!metrics) return [];

  // We cast the resulting object, so we can interact with the keys defined in MetricComponentsTokenSummary
  const updatedData = metrics.slice() as (BaseMetric & MetricComponentsTokenSummary)[];

  updatedData.forEach((metric: BaseMetric) => {
    if (!objectHasProperty(metric, "timestamp")) {
      throw new Error("Unable to access timestamp property in metrics element");
    }

    keys.forEach((key, index) => {
      if (!objectHasProperty(metric, key)) {
        throw new Error(`Unable to access specified key ${key} in metrics element`);
      }

      const components = metric[key] as Components;
      if (!objectHasProperty(components, "records")) {
        throw new Error(`Unable to access records property in ${key} element`);
      }

      // Create the destination data structure first
      components.tokens = {} as TokenMap;

      const currentCategory = categories[index];

      components.records.forEach(record => {
        const currentTokenRecord = components.tokens[record.token];
        const currentTokenValue: string = currentTokenRecord ? currentTokenRecord.value : "0";
        const recordValue: number = getFloat(record.value);
        const newValue: number = parseFloat(currentTokenValue) + recordValue;

        const tokenRecord: TokenRow = {
          token: record.token,
          category: currentCategory,
          value: newValue.toString(),
        };

        components.tokens[record.token] = tokenRecord;
      });
    });
  });

  return updatedData;
};

/**
 * Collapses the tokens underneath {key} into a string array.
 *
 * This makes it easy to use for key and name parameters for charts.
 *
 * @param metrics
 * @param key
 * @returns
 */
export const getTokensFromKey = (
  metrics: (BaseMetric & MetricComponentsTokenSummary)[] | undefined,
  key: string,
): string[] => {
  if (!metrics) return [];

  const tokenNames = new Set<string>();
  metrics.forEach(metric => {
    if (!objectHasProperty(metric, key)) {
      throw new Error(`Unable to access specified key ${key} in metrics element`);
    }

    const components = metric[key] as Components;
    if (!objectHasProperty(components, "tokens")) {
      throw new Error(`Unable to access tokens property in ${key} element`);
    }

    Object.keys(components.tokens).forEach(tokenKey => tokenNames.add(tokenKey));
  });

  return Array.from(tokenNames);
};

/**
 * Converts an array of token names into the relevant data keys, which
 * will be used by the charting library.
 *
 * @param tokens
 * @param key
 * @returns
 */
export const getDataKeysFromTokens = (tokens: string[], key: string): string[] => {
  return tokens.map(value => `${key}.tokens.${value}.value`);
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

export type MetricRow = {
  timestamp: number;
  tokens: TokenRow[];
};

/**
 * Combines the tokens underneath each of the elements specified by {keys},
 * and reduces them into a single array.
 *
 * @example
 * ```
 * {
 *   timestamp: "1229930",
 *   ...
 *   treasuryLPValueComponents {
 *     tokens: {
 *       DAI: { token: "DAI", category: "stablecoins", value: "150.0" },
 *     }
 *   }
 *   treasuryStableValueComponents {
 *     tokens: {
 *       DAI: { token: "LUSD", category: "stablecoins", value: "200.0" },
 *     }
 *   }
 * }
 * ```
 *
 * Will be transformed into:
 * ```
 * {
 *   timestamp: "1229930",
 *   ...
 *   tokens: [
 *     { token: "DAI", category: "stablecoins", value: "150.0" },
 *     { token: "LUSD", category: "stablecoins", value: "200.0" },
 *   ]
 * }
 * ```
 *
 * @param metrics
 * @param keys
 * @returns
 */
export const reduceKeysTokenSummary = (
  metrics: (BaseMetric & MetricComponentsTokenSummary)[] | undefined,
  keys: readonly string[],
): MetricRow[] => {
  if (!metrics) return [];

  const reducedData: MetricRow[] = [];
  metrics.forEach(metric => {
    if (!objectHasProperty(metric, "timestamp")) {
      throw new Error("Unable to access timestamp property in metrics element");
    }

    const reducedDataRow: MetricRow = {
      timestamp: metric["timestamp"],
      tokens: [],
    };

    keys.forEach(key => {
      if (!objectHasProperty(metric, key)) {
        throw new Error(`Unable to access specified key ${key} in metrics element`);
      }

      const components = metric[key] as Components;
      if (!objectHasProperty(components, "tokens")) {
        throw new Error(`Unable to access tokens property in ${key} element`);
      }

      // Collapse the contents of the `tokens` property (map-like) underneath the given {key}
      const tokenRecords = components["tokens"] as TokenMap;
      Object.keys(tokenRecords).forEach((tokenKey: string) => reducedDataRow.tokens.push(tokenRecords[tokenKey]));
    });

    reducedData.push(reducedDataRow);
  });

  return reducedData;
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
