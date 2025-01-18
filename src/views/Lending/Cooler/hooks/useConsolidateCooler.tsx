import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { COOLER_CONSOLIDATION_CONTRACT } from "src/constants/contracts";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { balanceQueryKey } from "src/hooks/useBalance";
import { contractAllowanceQueryKey } from "src/hooks/useContractAllowance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CoolerConsolidation__factory } from "src/typechain";
import { useSigner } from "wagmi";

export const useConsolidateCooler = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();
  const networks = useTestableNetworks();

  return useMutation(
    async ({
      fromCoolerAddress,
      toCoolerAddress,
      fromClearingHouseAddress,
      toClearingHouseAddress,
      loanIds,
      newOwner,
    }: {
      fromCoolerAddress: string;
      toCoolerAddress: string;
      fromClearingHouseAddress: string;
      toClearingHouseAddress: string;
      loanIds: number[];
      newOwner?: boolean;
    }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const contractAddress = COOLER_CONSOLIDATION_CONTRACT.addresses[networks.MAINNET];
      const contract = CoolerConsolidation__factory.connect(contractAddress, signer);

      const cooler = newOwner
        ? await contract.consolidateWithNewOwner(
            fromClearingHouseAddress,
            toClearingHouseAddress,
            fromCoolerAddress,
            toCoolerAddress,
            loanIds,
            {
              gasLimit: loanIds.length <= 15 ? loanIds.length * 2000000 : 30000000,
            },
          )
        : await contract.consolidate(
            fromClearingHouseAddress,
            toClearingHouseAddress,
            fromCoolerAddress,
            toCoolerAddress,
            loanIds,
            {
              gasLimit: loanIds.length <= 15 ? loanIds.length * 2000000 : 30000000,
            },
          );

      const receipt = await cooler.wait();
      return receipt;
    },
    {
      onError: (error: Error) => {
        toast.error(error.message);
      },
      onSuccess: async tx => {
        queryClient.invalidateQueries({ queryKey: ["getCoolerLoans"] });
        queryClient.invalidateQueries({ queryKey: [balanceQueryKey()] });
        queryClient.invalidateQueries({ queryKey: [contractAllowanceQueryKey()] });
        if (tx.transactionHash) {
          trackGAEvent({
            category: "Cooler",
            action: "Consolidate Cooler",
            dimension1: tx.transactionHash,
            dimension2: tx.from, // the signer, not necessarily the receipient
          });

          trackGtagEvent("Cooler", {
            event_category: "Consolidate Cooler",
            address: tx.from.slice(2), // the signer, not necessarily the receipient
            txHash: tx.transactionHash.slice(2),
          });
        }

        toast(`Coolers Consolidated Successfully`);
      },
    },
  );
};
