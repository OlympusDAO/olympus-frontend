import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ExternalPool } from "src/lib/ExternalPool";

export const CurvePoolTVL = (pool: ExternalPool) => {
  const curveAPI = "https://api.curve.fi/api/getFactoryCryptoPools";
  const {
    data = { usdTotal: 0 },
    isFetched,
    isLoading,
  } = useQuery(["CurvePoolTVL"], async () => {
    return await axios.get(curveAPI).then(res => {
      return res.data.data.poolData.find((extPool: { address: string }) => extPool.address === pool.address);
    });
  });
  return { data, isFetched, isLoading };
};
