import { formatCurrency, trim } from "src/helpers";
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
import { Variant } from "@material-ui/core/styles/createTypography";

const sharedProps = {
  labelVariant: "h6" as Variant,
  metricVariant: "h5" as Variant,
};

export const MarketCap = () => {
  const { data: marketCap } = useMarketCap();

  const props: PropsOf<typeof Metric> = {
    ...sharedProps,
    label: t`Market Cap`,
  };

  if (marketCap) props.metric = formatCurrency(marketCap, 0);
  else props.isLoading = true;

  return <Metric {...props} />;
};

export const OHMPrice = () => {
  const { data: marketPrice } = useMarketPrice();

  const props: PropsOf<typeof Metric> = {
    ...sharedProps,
    label: t`OHM Price`,
  };

  if (marketPrice) props.metric = formatCurrency(marketPrice, 2);
  else props.isLoading = true;

  return <Metric {...props} />;
};

export const CircSupply = () => {
  const { data: totalSupply } = useTotalSupply();
  const { data: circSupply } = useOhmCirculatingSupply();

  const props: PropsOf<typeof Metric> = {
    ...sharedProps,
    label: t`Circulating Supply (total)`,
  };

  if (circSupply && totalSupply) props.metric = `${trim(circSupply)} / ${trim(totalSupply)}`;
  else props.isLoading = true;

  return <Metric {...props} />;
};

export const BackingPerOHM = () => {
  const { data: circSupply } = useOhmCirculatingSupply();
  const { data: treasuryValue } = useTreasuryMarketValue();

  const props: PropsOf<typeof Metric> = {
    ...sharedProps,
    label: t`Backing per OHM`,
  };

  if (treasuryValue && circSupply) props.metric = formatCurrency(treasuryValue / circSupply, 2);
  else props.isLoading = true;

  return <Metric {...props} />;
};

export const CurrentIndex = () => {
  const { data: currentIndex } = useCurrentIndex();

  const props: PropsOf<typeof Metric> = {
    ...sharedProps,
    label: t`Current Index`,
    tooltip:
      "The current index tracks the amount of sOHM accumulated since the beginning of staking. Basically, how much sOHM one would have if they staked and held 1 OHM from launch.",
  };

  if (currentIndex) props.metric = `${trim(currentIndex, 2)} sOHM`;
  else props.isLoading = true;

  return <Metric {...props} />;
};

export const GOHMPrice = () => {
  const { data: marketPrice } = useMarketPrice();
  const { data: currentIndex } = useCurrentIndex();

  const props: PropsOf<typeof Metric> = {
    ...sharedProps,
    label: t`gOHM Price`,
    className: "wsoprice",
    tooltip: "gOHM = sOHM * index\n\nThe price of gOHM is equal to the price of OHM multiplied by the current index",
  };

  if (marketPrice && currentIndex) props.metric = formatCurrency(marketPrice * currentIndex, 2);
  else props.isLoading = true;

  return <Metric {...props} />;
};
