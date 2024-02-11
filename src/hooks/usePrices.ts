import { useQuery } from "@tanstack/react-query";
import { NetworkId } from "src/constants";
import { OHM_ADDRESSES } from "src/constants/addresses";
import { OHM_TOKEN } from "src/constants/tokens";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useGetDefillamaPrice } from "src/helpers/pricing/useGetDefillamaPrice";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";

export const ohmPriceQueryKey = () => ["useOhmPrice"];

/**
 * Returns the market price of OHM.
 */
export const useOhmPrice = () => {
  const key = ohmPriceQueryKey();
  return useQuery<number, Error>([key], async () => {
    const price = await OHM_TOKEN.getPrice(NetworkId.MAINNET);
    return parseFloat(price.toString());
  });
};

export const useOhmPriceDefillama = () => {
  const { data: currentMarketPrices } = useGetDefillamaPrice({
    addresses: [OHM_ADDRESSES[1]],
  });

  return useQuery(
    ["useOhmPriceDefillama"],
    async () => {
      const ohmPriceUSD = currentMarketPrices?.[`ethereum:${OHM_ADDRESSES[1]}`].price;

      return ohmPriceUSD;
    },
    { enabled: !!currentMarketPrices },
  );
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
    [key],
    async () => {
      queryAssertion(ohmPrice && currentIndex, key);

      return currentIndex.toApproxNumber() * ohmPrice;
    },
    { enabled: !!ohmPrice && !!currentIndex },
  );
};

/**
 * Returns the calculated price of gOHM.
 */
export const useGohmPriceDefiLlama = () => {
  const { data: ohmPrice } = useOhmPriceDefillama();
  const { data: currentIndex } = useCurrentIndex();

  const key = gohmPriceQueryKey(ohmPrice, currentIndex);
  return useQuery<number, Error>(
    [key],
    async () => {
      queryAssertion(ohmPrice && currentIndex, key);

      return currentIndex.toApproxNumber() * ohmPrice;
    },
    { enabled: !!ohmPrice && !!currentIndex },
  );
};
