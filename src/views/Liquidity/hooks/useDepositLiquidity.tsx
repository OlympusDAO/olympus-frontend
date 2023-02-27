import { ethers } from "ethers";
import toast from "react-hot-toast";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { OlympusSingleSidedLiquidityVault__factory } from "src/typechain";
import { useMutation, useSigner } from "wagmi";

export const useDepositLiqudiity = () => {
  const { data: signer } = useSigner();
  return useMutation(
    async ({ amount, address, minLpAmount }: { amount: string; address: string; minLpAmount: string }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contract = OlympusSingleSidedLiquidityVault__factory.connect(address, signer);
      const amountToBigNumber = ethers.utils.parseUnits(amount);
      const minLpAmountToBigNumber = ethers.utils.parseUnits(minLpAmount.toString());
      const depositTransaction = await contract.deposit(amountToBigNumber, minLpAmountToBigNumber);
      const receipt = await depositTransaction.wait();
      return receipt;
    },
    {
      onError: (error: Error) => {
        toast.error(error.message);
      },
      onSuccess: async tx => {
        if (tx.transactionHash) {
          trackGAEvent({
            category: "Liquidity",
            action: "Deposit",
            dimension1: tx.transactionHash,
            dimension2: tx.from, // the signer, not necessarily the receipient
          });

          trackGtagEvent("Liquidty", {
            event_category: "Liquidity",
            address: tx.from.slice(2), // the signer, not necessarily the receipient
            txHash: tx.transactionHash.slice(2),
          });
        }

        toast(`Deposit Successful`);
      },
    },
  );
};
