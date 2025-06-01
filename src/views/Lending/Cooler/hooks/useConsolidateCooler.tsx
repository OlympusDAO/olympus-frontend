import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { COOLER_V2_MIGRATOR_CONTRACT, COOLER_V2_MONOCOOLER_CONTRACT } from "src/constants/contracts";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { balanceQueryKey } from "src/hooks/useBalance";
import { contractAllowanceQueryKey } from "src/hooks/useContractAllowance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CoolerV2Migrator__factory, CoolerV2MonoCooler__factory } from "src/typechain";
import { getAuthorizationSignature } from "src/views/Lending/CoolerV2/utils/getAuthorizationSignature";
import { useProvider, useSigner, useSignTypedData } from "wagmi";

export const useConsolidateCooler = () => {
  const { data: signer } = useSigner();
  const { signTypedDataAsync } = useSignTypedData();
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
    async ({ coolers, newOwner }: { coolers: string[]; newOwner: string }) => {
      if (!signer) throw new Error("Please connect a wallet");

      const address = await signer.getAddress();

      // 1. Get nonce from V2 contract for new owner
      const v2Contract = CoolerV2MonoCooler__factory.connect(
        COOLER_V2_MONOCOOLER_CONTRACT.getAddress(networks.MAINNET_HOLESKY),
        provider,
      );
      const nonce = await v2Contract.authorizationNonces(address);

      // 2. Generate EIP-712 signature
      const migratorAddress = COOLER_V2_MIGRATOR_CONTRACT.getAddress(networks.MAINNET_HOLESKY);
      const v2ContractAddress = v2Contract.address;
      if (!migratorAddress || !v2ContractAddress) throw new Error("Missing contract addresses");

      const { auth, signature } = await getAuthorizationSignature({
        userAddress: address,
        authorizedAddress: migratorAddress as `0x${string}`,
        verifyingContract: v2ContractAddress as `0x${string}`,
        chainId: networks.MAINNET_HOLESKY,
        nonce: nonce.toString(),
        signTypedDataAsync,
      });

      // 3. Call the migrator contract
      const contract = CoolerV2Migrator__factory.connect(migratorAddress, signer);
      const tx = await contract.consolidate(
        coolers,
        newOwner,
        auth,
        signature,
        [], // delegationRequests
        // {
        //   gasLimit: 500000, // probably need to do what we did before. loanIds.length <= 15 ? loanIds.length * 2000000 : 30000000.
        // },
      );
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
        queryClient.invalidateQueries({ queryKey: ["monoCoolerPosition"] });
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
