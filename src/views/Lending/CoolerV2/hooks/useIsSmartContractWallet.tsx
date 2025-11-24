import { useEffect, useState } from "react";
import { useAccount, useProvider } from "wagmi";

/**
 * Detects if the connected wallet is a smart contract wallet (multisig, Safe, etc.)
 *
 * Smart contract wallets cannot sign EIP-712 messages directly with signTypedData,
 * so they need alternative authorization flows for Cooler V2.
 */
export const useIsSmartContractWallet = () => {
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const [isSmartContractWallet, setIsSmartContractWallet] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkIfSmartContract = async () => {
      if (!address || !isConnected || !provider) {
        setIsSmartContractWallet(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Get the bytecode at the address
        const code = await provider.getCode(address);

        // If bytecode exists and is not empty (0x or 0x0), it's a contract
        const isContract = code !== undefined && code !== "0x" && code.length > 2;

        setIsSmartContractWallet(isContract);
      } catch (error) {
        console.error("Error checking if wallet is smart contract:", error);
        setIsSmartContractWallet(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfSmartContract();
  }, [address, isConnected, provider]);

  return { isSmartContractWallet, isLoading };
};
