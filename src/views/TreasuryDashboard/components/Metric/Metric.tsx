import { Metric } from "@olympusdao/component-library";
import { formatCurrency, formatNumber } from "src/helpers";
import { SUBGRAPH_URLS } from "src/helpers/SubgraphUrlHelper";
import { useGohmPrice, useOhmPrice } from "src/hooks/usePrices";
import {
  useCurrentIndex,
  useGOhmPrice as useGOhmPriceFromSubgraph,
  useOhmPrice as useOhmPriceFromSubgraph,
  useOhmTotalSupply,
  useTotalValueDeposited,
} from "src/hooks/useProtocolMetrics";
import { useStakingRebaseRate } from "src/hooks/useStakingRebaseRate";
import { useTokenRecordsLatestRecord, useTreasuryMarketValue } from "src/hooks/useTokenRecordsMetrics";
import { useOhmCirculatingSupply, useOhmFloatingSupply } from "src/hooks/useTokenSupplyMetrics";
import { useLiquidBackingPerGOhm, useLiquidBackingPerOhmFloating, useMarketCap } from "src/hooks/useTreasuryMetrics";

export type MetricSubgraphProps = {
  subgraphUrls?: SUBGRAPH_URLS;
  subgraphUrl?: string;
  earliestDate?: string | null;
};
type MetricProps = PropsOf<typeof Metric>;
export type AbstractedMetricProps = Omit<MetricProps, "metric" | "label" | "tooltip" | "isLoading">;

export const MarketCap: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const { data: marketCap } = useMarketCap(props.subgraphUrl);
  const _props: MetricProps = {
    ...props,
    label: `OHM Market Cap`,
    tooltip: `Market capitalization is the dollar value of the outstanding OHM tokens. It is calculated here as the price of OHM multiplied by the circulating supply. 
    
    As the displayed OHM price is rounded to 2 decimal places, a manual calculation using the displayed values is likely to slightly differ from the reported market cap. The reported market cap is accurate, as it uses the unrounded price of OHM.

    Note: other sources may be inaccurate.`,
  };

  if (marketCap) _props.metric = formatCurrency(marketCap, 0);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * same as OHMPriceFromSubgraph but uses OHM-DAI on-chain price
 */
