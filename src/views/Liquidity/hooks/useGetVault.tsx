import { useQuery } from "@tanstack/react-query";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { getVaultInfo } from "src/views/Liquidity/hooks/useGetSingleSidedLiquidityVaults";

export const useGetVault = ({ address }: { address?: string }) => {
  const networks = useTestableNetworks();
  return useQuery(
    ["getVault", networks.MAINNET, address],
    async () => {
      if (!address) return;
      const vault = await getVaultInfo(address, networks.MAINNET);
      console.log("vault", vault);
      return vault;
    },
    { enabled: !!address },
  );
};
