import { useQuery } from "@tanstack/react-query";
import { COOLER_CLEARING_HOUSE_CONTRACT } from "src/constants/contracts";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

/**
 * Gets the Clearinghouse details for mainnet
 */
export const useGetClearingHouse = () => {
  const networks = useTestableNetworks();
  const contract = COOLER_CLEARING_HOUSE_CONTRACT.getEthersContract(networks.MAINNET);
  const { data, isFetched, isLoading } = useQuery(["getClearingHouse", networks.MAINNET], async () => {
    const factory = await contract.factory();
    const collateralAddress = await contract.gOHM();
    const debtAddress = await contract.dai();

    return {
      factory,
      collateralAddress,
      debtAddress,
    };
  });
  return { data, isFetched, isLoading };
};
