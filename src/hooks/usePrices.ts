import { formatUnits } from "@ethersproject/units";
import { useQuery } from "react-query";
import { queryAssertion } from "src/helpers";
import { useOhmDaiReserveContract } from "./useContract";
import { useCurrentIndex } from "./useCurrentIndex";

export const useOhmPriceKey = () => ["useOhmPrice"];

/**
 * Returns the market price of OHM.
 */
export const useOhmPrice = () => {
  const reserveContract = useOhmDaiReserveContract();

  return useQuery<number, Error>(useOhmPriceKey(), async () => {
    const [ohm, dai] = await reserveContract.getReserves();

    return parseFloat(formatUnits(dai.div(ohm), "gwei"));
  });
};

export const useGohmPriceKey = (marketPrice?: number, currentIndex?: number) => [
  "useGOHMPrice",
  marketPrice,
  currentIndex,
];

/**
 * Returns the calculated price of gOHM.
 */
export const useGohmPrice = () => {
  const { data: ohmPrice } = useOhmPrice();
  const { data: currentIndex } = useCurrentIndex();

  return useQuery<number, Error>(
    useGohmPriceKey(ohmPrice, currentIndex),
    async () => {
      queryAssertion(ohmPrice && currentIndex, useGohmPriceKey(ohmPrice, currentIndex));
      return ohmPrice * currentIndex;
    },
    { enabled: !!ohmPrice && !!currentIndex },
  );
};
