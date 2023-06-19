import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { CoolerFactory__factory } from "src/typechain";
import { useQueryClient, useSigner } from "wagmi";

export const useCreateCooler = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();

  return useMutation(
    async ({
      debtAddress,
      collateralAddress,
      factoryAddress,
    }: {
      debtAddress: string;
      collateralAddress: string;
      factoryAddress: string;
    }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contract = CoolerFactory__factory.connect(factoryAddress, signer);
      const cooler = await contract.generate(collateralAddress, debtAddress);
      const receipt = await cooler.wait();
      console.log(receipt, "RECEIPT");
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
            category: "Cooler",
            action: "Create Cooler",
            dimension1: tx.transactionHash,
            dimension2: tx.from, // the signer, not necessarily the receipient
          });

          trackGtagEvent("Cooler", {
            event_category: "Create Cooler",
            address: tx.from.slice(2), // the signer, not necessarily the receipient
            txHash: tx.transactionHash.slice(2),
          });
        }

        toast(`Cooler Created Successfully`);
      },
    },
  );
};
