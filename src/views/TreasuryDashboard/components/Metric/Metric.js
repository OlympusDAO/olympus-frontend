import { formatCurrency } from "../../../../helpers";
import { Metric } from "src/components/Metric";
import { t } from "@lingui/macro";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useMarketPrice } from "src/hooks/useMarketPrice";
import {
  useMarketCap,
  useOhmCirculatingSupply,
  useTotalSupply,
  useTreasuryMarketValue,
} from "src/hooks/useProtocolMetrics";

const sharedProps = {
  labelVariant: "h6",
  metricVariant: "h5",
};

export const MarketCap = () => {
  const marketCapQuery = useMarketCap();

  return (
    <Metric
      {...sharedProps}
      label={t`Market Cap`}
      isLoading={marketCapQuery.isLoading}
      metric={formatCurrency(marketCapQuery.data, 0)}
    />
  );
};

export const OHMPrice = () => {
  const marketPriceQuery = useMarketPrice();

  return (
    <Metric
      {...sharedProps}
      label={t`OHM Price`}
      isLoading={marketPriceQuery.isLoading}
      metric={marketPriceQuery.data && formatCurrency(marketPriceQuery.data, 2)}
    />
  );
};

export const CircSupply = () => {
  const totalSupplyQuery = useTotalSupply();
  const ohmCirculatingSupplyQuery = useOhmCirculatingSupply();

  const isLoading = totalSupplyQuery.isLoading || ohmCirculatingSupplyQuery.isLoading;

  return (
    <Metric
      {...sharedProps}
      isLoading={isLoading}
      label={t`Circulating Supply (total)`}
      metric={`${parseInt(ohmCirculatingSupplyQuery.data)} / ${parseInt(totalSupplyQuery.data)}`}
    />
  );
};

export const BackingPerOHM = () => {
  const treasuryMarketValueQuery = useTreasuryMarketValue();
  const ohmCirculatingSupplyQuery = useOhmCirculatingSupply();

  const isLoading = treasuryMarketValueQuery.isLoading || ohmCirculatingSupplyQuery.isLoading;
  const backingPerOhm = treasuryMarketValueQuery.data / ohmCirculatingSupplyQuery.data;

  return (
    <Metric
      {...sharedProps}
      isLoading={isLoading}
      label={t`Backing per OHM`}
      metric={backingPerOhm && formatCurrency(backingPerOhm, 2)}
    />
  );
};

export const CurrentIndex = () => {
  const currentIndexQuery = useCurrentIndex();

  return (
    <Metric
      {...sharedProps}
      label={t`Current Index`}
      isLoading={currentIndexQuery.isLoading}
      metric={`${currentIndexQuery.data?.toFixed(2)} sOHM`}
      tooltip="The current index tracks the amount of sOHM accumulated since the beginning of staking. Basically, how much sOHM one would have if they staked and held a single OHM from day 1."
    />
  );
};

export const GOHMPrice = () => {
  const marketPriceQuery = useMarketPrice();
  const currentIndexQuery = useCurrentIndex();

  const isLoading = marketPriceQuery.isLoading || currentIndexQuery.isLoading;
  const gOhmPrice = marketPriceQuery.data * currentIndexQuery.data;

  return (
    <Metric
      {...sharedProps}
      className="wsoprice"
      label={t`gOHM Price`}
      isLoading={isLoading}
      metric={gOhmPrice && formatCurrency(gOhmPrice, 2)}
      tooltip={`gOHM = sOHM * index\n\nThe price of gOHM is equal to the price of OHM multiplied by the current index`}
    />
  );
};
