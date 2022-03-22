import { useQuery } from "react-query";
import { BOND_DEPOSITORY_CONTRACT, OP_BOND_DEPOSITORY_CONTRACT } from "src/constants/contracts";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

export const liveBondMarketsQueryKey = (isInverseBond: boolean) => ["useLiveBondMarkets", isInverseBond];

export const useLiveBondMarkets = ({
  isInverseBond = false,
  shouldSuspend = false,
}: {
  isInverseBond?: boolean;
  shouldSuspend?: boolean;
} = {}) => {
  const networks = useTestableNetworks();

  return useQuery<string[], Error>(
    liveBondMarketsQueryKey(isInverseBond),
    async () => {
      const provider = Providers.getStaticProvider(networks.MAINNET);
      const contract = isInverseBond ? OP_BOND_DEPOSITORY_CONTRACT : BOND_DEPOSITORY_CONTRACT;
      const bonds = contract.getEthersContract(networks.MAINNET).connect(provider);

      const markets = await bonds.liveMarkets();

      return markets.map(market => market.toString());
    },
    {
      /**
       * Since this request will likely create waterfalled requests,
       * i.e. we fetch all the indexes of the live markets before
       * making a request for each individual index, we can enable
       * suspense to suspend the UI until all the data is loaded and
       * prevent ugly CLS.
       */
      suspense: shouldSuspend,
      /**
       * By default, when suspense is set to `true`. Errors will also
       * be thrown to nearest ErrorBoundary so we turn that functionality
       * off for now.
       */
      useErrorBoundary: false,
    },
  );
};
