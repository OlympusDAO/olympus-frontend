import { useQuery } from "react-query";
import apollo from "src/lib/apolloClient";
import { rebasesDataQuery } from "../treasuryData.js";

export const useTreasuryRebases = () => {
  return useQuery("treasury_rebases", async () => {
    const response = await apollo(rebasesDataQuery);

    // Transform string values to floats
    return response.data.rebases;
  });
};
