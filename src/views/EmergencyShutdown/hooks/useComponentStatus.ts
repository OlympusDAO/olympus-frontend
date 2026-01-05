import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { ChainAddresses, EmergencyComponent } from "src/generated/emergency";
import * as ABIs from "src/generated/emergency";
import { useProvider } from "wagmi";

/**
 * Status check configuration for different component types
 */
interface StatusCheckConfig {
  functionName: string;
  abi: ethers.ContractInterface;
  /** Whether true return value means component is shut down */
  trueIsShutdown: boolean;
}

/**
 * Maps abiKey to status check configuration
 *
 * Most components use periphery_enabler's isEnabled() function.
 * Special cases have their own status check functions.
 */
const STATUS_CHECK_CONFIG: Record<string, StatusCheckConfig> = {
  periphery_enabler: {
    functionName: "isEnabled",
    abi: ABIs.peripheryEnablerAbi,
    trueIsShutdown: false, // isEnabled() returns false when shut down
  },
  cooler_v2: {
    functionName: "borrowsPaused",
    abi: ABIs.coolerV2Abi,
    trueIsShutdown: true, // borrowsPaused() returns true when shut down
  },
  cross_chain_bridge: {
    functionName: "bridgeActive",
    abi: ABIs.crossChainBridgeAbi,
    trueIsShutdown: false, // bridgeActive() returns false when shut down
  },
  reserve_migrator: {
    functionName: "locallyActive",
    abi: ABIs.reserveMigratorAbi,
    trueIsShutdown: false, // locallyActive() returns false when shut down
  },
  yield_repurchase_facility: {
    functionName: "isShutdown",
    abi: ABIs.yieldRepurchaseFacilityAbi,
    trueIsShutdown: true, // isShutdown() returns true when shut down
  },
  // Emergency contract (minter/treasury) - these are complex, checking isActive
  emergency: {
    functionName: "isActive",
    abi: ABIs.emergencyAbi,
    trueIsShutdown: false, // isActive() returns false when deactivated
  },
};

export interface ComponentStatus {
  isShutdown: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Determines the status check config for a component
 *
 * Uses the abiKey of the first call to determine which status check to use.
 * Returns the first contract that can be checked.
 */
function getStatusCheckInfo(
  component: EmergencyComponent,
  chainAddresses: ChainAddresses | undefined,
): { contractAddress: string; contractKey: string; config: StatusCheckConfig } | null {
  if (!chainAddresses) return null;

  // Find the first call with a known status check config
  for (const call of component.calls) {
    const config = STATUS_CHECK_CONFIG[call.abiKey];
    const contractAddress = chainAddresses[call.contractKey];

    if (config && contractAddress) {
      return { contractAddress, contractKey: call.contractKey, config };
    }
  }

  return null;
}

/**
 * Hook to check on-chain status of an emergency component
 *
 * Reads the appropriate status check function from the contract
 * to determine if the component has already been shut down.
 */
export const useComponentStatus = (
  component: EmergencyComponent,
  chainAddresses: ChainAddresses | undefined,
  chainId: number | undefined,
): ComponentStatus => {
  const provider = useProvider({ chainId });
  const statusInfo = getStatusCheckInfo(component, chainAddresses);

  const { data, isLoading, error } = useQuery(
    ["componentStatus", component.id, chainId, statusInfo?.contractAddress],
    async () => {
      if (!statusInfo || !provider) return null;

      const contract = new ethers.Contract(statusInfo.contractAddress, statusInfo.config.abi, provider);
      const result = await contract[statusInfo.config.functionName]();
      return {
        value: result as boolean,
        trueIsShutdown: statusInfo.config.trueIsShutdown,
      };
    },
    {
      enabled: !!statusInfo && !!provider && !!chainId,
      refetchInterval: 30000, // Refresh every 30 seconds
      staleTime: 10000,
    },
  );

  // Parse the result
  let isShutdown = false;
  if (data) {
    isShutdown = data.trueIsShutdown ? data.value : !data.value;
  }

  return {
    isShutdown,
    isLoading,
    error: error as Error | null,
  };
};

/**
 * Hook to check status of multiple components at once
 *
 * Batches all reads into parallel queries for efficiency.
 */
export const useComponentsStatus = (
  components: EmergencyComponent[],
  chainAddresses: ChainAddresses | undefined,
  chainId: number | undefined,
): Record<string, ComponentStatus> => {
  const provider = useProvider({ chainId });

  // Build status check info for all components
  const statusChecks = components.map(component => ({
    component,
    statusInfo: getStatusCheckInfo(component, chainAddresses),
  }));

  const { data, isLoading, error } = useQuery(
    ["componentsStatus", chainId, components.map(c => c.id).join(","), chainAddresses?.emergency_ms],
    async () => {
      if (!provider) return {};

      const results: Record<string, { value: boolean; trueIsShutdown: boolean }> = {};

      await Promise.all(
        statusChecks.map(async ({ component, statusInfo }) => {
          if (!statusInfo) return;

          try {
            const contract = new ethers.Contract(statusInfo.contractAddress, statusInfo.config.abi, provider);
            const result = await contract[statusInfo.config.functionName]();
            results[component.id] = {
              value: result as boolean,
              trueIsShutdown: statusInfo.config.trueIsShutdown,
            };
          } catch (err) {
            console.error(`Failed to check status for ${component.id}:`, err);
          }
        }),
      );

      return results;
    },
    {
      enabled: components.length > 0 && !!provider && !!chainId && !!chainAddresses,
      refetchInterval: 30000, // Refresh every 30 seconds
      staleTime: 10000,
    },
  );

  // Build result map
  const result: Record<string, ComponentStatus> = {};

  components.forEach(component => {
    const statusData = data?.[component.id];
    if (statusData) {
      result[component.id] = {
        isShutdown: statusData.trueIsShutdown ? statusData.value : !statusData.value,
        isLoading: false,
        error: null,
      };
    } else {
      result[component.id] = {
        isShutdown: false,
        isLoading,
        error: error as Error | null,
      };
    }
  });

  return result;
};
