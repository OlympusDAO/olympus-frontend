import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { useQuery } from "react-query";
import { queryAssertion } from "src/helpers";

import { useOhmDaiReserveContract } from "./useContract";
import { useCurrentIndex } from "./useCurrentIndex";

export const ohmPriceQueryKey = () => ["useOhmPrice"];

/**
 * Returns the market price of OHM.
 */
export const useOhmPrice = () => {
  const reserveContract = useOhmDaiReserveContract();

  return useQuery<number, Error>(ohmPriceQueryKey(), async () => {
    const [ohm, dai] = await reserveContract.getReserves();

    return parseFloat(formatUnits(dai.div(ohm), 9));
  });
};

export const gohmPriceQueryKey = (marketPrice?: number, currentIndex?: BigNumber) => [
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
    gohmPriceQueryKey(ohmPrice, currentIndex),
    async () => {
      queryAssertion(ohmPrice && currentIndex, gohmPriceQueryKey(ohmPrice, currentIndex));

      return parseFloat(formatUnits(currentIndex, 9)) * ohmPrice;
    },
    { enabled: !!ohmPrice && !!currentIndex },
  );
};
