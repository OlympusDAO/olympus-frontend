import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { NetworkId } from "src/constants";
import { COOLER_V2_COMPOSITES_CONTRACT, COOLER_V2_MONOCOOLER_CONTRACT } from "src/constants/contracts";
import { useAccount, useNetwork, useSigner } from "wagmi";

/**
 * Hook to manage MonoCooler authorization for both EOA and smart contract wallets.
 *
 * For EOAs: Uses signature-based authorization (handled in composite functions)
 * For Smart Contract Wallets (multisig): Uses direct authorization transaction
 */
export const useMonoCoolerAuthorization = () => {
  const { address = "" } = useAccount();
  const { data: signer } = useSigner();
  const { chain = { id: NetworkId.MAINNET } } = useNetwork();
  const queryClient = useQueryClient();

  const compositeAddress = COOLER_V2_COMPOSITES_CONTRACT.getAddress(chain.id);

  // Check if the composite contract is currently authorized
  const { data: isAuthorized, isLoading: isCheckingAuthorization } = useQuery({
    queryKey: ["monoCoolerAuthorization", address, compositeAddress, chain.id],
    queryFn: async () => {
      if (!address) return false;

      const coolerContract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id);

      try {
        // Check if the composite contract is authorized for the user
        const authDeadline: BigNumber = await coolerContract.authorizations(address, compositeAddress);

        // If deadline is 0, not authorized. If > current timestamp, authorized.
        const currentTimestamp = Math.floor(Date.now() / 1000);
        return authDeadline.gt(currentTimestamp);
      } catch (error) {
        console.error("Error checking authorization:", error);
        return false;
      }
    },
    enabled: !!address,
    refetchInterval: 60000, // Refresh every 60 seconds
  });

  /**
   * Set authorization directly (for multisig wallets)
   * This function calls setAuthorization() on the MonoCooler contract
   */
  const setAuthorization = useMutation({
    mutationFn: async ({ authorizationDeadline }: { authorizationDeadline?: number } = {}) => {
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);

      // Default to 72 hours (3 days) from now for multisig authorization
      // This is longer than the 1-hour signature auth to reduce friction for multisigs
      const deadline = authorizationDeadline || Math.floor(Date.now() / 1000) + 72 * 60 * 60;

      const tx = await contract.setAuthorization(compositeAddress, deadline, {
        gasLimit: 200000,
      });

      await tx.wait();
      return tx;
    },
    onSuccess: () => {
      // Invalidate authorization query to refresh status
      queryClient.invalidateQueries({
        queryKey: ["monoCoolerAuthorization", address, compositeAddress, chain.id],
      });
    },
  });

  /**
   * Revoke authorization (set deadline to 0)
   */
  const revokeAuthorization = useMutation({
    mutationFn: async () => {
      if (!signer || !address) throw new Error("No signer available");

      const contract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(chain.id).connect(signer);

      // Set deadline to 0 to revoke
      const tx = await contract.setAuthorization(compositeAddress, 0, {
        gasLimit: 200000,
      });

      await tx.wait();
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["monoCoolerAuthorization", address, compositeAddress, chain.id],
      });
    },
  });

  return {
    isAuthorized,
    isCheckingAuthorization,
    setAuthorization,
    revokeAuthorization,
    compositeAddress,
  };
};
