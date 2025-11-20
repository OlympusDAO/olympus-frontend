import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { COOLER_V2_MIGRATOR_CONTRACT, COOLER_V2_MONOCOOLER_CONTRACT } from "src/constants/contracts";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useAccount } from "wagmi";

/**
 * Hook to check if the Migrator contract is authorized for the user's address.
 * Used to determine if multisig wallets need to call setAuthorization before migrating.
 */
export const useMigratorAuthorization = () => {
  const { address = "" } = useAccount();
  const networks = useTestableNetworks();

  const migratorAddress = COOLER_V2_MIGRATOR_CONTRACT.getAddress(networks.MAINNET_SEPOLIA);

  // Check if the migrator contract is currently authorized
  const { data: isAuthorized, isLoading: isCheckingAuthorization } = useQuery({
    queryKey: ["migratorAuthorization", address, migratorAddress, networks.MAINNET_SEPOLIA],
    queryFn: async () => {
      if (!address) return false;

      const coolerContract = COOLER_V2_MONOCOOLER_CONTRACT.getEthersContract(networks.MAINNET_SEPOLIA);

      try {
        // Check if the migrator contract is authorized for the user
        const authDeadline: BigNumber = await coolerContract.authorizations(address, migratorAddress);

        // If deadline is 0, not authorized. If > current timestamp, authorized.
        const currentTimestamp = Math.floor(Date.now() / 1000);
        return authDeadline.gt(currentTimestamp);
      } catch (error) {
        console.error("Error checking migrator authorization:", error);
        return false;
      }
    },
    enabled: !!address,
    refetchInterval: 600000, // Refresh every 10 minutes
  });

  return {
    isAuthorized,
    isCheckingAuthorization,
    migratorAddress,
  };
};
