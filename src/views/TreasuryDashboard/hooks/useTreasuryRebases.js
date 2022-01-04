import { useQuery } from "react-query";
import apollo from "src/lib/apolloClient";
import { rebasesDataQuery } from "../treasuryData";

export const useTreasuryRebases = options => {
  return useQuery(
    "treasury_rebases",
    async () => {
      const response = await apollo(rebasesDataQuery);

      return response.data.rebases;
    },
    options,
  );
};
