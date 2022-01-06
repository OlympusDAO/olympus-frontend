import { useQuery } from "react-query";
import { queryAssertion } from "src/helpers";
import { useCurrentIndex } from "./useCurrentIndex";
import { useMarketPrice } from "./useMarketPrice";

export const useGohmPriceKey = (marketPrice?: number, currentIndex?: number) => [
  "useGOHMPrice",
  marketPrice,
  currentIndex,
];

export const useGohmPrice = () => {
  const { data: marketPrice } = useMarketPrice();
  const { data: currentIndex } = useCurrentIndex();

  return useQuery<number, Error>(
    useGohmPriceKey(marketPrice, currentIndex),
    async () => {
      queryAssertion(marketPrice && currentIndex, useGohmPriceKey(marketPrice, currentIndex));
      return marketPrice * currentIndex;
    },
    { enabled: Boolean(marketPrice && currentIndex) },
  );
};
