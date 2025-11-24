import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { COOLER_V2_MIGRATOR_CONTRACT, COOLER_V2_MONOCOOLER_CONTRACT } from "src/constants/contracts";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { balanceQueryKey } from "src/hooks/useBalance";
import { contractAllowanceQueryKey } from "src/hooks/useContractAllowance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CoolerV2Migrator__factory, CoolerV2MonoCooler__factory } from "src/typechain";
import { useMigratorAuthorization } from "src/views/Lending/Cooler/hooks/useMigratorAuthorization";
import { useIsSmartContractWallet } from "src/views/Lending/CoolerV2/hooks/useIsSmartContractWallet";
import { getAuthorizationSignature } from "src/views/Lending/CoolerV2/utils/getAuthorizationSignature";
import { useProvider, useSigner, useSignTypedData } from "wagmi";

export const useConsolidateCooler = () => {
  const { data: signer } = useSigner();
  const { signTypedDataAsync } = useSignTypedData();
  const queryClient = useQueryClient();
  const networks = useTestableNetworks();
  const provider = useProvider();
  const { isSmartContractWallet } = useIsSmartContractWallet();
  const { isAuthorized: isMigratorAuthorized } = useMigratorAuthorization();

  // Preview function for UI
  const previewConsolidate = async (coolers: string[]) => {
    if (!provider) throw new Error("Please connect a wallet");
    const contract = CoolerV2Migrator__factory.connect(
      COOLER_V2_MIGRATOR_CONTRACT.addresses[networks.MAINNET_SEPOLIA],
      provider,
    );
    const [collateralAmount, borrowAmount] = await contract.previewConsolidate(coolers);
    return { collateralAmount, borrowAmount };
  };

  // Mutation to set authorization for migrator (for multisig wallets)
  const setMigratorAuthorization = useMutation(
    async () => {
      if (!signer) throw new Error("Please connect a wallet");

      const v2Contract = CoolerV2MonoCooler__factory.connect(
        COOLER_V2_MONOCOOLER_CONTRACT.getAddress(networks.MAINNET_SEPOLIA),
        signer,
      );

      const migratorAddress = COOLER_V2_MIGRATOR_CONTRACT.getAddress(networks.MAINNET_SEPOLIA);
      if (!migratorAddress) throw new Error("Missing migrator contract address");

      // Default to 72 hours (3 days) from now for multisig authorization
      const deadline = Math.floor(Date.now() / 1000) + 72 * 60 * 60;

      const tx = await v2Contract.setAuthorization(migratorAddress, deadline, {
        gasLimit: 200000,
      });

      await tx.wait();
      return tx;
    },
    {
      onError: (error: Error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast("Migrator contract authorized successfully");
      },
    },
  );

  // Main mutation for consolidation
  const mutation = useMutation(
    async ({
      coolers,
      newOwner,
      isAuthorized = false,
    }: {
      coolers: string[];
      newOwner: string;
      isAuthorized?: boolean;
    }) => {
      if (!signer) throw new Error("Please connect a wallet");

      const address = await signer.getAddress();

      // 1. Get nonce from V2 contract for new owner
      const v2Contract = CoolerV2MonoCooler__factory.connect(
        COOLER_V2_MONOCOOLER_CONTRACT.getAddress(networks.MAINNET_SEPOLIA),
        provider,
      );

      // 2. Get migrator address
      const migratorAddress = COOLER_V2_MIGRATOR_CONTRACT.getAddress(networks.MAINNET_SEPOLIA);
      const v2ContractAddress = v2Contract.address;
      if (!migratorAddress || !v2ContractAddress) throw new Error("Missing contract addresses");

      //check if signer is the new owner
      const isNewOwner = address !== newOwner;

      let auth;
      let signature;

      // For smart contract wallets that are already authorized, use empty auth/sig
      if (isAuthorized) {
        auth = {
          account: "0x0000000000000000000000000000000000000000",
          authorized: "0x0000000000000000000000000000000000000000",
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
        // For EOAs, generate EIP-712 signature
        const nonce = await v2Contract.authorizationNonces(address);
        const result = await getAuthorizationSignature({
          userAddress: address,
          authorizedAddress: migratorAddress as `0x${string}`,
          verifyingContract: v2ContractAddress as `0x${string}`,
          chainId: networks.MAINNET_SEPOLIA,
          nonce: nonce.toString(),
          signTypedDataAsync,
        });
        auth = result.auth;
        signature = result.signature;
      }

      console.log("isNewOwner", isNewOwner);
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
        // {
        //   gasLimit: 5000000, // probably need to do what we did before. loanIds.length <= 15 ? loanIds.length * 2000000 : 30000000.
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

  return {
    ...mutation,
    previewConsolidate,
    setMigratorAuthorization,
    isSmartContractWallet,
    isMigratorAuthorized,
  };
};
