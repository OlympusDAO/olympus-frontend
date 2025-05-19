import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { COOLER_V2_MIGRATOR_CONTRACT } from "src/constants/contracts";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { balanceQueryKey } from "src/hooks/useBalance";
import { contractAllowanceQueryKey } from "src/hooks/useContractAllowance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CoolerV2Migrator__factory } from "src/typechain";
import { IDLGTEv1, IMonoCooler } from "src/typechain/CoolerV2Migrator";
import { useProvider, useSigner } from "wagmi";

export const useConsolidateCooler = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();
  const networks = useTestableNetworks();
  const provider = useProvider();

  // Preview function for UI
  const previewConsolidate = async (coolers: string[]) => {
    if (!provider) throw new Error("Please connect a wallet");
    const contract = CoolerV2Migrator__factory.connect(
      COOLER_V2_MIGRATOR_CONTRACT.addresses[networks.MAINNET_HOLESKY],
      provider,
    );
    const [collateralAmount, borrowAmount] = await contract.previewConsolidate(coolers);
    return { collateralAmount, borrowAmount };
  };

  // Main mutation for consolidation
  const mutation = useMutation(
    async ({
      coolers,
      newOwner,
      authorization,
      signature,
      delegationRequests,
    }: {
      coolers: string[];
      newOwner: string;
      authorization: IMonoCooler.AuthorizationStruct;
      signature: IMonoCooler.SignatureStruct;
      delegationRequests: IDLGTEv1.DelegationRequestStruct[];
    }) => {
      if (!signer) throw new Error("Please connect a wallet");
      const contract = COOLER_V2_MIGRATOR_CONTRACT.getEthersContract(networks.MAINNET_HOLESKY).connect(signer);
      const tx = await contract.consolidate(coolers, newOwner, authorization, signature, delegationRequests, {
        gasLimit: 5000000, // probably need to do what we did before. loanIds.length <= 15 ? loanIds.length * 2000000 : 30000000.
      });
      const receipt = await tx.wait();
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
            action: "Consolidate Cooler V2",
            dimension1: tx.transactionHash,
            dimension2: tx.from,
          });
          trackGtagEvent("Cooler", {
            event_category: "Consolidate Cooler V2",
            address: tx.from.slice(2),
            txHash: tx.transactionHash.slice(2),
          });
        }
        toast("Coolers Migrated to V2 Successfully");
      },
    },
  );

  return { ...mutation, previewConsolidate };
};
