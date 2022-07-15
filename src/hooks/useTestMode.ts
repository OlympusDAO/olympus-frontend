import { isTestnet } from "src/helpers";
import { useNetwork } from "wagmi";

/**
 * Returns a boolean indicating whether the user's wallet is connected to a testnet.
 */
export const useTestMode = () => {
  const { chain = { id: 1 } } = useNetwork();

  return isTestnet(chain.id);
};
