import { isTestnet } from "src/helpers";

import { useWeb3Context } from ".";

/**
 * Returns a boolean indicating whether the user's wallet is connected to a testnet.
 */
export const useTestMode = () => {
  const { networkId } = useWeb3Context();

  return isTestnet(networkId);
};
