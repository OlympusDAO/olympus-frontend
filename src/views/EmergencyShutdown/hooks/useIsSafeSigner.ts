import { useQuery } from "@tanstack/react-query";
import { SAFE_TX_SERVICE_URLS } from "src/views/EmergencyShutdown/utils/safeTransaction";

interface SafeInfo {
  address: string;
  nonce: number;
  threshold: number;
  owners: string[];
  masterCopy: string;
  modules: string[];
  fallbackHandler: string;
  guard: string;
  version: string;
}

/**
 * Fetches Safe info from Safe Transaction Service API
 */
async function fetchSafeInfo(safeAddress: string, chainId: number): Promise<SafeInfo | null> {
  const baseUrl = SAFE_TX_SERVICE_URLS[chainId];
  if (!baseUrl) return null;

  try {
    const response = await fetch(`${baseUrl}/safes/${safeAddress}/`);
    if (!response.ok) {
      console.warn(`Failed to fetch Safe info for ${safeAddress}: ${response.statusText}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.warn(`Error fetching Safe info for ${safeAddress}:`, error);
    return null;
  }
}

export interface SafeSignerStatus {
  isEmergencySigner: boolean;
  isDaoSigner: boolean;
  isLoading: boolean;
  error: Error | null;
  emergencyThreshold: number | null;
  emergencyOwnerCount: number | null;
  daoThreshold: number | null;
  daoOwnerCount: number | null;
}

/**
 * Hook to check if connected user is a signer on Emergency MS or DAO MS
 *
 * Uses Safe Transaction Service API to fetch list of owners
 * and checks if user address is included.
 */
export const useIsSafeSigner = (
  userAddress: string | undefined,
  emergencyMsAddress: string | undefined,
  daoMsAddress: string | undefined,
  chainId: number | undefined,
): SafeSignerStatus => {
  // Fetch Emergency MS info
  const {
    data: emergencyInfo,
    isLoading: emergencyLoading,
    error: emergencyError,
  } = useQuery(
    ["safeInfo", "emergency", emergencyMsAddress, chainId],
    () => fetchSafeInfo(emergencyMsAddress!, chainId!),
    {
      enabled: !!emergencyMsAddress && !!chainId && emergencyMsAddress !== "0x0000000000000000000000000000000000000000",
      staleTime: 60000, // Cache for 1 minute
      refetchInterval: 120000, // Refresh every 2 minutes
    },
  );

  // Fetch DAO MS info
  const {
    data: daoInfo,
    isLoading: daoLoading,
    error: daoError,
  } = useQuery(["safeInfo", "dao", daoMsAddress, chainId], () => fetchSafeInfo(daoMsAddress!, chainId!), {
    enabled: !!daoMsAddress && !!chainId && daoMsAddress !== "0x0000000000000000000000000000000000000000",
    staleTime: 60000,
    refetchInterval: 120000,
  });

  // Check if user is in owners list
  const normalizedUserAddress = userAddress?.toLowerCase();

  const isEmergencySigner =
    !!normalizedUserAddress &&
    !!emergencyInfo?.owners &&
    emergencyInfo.owners.some(owner => owner.toLowerCase() === normalizedUserAddress);

  const isDaoSigner =
    !!normalizedUserAddress &&
    !!daoInfo?.owners &&
    daoInfo.owners.some(owner => owner.toLowerCase() === normalizedUserAddress);

  return {
    isEmergencySigner,
    isDaoSigner,
    isLoading: emergencyLoading || daoLoading,
    error: (emergencyError || daoError) as Error | null,
    emergencyThreshold: emergencyInfo?.threshold ?? null,
    emergencyOwnerCount: emergencyInfo?.owners?.length ?? null,
    daoThreshold: daoInfo?.threshold ?? null,
    daoOwnerCount: daoInfo?.owners?.length ?? null,
  };
};
