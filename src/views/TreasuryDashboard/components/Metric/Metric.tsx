import { t } from "@lingui/macro";
import { Metric } from "@olympusdao/component-library";
import { formatCurrency, formatNumber } from "src/helpers";
import { useCurrentIndex } from "src/hooks/useCurrentIndex";
import { useGohmPrice, useOhmPrice } from "src/hooks/usePrices";
import {
  useMarketCap,
  useOhmCirculatingSupply,
  useTotalSupply,
  useTotalValueDeposited,
  useTreasuryMarketValue,
  useTreasuryTotalBacking,
} from "src/hooks/useProtocolMetrics";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";

type MetricProps = PropsOf<typeof Metric>;
type AbstractedMetricProps = Omit<MetricProps, "metric" | "label" | "tooltip" | "isLoading">;

export const MarketCap: React.FC<AbstractedMetricProps> = props => {
  const { data: marketCap } = useMarketCap();

  const _props: MetricProps = {
    ...props,
    label: t`Market Cap`,
  };

  if (marketCap) _props.metric = formatCurrency(marketCap, 0);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const OHMPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: ohmPrice } = useOhmPrice();

  const _props: MetricProps = {
    ...props,
    label: "OHM " + t`Price`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const SOHMPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: ohmPrice } = useOhmPrice();

  const _props: MetricProps = {
    ...props,
    label: "sOHM " + t`Price`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const CircSupply: React.FC<AbstractedMetricProps> = props => {
  const { data: totalSupply } = useTotalSupply();
  const { data: circSupply } = useOhmCirculatingSupply();

  const _props: MetricProps = {
    ...props,
    label: t`Circulating Supply (total)`,
  };

  if (circSupply && totalSupply) _props.metric = `${formatNumber(circSupply)} / ${formatNumber(totalSupply)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const BackingPerOHM: React.FC<AbstractedMetricProps> = props => {
  const { data: circSupply } = useOhmCirculatingSupply();
  const { data: treasuryBacking } = useTreasuryTotalBacking();

  const _props: MetricProps = {
    ...props,
    label: t`Liquid Backing per OHM`,
    tooltip: t`Liquid Treasury Backing does not include LP OHM, locked assets, or reserves used for RFV backing. It represents the budget the Treasury has for specific market operations which cannot use OHM (inverse bonds, some liquidity provision, OHM incentives, etc)
    `,
  };

  if (circSupply && treasuryBacking) _props.metric = `${formatCurrency(treasuryBacking / circSupply, 2)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const CurrentIndex: React.FC<AbstractedMetricProps> = props => {
  const { data: currentIndex } = useCurrentIndex();

  const _props: MetricProps = {
    ...props,
    label: t`Current Index`,
    tooltip: t`The current index tracks the amount of sOHM accumulated since the beginning of staking. Basically, how much sOHM one would have if they staked and held 1 OHM from launch.`,
  };

  if (currentIndex) _props.metric = `${currentIndex.toString({ decimals: 2, trim: false, format: true })} sOHM`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const GOHMPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: gOhmPrice } = useGohmPrice();

  const _props: MetricProps = {
    ...props,
    label: "gOHM " + t`Price`,
    tooltip:
      "gOHM = sOHM * index" +
      "\n\n" +
      t`The price of gOHM is equal to the price of OHM multiplied by the current index`,
  };

  if (gOhmPrice) _props.metric = formatCurrency(gOhmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const TotalValueDeposited: React.FC<AbstractedMetricProps> = props => {
  const { data: totalValueDeposited } = useTotalValueDeposited();

  const _props: MetricProps = {
    ...props,
    label: t`Total Value Deposited`,
  };

  if (totalValueDeposited) _props.metric = formatCurrency(totalValueDeposited, 0);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const StakingAPY: React.FC<AbstractedMetricProps> = props => {
  const { data: rebaseRate } = useStakingRebaseRate();

  const _props: MetricProps = {
    ...props,
    label: t`APY`,
  };

  if (rebaseRate) {
    const apy = (Math.pow(1 + rebaseRate, 365 * 3) - 1) * 100;
    const formatted = formatNumber(apy, 1);

    _props.metric = `${formatted}%`;
  } else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const TreasuryBalance: React.FC<AbstractedMetricProps> = props => {
  const { data: treasuryMarketValue } = useTreasuryMarketValue();

  const _props: MetricProps = {
    ...props,
    label: t`Treasury Balance`,
  };

  if (treasuryMarketValue) _props.metric = formatCurrency(treasuryMarketValue);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};
