import { useQuery } from "react-query";
import { BOND_DEPOSITORY_ADDRESSES } from "src/constants/addresses";
import { useStaticBondContract } from "src/hooks/useContract";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

export const liveBondMarketsQueryKey = () => ["useLiveBondMarkets"];

export const useLiveBondMarkets = () => {
  const networks = useTestableNetworks();
  const contract = useStaticBondContract(BOND_DEPOSITORY_ADDRESSES[networks.MAINNET], networks.MAINNET);

  return useQuery<string[], Error>(
    liveBondMarketsQueryKey(),
    async () => {
      const markets = await contract.liveMarkets();

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
      suspense: true,
      /**
       * By default, when suspense is set to `true`. Errors will also
       * be thrown to nearest ErrorBoundary so we turn that functionality
       * off for now.
       */
      useErrorBoundary: false,
    },
  );
};
