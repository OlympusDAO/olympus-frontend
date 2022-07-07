type TokenRow = {
  token: string;
  category: string;
  value: string;
};

export type TokenRows = {
  timestamp: string;
  tokens: {
    [key: string]: TokenRow;
  };
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
 *   tokens: [
 *     { token: "DAI", category: "stablecoins", value: "150.0" },
 *   ]
 * }
 * ```
 *
 * @param metrics
 * @param keys
 * @returns
 */
export const getByTokenSummary = (metrics: unknown[] | undefined, keys: string[]): TokenRows[] => {
  if (!metrics) return [];

  // change type to ProtocolMetrics?

  const chartData: TokenRows[] = [];

  metrics.forEach(metric => {
    if (!objectHasProperty(metric, "timestamp")) {
      throw new Error("Unable to access timestamp property in metrics element");
    }

    // const record: TokenRows = {
    //   timestamp:
    //     typeof metric === "object" && metric !== null && metric.hasOwnProperty("timestamp") && metric.timestamp,
    //   tokens: {},
    // };

    keys.forEach(key => {
      if (!(typeof metric === "object" && metric !== null && key in metric)) {
        throw new Error(`Unable to access specified key ${key} in metrics element`);
      }
    });
  });

  return chartData;
};
