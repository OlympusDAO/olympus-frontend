import { useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { OlympusSingleSidedLiquidityVault__factory } from "src/typechain";
import { useMutation, useSigner } from "wagmi";

export const useWithdrawLiquidity = () => {
  const networks = useTestableNetworks();
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ amount, slippage, address }: { amount: string; slippage: string; address: string }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contract = OlympusSingleSidedLiquidityVault__factory.connect(address, signer);

      //TODO: Number of Decimals
      const amountToBigNumber = ethers.utils.parseUnits(amount);
      //TODO: How to calculate slippage? Need Price feed that contract is using for LP price.
      const minPairToken = 0.00001;
      const minOhmToken = 0.00001;
      const minPairTokenBigNumber = ethers.utils.parseUnits(minPairToken.toString());
      const minOhmTokenBigNumber = ethers.utils.parseUnits(minOhmToken.toString(), 9);

      const withdrawTransaction = await contract.withdraw(
        amountToBigNumber,
        [minOhmTokenBigNumber, minPairTokenBigNumber],
        true,
      );

      const receipt = await withdrawTransaction.wait();
      return receipt;
    },
    {
      onError: (error: Error) => {
        toast.error(error.message);
      },
      onSuccess: async tx => {
        queryClient.invalidateQueries({ queryKey: [["useBalance"]] });
        if (tx.transactionHash) {
          trackGAEvent({
            category: "Liquidity",
            action: "Withdraw",
            dimension1: tx.transactionHash,
            dimension2: tx.from, // the signer, not necessarily the receipient
          });

          trackGtagEvent("Liquidty", {
            event_category: "Withdraw",
            address: tx.from.slice(2), // the signer, not necessarily the receipient
            txHash: tx.transactionHash.slice(2),
          });
        }

        toast(`Withdraw Successful`);
      },
    },
  );
};
