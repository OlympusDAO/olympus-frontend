import { useCallback, useState } from "react";
import { useSigner } from "wagmi";

/**
 * Hook to sign Safe transaction hashes
 *
 * The backend provides the safeTxHash from the /prepare endpoint.
 * This hook signs that hash using eth_sign format (which Safe expects).
 */
export const useSignSafeTransaction = () => {
  const { data: signer } = useSigner();
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Sign a safeTxHash provided by the backend
   * @param safeTxHash - The Safe transaction hash from /prepare endpoint
   * @returns The signature in Safe-compatible format
   */
  const signSafeTxHash = useCallback(
    async (safeTxHash: string): Promise<string> => {
      if (!signer) {
        throw new Error("No signer available. Please connect your wallet.");
      }

      setIsSigning(true);
      setError(null);

      try {
        const { ethers } = await import("ethers");

        // For Safe, we sign the hash using eth_sign format
        // which prepends "\x19Ethereum Signed Message:\n32"
        // Use ethers.utils.arrayify to convert hex to bytes (browser-compatible)
        const signature = await signer.signMessage(ethers.utils.arrayify(safeTxHash));

        // Safe expects the signature with v adjusted for eth_sign type
        // eth_sign signatures have v = 27 or 28, Safe expects v + 4 to indicate eth_sign signature type
        const sig = ethers.utils.splitSignature(signature);
        const adjustedV = sig.v + 4; // Indicate eth_sign signature type
        const adjustedSignature = ethers.utils.hexlify(
          ethers.utils.concat([sig.r, sig.s, ethers.utils.hexlify(adjustedV)]),
        );

        return adjustedSignature;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to sign transaction");
        setError(error);
        throw error;
      } finally {
        setIsSigning(false);
      }
    },
    [signer],
  );

  return {
    signSafeTxHash,
    isSigning,
    error,
  };
};
