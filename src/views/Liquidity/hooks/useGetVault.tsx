import { useQuery } from "@tanstack/react-query";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { getVaultInfo } from "src/views/Liquidity/hooks/useGetSingleSidedLiquidityVaults";
import { useAccount } from "wagmi";

export const useGetVault = ({ address }: { address?: string }) => {
  const networks = useTestableNetworks();
  const { address: walletAddress = "" } = useAccount();
  return useQuery(
    ["getVault", networks.MAINNET, address],
    async () => {
      if (!address) return;
      const vault = await getVaultInfo(address, networks.MAINNET, walletAddress);
      return vault;
    },
    { enabled: !!address },
  );
};
