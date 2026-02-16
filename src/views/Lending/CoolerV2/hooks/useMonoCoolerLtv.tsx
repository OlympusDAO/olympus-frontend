import { useQuery } from "@tanstack/react-query";
import { multicall } from "@wagmi/core";
import { formatUnits } from "ethers/lib/utils";
import { COOLER_V2_MONOCOOLER_ADDRESSES } from "src/constants/addresses";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CoolerV2MonoCooler__factory } from "src/typechain";

/**
 * Fetches the Cooler V2 loan-to-value ratios from the contract.
 * Does not require a connected wallet.
 */
export const useMonoCoolerLtv = () => {
  const networks = useTestableNetworks();

  return useQuery(["monoCoolerLtv", networks.MAINNET_SEPOLIA], async () => {
    const config = {
      address: COOLER_V2_MONOCOOLER_ADDRESSES[networks.MAINNET_SEPOLIA] as `0x${string}`,
      abi: CoolerV2MonoCooler__factory.abi,
    };

    const [[maxOriginationLtv, liquidationLtv]] = await multicall({
      contracts: [
        {
          ...config,
          functionName: "loanToValues",
        },
      ],
    });

    return {
      maxOriginationLtv: Number(formatUnits(maxOriginationLtv, 18)),
      liquidationLtv: Number(formatUnits(liquidationLtv, 18)),
    };
  });
};
