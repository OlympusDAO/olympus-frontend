import { useQuery } from "@tanstack/react-query";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { BLEVaultManagerLido__factory } from "src/typechain";
import { useAccount } from "wagmi";

export const useGetUserVault = ({ address }: { address?: string }) => {
  const networks = useTestableNetworks();
  const { address: walletAddress = "" } = useAccount();
  return useQuery(
    ["getUserVault", networks.MAINNET, address, walletAddress],
    async () => {
      if (!address) return;
      const provider = Providers.getStaticProvider(networks.MAINNET);
      const contract = BLEVaultManagerLido__factory.connect(address, provider);
      const userVaultAddress = await contract.userVaults(walletAddress).catch(() => undefined);
      return userVaultAddress;
    },
    { enabled: !!address },
  );
};
