import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { OHM_DAI_RESERVE_CONTRACT_DECIMALS } from "src/constants/decimals";
import { parseBigNumber } from "src/helpers";
import { ohm_dai } from "src/helpers/AllBonds";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { assert } from "src/helpers/types/assert";
import { nonNullable } from "src/helpers/types/nonNullable";

import { useStaticPairContract } from "./useContract";
import { useCurrentIndex } from "./useCurrentIndex";

export const ohmPriceQueryKey = () => ["useOhmPrice"];

/**
 * Returns the market price of OHM.
 */
export const useOhmPrice = () => {
  const address = ohm_dai.getAddressForReserve(NetworkId.MAINNET);
  assert(address, "Contract should exist for NetworkId.MAINNET");

  const reserveContract = useStaticPairContract(address, NetworkId.MAINNET);

  const key = ohmPriceQueryKey();
  return useQuery<number, Error>(key, async () => {
    const [ohm, dai] = await reserveContract.getReserves();

    return parseBigNumber(dai.div(ohm), OHM_DAI_RESERVE_CONTRACT_DECIMALS);
  });
};

export const gohmPriceQueryKey = (marketPrice?: number, currentIndex?: DecimalBigNumber) =>
  ["useGOHMPrice", marketPrice, currentIndex].filter(nonNullable);

/**
 * Returns the calculated price of gOHM.
 */
export const useGohmPrice = () => {
  const { data: ohmPrice } = useOhmPrice();
  const { data: currentIndex } = useCurrentIndex();

  const key = gohmPriceQueryKey(ohmPrice, currentIndex);
  return useQuery<number, Error>(
    key,
    async () => {
      queryAssertion(ohmPrice && currentIndex, key);

      return currentIndex.toApproxNumber() * ohmPrice;
    },
    { enabled: !!ohmPrice && !!currentIndex },
  );
};
