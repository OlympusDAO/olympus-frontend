import { useQuery } from "react-query";
import apollo from "src/lib/apolloClient";

import { treasuryDataQuery } from "../treasuryData";

export const useTreasuryMetrics = options => {
  return useQuery(
    "treasury_metrics",
    async () => {
      const response = await apollo(treasuryDataQuery);

      // Transform string values to floats
      return response.data.protocolMetrics.map(metric =>
        Object.entries(metric).reduce((obj, [key, value]) => ((obj[key] = parseFloat(value)), obj), {}),
      );
    },
    options,
  );
};
