type TokenRow = {
  token: string;
  category: string;
  value: string;
};

type TokenMap = {
  [key: string]: TokenRow;
};

const objectHasProperty = (object: unknown, property: string): boolean => {
  return typeof object === "object" && object !== null && property in object;
};

/**
 * For each of the {keys} specified, calculates a total for each token.
 *
 * For example:
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
export const getKeysTokenSummary = (metrics: any[] | undefined, keys: string[], categories: string[]): any[] => {
  if (keys.length != categories.length) {
    throw new Error(
      `The length of the keys (${JSON.stringify(keys)}) and categories (${JSON.stringify(
        categories,
      )}) parameters must match`,
    );
  }

  if (!metrics) return [];

  const updatedData = metrics.slice();

  updatedData.forEach(metric => {
    if (!objectHasProperty(metric, "timestamp")) {
      throw new Error("Unable to access timestamp property in metrics element");
    }

    keys.forEach((key, index) => {
      if (!(typeof metric === "object" && metric !== null && key in metric)) {
        throw new Error(`Unable to access specified key ${key} in metrics element`);
      }

      const components = metric[key];
      if (!(typeof components === "object" && components !== null && "records" in components)) {
        throw new Error(`Unable to access records property in ${key} element`);
      }

      // Create the destination data structure first
      components.tokens = {} as TokenMap;

      const currentCategory = categories[index];

      components["records"].forEach((record: { token: string; value: string }) => {
        const currentTokenRecord = components.tokens[record.token];
        const currentTokenValue: string = currentTokenRecord ? currentTokenRecord.value : "0";
        const recordValue: number = typeof record.value === "number" ? record.value : parseFloat(record.value);
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

type MetricRow = {
  timestamp: string;
  tokens: TokenRow[];
};

/**
 * Combines the tokens underneath each of the elements specified by {keys},
 * and reduces them into a single array.
 *
 * For example:
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
export const reduceKeysTokenSummary = (metrics: any[] | undefined, keys: string[]): any[] => {
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
      if (!(typeof metric === "object" && metric !== null && key in metric)) {
        throw new Error(`Unable to access specified key ${key} in metrics element`);
      }

      const components = metric[key];
      if (!(typeof components === "object" && components !== null && "tokens" in components)) {
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
