import { Providers } from "src/helpers/providers/Providers/Providers";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { BLEVaultLido__factory } from "src/typechain";
import { useQuery } from "wagmi";

export const useGetLastDeposit = ({ userVaultAddress }: { userVaultAddress?: string }) => {
  const networks = useTestableNetworks();
  return useQuery(
    ["getLastDeposit", networks.MAINNET, userVaultAddress],
    async () => {
      if (!userVaultAddress) return;
      const provider = Providers.getStaticProvider(networks.MAINNET);
      const contract = BLEVaultLido__factory.connect(userVaultAddress, provider);
      const lastDeposit = (await contract.lastDeposit()).toString();
      return lastDeposit;
    },
    { enabled: !!userVaultAddress },
  );
};
