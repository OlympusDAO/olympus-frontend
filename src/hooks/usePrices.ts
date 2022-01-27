import { BigNumber } from "@ethersproject/bignumber";
import { useQuery } from "react-query";
import { OHM_DAI_RESERVE_CONTRACT_DECIMALS, STAKING_CONTRACT_DECIMALS } from "src/constants/decimals";
import { parseBigNumber, queryAssertion } from "src/helpers";

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

    return parseBigNumber(dai.div(ohm), OHM_DAI_RESERVE_CONTRACT_DECIMALS);
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

      return parseBigNumber(currentIndex, STAKING_CONTRACT_DECIMALS) * ohmPrice;
    },
    { enabled: !!ohmPrice && !!currentIndex },
  );
};
