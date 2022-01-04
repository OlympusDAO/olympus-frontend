import { formatUnits } from "@ethersproject/units";
import { useQuery } from "react-query";
import { useOhmDaiReserveContract } from "./useContract";

export const useMarketPriceKey = () => ["useMarketPrice"];

export const useMarketPrice = () => {
  const reserveContract = useOhmDaiReserveContract();

  return useQuery<number, Error>(useMarketPriceKey(), async () => {
    const [ohm, dai] = await reserveContract.getReserves();

    return parseFloat(formatUnits(dai.div(ohm), "gwei"));
  });
};
