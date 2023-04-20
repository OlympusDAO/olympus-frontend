import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { BLEVaultManagerLido__factory } from "src/typechain";
import { useMutation, useSigner } from "wagmi";

export const useCreateUserVault = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();
  return useMutation(
    async ({ address }: { address: string }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contract = BLEVaultManagerLido__factory.connect(address, signer);
      const createVault = await contract.deployVault();

      const receipt = await createVault.wait();
      return receipt;
    },
    {
      onError: (error: Error) => {
        toast.error(error.message);
      },
      onSuccess: async tx => {
        queryClient.invalidateQueries({ queryKey: ["getUserVault"] });
        if (tx.transactionHash) {
          trackGAEvent({
            category: "Liquidity",
            action: "Create Vault",
            dimension1: tx.transactionHash,
            dimension2: tx.from, // the signer, not necessarily the receipient
          });

          trackGtagEvent("Liquidty", {
            event_category: "Create Vault",
            address: tx.from.slice(2), // the signer, not necessarily the receipient
            txHash: tx.transactionHash.slice(2),
          });
        }

        toast(`Vault Created Successfully`);
      },
    },
  );
};
