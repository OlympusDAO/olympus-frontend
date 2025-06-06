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

  // Function for newOwner to authorize the migrator contract
  const authorizeMigrator = async () => {
    if (!signer) throw new Error("Please connect a wallet");

    const migratorAddress = COOLER_V2_MIGRATOR_CONTRACT.getAddress(networks.MAINNET_HOLESKY);
    const v2Contract = CoolerV2MonoCooler__factory.connect(
      COOLER_V2_MONOCOOLER_CONTRACT.getAddress(networks.MAINNET_HOLESKY),
      signer,
    );

    if (!migratorAddress) throw new Error("Missing migrator contract address");

    // Set authorization deadline to 1 hour from now
    const authorizationDeadline = Math.floor(Date.now() / 1000) + 3600;

    const tx = await v2Contract.setAuthorization(migratorAddress, authorizationDeadline);
    const receipt = await tx.wait();
    return receipt;
  };

  // Check if an address has authorized the migrator
  const checkAuthorization = async (ownerAddress: string) => {
    if (!provider) throw new Error("Please connect a wallet");

    const migratorAddress = COOLER_V2_MIGRATOR_CONTRACT.getAddress(networks.MAINNET_HOLESKY);
    const v2Contract = CoolerV2MonoCooler__factory.connect(
      COOLER_V2_MONOCOOLER_CONTRACT.getAddress(networks.MAINNET_HOLESKY),
      provider,
    );

    if (!migratorAddress) throw new Error("Missing migrator contract address");

    const authorizationDeadline = await v2Contract.authorizations(ownerAddress, migratorAddress);
    const currentTimestamp = Math.floor(Date.now() / 1000);

    return authorizationDeadline.toNumber() > currentTimestamp;
  };

  // Main mutation for consolidation
  const mutation = useMutation(
    async ({ coolers, newOwner }: { coolers: string[]; newOwner: string }) => {
      if (!signer) throw new Error("Please connect a wallet");

      const address = await signer.getAddress();
      const migratorAddress = COOLER_V2_MIGRATOR_CONTRACT.getAddress(networks.MAINNET_HOLESKY);
      const v2Contract = CoolerV2MonoCooler__factory.connect(
        COOLER_V2_MONOCOOLER_CONTRACT.getAddress(networks.MAINNET_HOLESKY),
        provider,
      );
      const v2ContractAddress = v2Contract.address;

      if (!migratorAddress || !v2ContractAddress) throw new Error("Missing contract addresses");

      const isNewOwner = address !== newOwner;

      let auth;
      let signature;

      if (isNewOwner) {
        // When newOwner is different, don't provide authorization
        // The newOwner should call setAuthorization() separately
        auth = {
          account: "0x0000000000000000000000000000000000000000", // Zero address
          authorized: migratorAddress,
          authorizationDeadline: 0,
          nonce: 0,
          signatureDeadline: 0,
        };
        signature = {
          v: 0,
          r: "0x0000000000000000000000000000000000000000000000000000000000000000",
          s: "0x0000000000000000000000000000000000000000000000000000000000000000",
        };
      } else {
        // When newOwner is the same as signer, provide authorization
        const nonce = await v2Contract.authorizationNonces(address);

        const result = await getAuthorizationSignature({
          userAddress: address,
          authorizedAddress: migratorAddress as `0x${string}`,
          verifyingContract: v2ContractAddress as `0x${string}`,
          chainId: networks.MAINNET_HOLESKY,
          nonce: nonce.toString(),
          signTypedDataAsync,
        });

        auth = result.auth;
        signature = result.signature;
      }

      // 3. Call the migrator contract
      const contract = CoolerV2Migrator__factory.connect(migratorAddress, signer);
      const tx = await contract.consolidate(
        coolers,
        newOwner,
        auth,
        signature,
        [], // delegationRequests
        {
          gasLimit: isNewOwner ? 1000000 : undefined,
        },
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

  return { ...mutation, previewConsolidate, authorizeMigrator, checkAuthorization };
};
