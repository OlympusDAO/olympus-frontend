import { ethers } from "ethers";
import toast from "react-hot-toast";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { OlympusSingleSidedLiquidityVault__factory } from "src/typechain";
import { useMutation, useSigner } from "wagmi";

export const useDepositLiqudiity = () => {
  const networks = useTestableNetworks();
  const { data: signer } = useSigner();
  if (!signer) throw new Error(`Please connect a wallet`);
  return useMutation(
    async ({ amount, slippage, address }: { amount: string; slippage: string; address: string }) => {
      const contract = OlympusSingleSidedLiquidityVault__factory.connect(address, signer);
      //TODO: Get LP Price
      const lpPrice = 1;
      //TODO: Number of Decimals
      const amountToBigNumber = ethers.utils.parseUnits(amount);
      //TODO: How to calculate slippage? Only method we have right now is for min amount of LP to receive.
      //But we need to know the exchange rate between 1 deposit asset AND 1 LP TOKEN.
      const minLpAmount = (Number(amount) * (1 - Number(slippage))) / lpPrice;
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
