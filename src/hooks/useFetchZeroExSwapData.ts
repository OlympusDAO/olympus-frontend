import { useMutation } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { fetchSwapData } from "src/hooks/useZeroExSwap";

export const useFetchZeroExSwapData = () => {
  return useMutation(
    async ({
      slippage,
      amount,
      tokenAddress,
      buyAddress,
      isSell = true,
    }: {
      slippage: number;
      amount: BigNumber;
      tokenAddress: string;
      buyAddress: string;
      isSell?: boolean;
    }) => {
      const swapData = await fetchSwapData(amount, tokenAddress, +slippage / 100, buyAddress, isSell);
      return swapData;
    },
  );
};
