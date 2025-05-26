import { useQuery } from "@tanstack/react-query";
import { multicall } from "@wagmi/core";
import { DAO_TREASURY_ADDRESSES, SUSDS_ADDRESSES } from "src/constants/addresses";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { ERC4626__factory } from "src/typechain";

export const useMonoCoolerCapacity = () => {
  const networks = useTestableNetworks();
  const provider = Providers.getStaticProvider(networks.MAINNET_HOLESKY);

  return useQuery(["monoCoolerCapacity", networks.MAINNET_HOLESKY], async () => {
    const [sDebtTokenBalance] = await multicall({
      contracts: [
        {
          abi: ERC4626__factory.abi,
          address: SUSDS_ADDRESSES[networks.MAINNET_HOLESKY] as `0x${string}`,
          functionName: "balanceOf",
          args: [DAO_TREASURY_ADDRESSES[networks.MAINNET_HOLESKY] as `0x${string}`],
        },
      ],
    });

    const debtTokenBalance = await ERC4626__factory.connect(
      SUSDS_ADDRESSES[networks.MAINNET_HOLESKY],
      provider,
    ).convertToAssets(sDebtTokenBalance);

    return {
      globalBorrowingCapacity: debtTokenBalance,
    };
  });
};
