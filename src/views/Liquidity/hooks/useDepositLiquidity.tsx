import { useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { BLEVaultLido__factory } from "src/typechain";
import { useMutation, useSigner } from "wagmi";

export const useDepositLiqudiity = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();
  return useMutation(
    async ({ amount, address, minLpAmount }: { amount: string; address: string; minLpAmount: DecimalBigNumber }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contract = BLEVaultLido__factory.connect(address, signer);
      const amountToBigNumber = ethers.utils.parseUnits(amount);
      const depositTransaction = await contract.deposit(amountToBigNumber, minLpAmount.toBigNumber(18));
      const receipt = await depositTransaction.wait();
      return receipt;
    },
    {
      onError: (error: Error) => {
        toast.error(error.message);
      },
      onSuccess: async tx => {
        queryClient.invalidateQueries({ queryKey: [["useBalance"]] });
        queryClient.refetchQueries({ queryKey: ["getSingleSidedLiquidityVaults"] });
        queryClient.refetchQueries({ queryKey: ["getVault"] });

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
