import { useQuery } from "@tanstack/react-query";
import { COOLER_CONSOLIDATION_ADDRESSES } from "src/constants/addresses";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { CoolerConsolidation__factory } from "src/typechain";
import { useProvider } from "wagmi";

export const useCheckConsolidatorActive = () => {
  const networks = useTestableNetworks();
  const provider = useProvider();

  return useQuery({
    queryKey: ["consolidatorActive"],
    queryFn: async () => {
      const contract = CoolerConsolidation__factory.connect(COOLER_CONSOLIDATION_ADDRESSES[networks.MAINNET], provider);
      const isActive = await contract.isActive();
      return isActive;
    },
  });
};