export const OHMPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: ohmPrice } = useOhmPrice();
  const _props: MetricProps = {
    ...props,
    label: "OHM " + `Price`,
    tooltip: `This price is sourced from the subgraph, so will lag the real-time market rate.`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * same as OHMPrice but uses Subgraph price
 */
export const OHMPriceFromSubgraph: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const { data: ohmPrice } = useOhmPriceFromSubgraph(props.subgraphUrl);
  const _props: MetricProps = {
    ...props,
    label: "OHM " + `Price`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * uses on-chain price
 */
export const SOHMPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: ohmPrice } = useOhmPrice();

  const _props: MetricProps = {
    ...props,
    label: "sOHM " + `Price`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const OhmCirculatingSupply: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const { data: totalSupply } = useOhmTotalSupply(props.subgraphUrl);
  const { data: circSupply } = useOhmCirculatingSupply(props.subgraphUrl);
  const _props: MetricProps = {
    ...props,
    label: `OHM Circulating Supply / Total`,
    tooltip: `Circulating supply is the quantity of outstanding OHM not held by the protocol in the treasury. OHM deployed in Protocol-Owned Liquidity is therefore included in circulating supply.`,
  };

  if (circSupply && totalSupply) _props.metric = `${formatNumber(circSupply)} / ${formatNumber(totalSupply)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const GOhmCirculatingSupply: React.FC<AbstractedMetricProps> = props => {
  const _props: MetricProps = {
    ...props,
    label: `gOHM Circulating Supply / Total`,
    tooltip: `gOHM supply is synthetically derived from OHM supply divided by the index.`,
  };

  _props.metric = `- / -`;

  return <Metric {..._props} />;
};

export const BackingPerOHM: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const { data: floatingSupply } = useOhmFloatingSupply(props.subgraphUrl);
  /**
   * Liquid backing per OHM floating is used as the metric here.
   * Liquid backing does not include OHM in protocol-owned liquidity,
   * so it makes sense to do the same for the denominator, and floating supply
   * is circulating supply - OHM in liquidity.
   */
  const { data: liquidBackingPerOhmFloating } = useLiquidBackingPerOhmFloating(props.subgraphUrls);

  // We include floating supply in the tooltip, as it is not displayed as a separate metric anywhere else
  const tooltip = `Liquid backing is divided by floating supply of OHM to give liquid backing per OHM.\n\nFloating supply is the quantity of outstanding OHM not held by the protocol in the treasury and not deployed in Protocol-Owned Liquidity: ${
    floatingSupply ? formatNumber(floatingSupply) : "Loading..."
  }
  `;

  const _props: MetricProps = {
    ...props,
    label: `Liquid Backing per OHM`,
    tooltip: tooltip,
  };

  if (liquidBackingPerOhmFloating) _props.metric = `${formatCurrency(liquidBackingPerOhmFloating, 2)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const BackingPerGOHM: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const { data: liquidBackingPerGOhmCirculating } = useLiquidBackingPerGOhm(props.subgraphUrls);

  const tooltip = `Liquid backing per gOHM is synthetically calculated as liquid backing multiplied by the current index and divided by OHM floating supply.`;

  const _props: MetricProps = {
    ...props,
    label: `Liquid Backing per gOHM`,
    tooltip: tooltip,
  };

  if (liquidBackingPerGOhmCirculating) _props.metric = `${formatCurrency(liquidBackingPerGOhmCirculating, 2)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const CurrentIndex: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const { data: currentIndex } = useCurrentIndex(props.subgraphUrl);
  const _props: MetricProps = {
    ...props,
    label: `Current Index`,
    tooltip: `The current index tracks the amount of OHM accumulated since the beginning of staking. Basically, how much OHM one would have if they staked and held 1 OHM from launch.`,
  };

  if (currentIndex) _props.metric = `${formatNumber(currentIndex, 2)} OHM`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * uses contract price
 */
export const GOHMPrice: React.FC<AbstractedMetricProps> = props => {
  const { data: gOhmPrice } = useGohmPrice();

  const _props: MetricProps = {
    ...props,
    label: "gOHM " + `Price`,
    tooltip:
      "gOHM = sOHM * index" + "\n\n" + `The price of gOHM is equal to the price of OHM multiplied by the current index`,
  };

  if (gOhmPrice) _props.metric = formatCurrency(gOhmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const GOHMPriceFromSubgraph: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const { data: gOhmPrice } = useGOhmPriceFromSubgraph(props.subgraphUrl);
  const _props: MetricProps = {
    ...props,
    label: "gOHM " + `Price`,
    tooltip:
      "gOHM = sOHM * index" + "\n\n" + `The price of gOHM is equal to the price of OHM multiplied by the current index`,
  };

  if (gOhmPrice) _props.metric = formatCurrency(gOhmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const TotalValueDeposited: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const { data: totalValueDeposited } = useTotalValueDeposited(props.subgraphUrl);
  const _props: MetricProps = {
    ...props,
    label: `Total Value Deposited`,
  };

  if (totalValueDeposited) _props.metric = formatCurrency(totalValueDeposited, 0);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const StakingAPY: React.FC<AbstractedMetricProps> = props => {
  const { data: rebaseRate } = useStakingRebaseRate();
  const _props: MetricProps = {
    ...props,
    label: `Annualized Rebases`,
  };

  if (rebaseRate) {
    const apy = (Math.pow(1 + rebaseRate, 365 * 3) - 1) * 100;
    const formatted = formatNumber(apy, 1);

    _props.metric = `${formatted}%`;
  } else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const TreasuryBalance: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const latestDateQuery = useTokenRecordsLatestRecord(props.subgraphUrls?.Ethereum);
  const liquidBackingQuery = useTreasuryMarketValue(
    !latestDateQuery.data ? undefined : latestDateQuery.data.date,
    props.subgraphUrls,
  );

  const _props: MetricProps = {
    ...props,
    label: `Treasury Balance`,
  };

  if (liquidBackingQuery) _props.metric = formatCurrency(liquidBackingQuery);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};
