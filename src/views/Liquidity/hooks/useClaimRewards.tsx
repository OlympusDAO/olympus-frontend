import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { OlympusSingleSidedLiquidityVault__factory } from "src/typechain/factories";
import { useMutation, useSigner } from "wagmi";

export const useClaimRewards = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ address }: { address: string }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contract = OlympusSingleSidedLiquidityVault__factory.connect(address, signer);
      const claimTransaction = await contract.claimRewards();

      const receipt = await claimTransaction.wait();
      return receipt;
    },
    {
      onError: (error: Error) => {
        toast.error(error.message);
      },
      onSuccess: async tx => {
        queryClient.invalidateQueries({ queryKey: ["getSingleSidedLiquidityVaults"] });
        if (tx.transactionHash) {
          trackGAEvent({
            category: "Liquidity",
            action: "Claim Rewards",
            dimension1: tx.transactionHash,
            dimension2: tx.from, // the signer, not necessarily the receipient
          });

          trackGtagEvent("Liquidty", {
            event_category: "Claim Rewards",
            address: tx.from.slice(2), // the signer, not necessarily the receipient
            txHash: tx.transactionHash.slice(2),
          });
        }

        toast(`Claim Successful`);
      },
    },
  );
};