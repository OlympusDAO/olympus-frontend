import { Metric } from "@olympusdao/component-library";
import { formatCurrency, formatCurrencyOrLoading, formatNumber, formatNumberOrLoading } from "src/helpers";
import { useGohmPrice, useOhmPrice } from "src/hooks/usePrices";
import {
  useGOhmPrice as useGOhmPriceFromSubgraph,
  useOhmPrice as useOhmPriceFromSubgraph,
  useTotalValueDeposited,
} from "src/hooks/useProtocolMetrics";
import { useTreasuryMarketValueLatest } from "src/hooks/useTokenRecordsMetrics";
import { useOhmCirculatingSupply, useOhmTotalSupply } from "src/hooks/useTokenSupplyMetrics";
import { useLiquidBackingPerGOhm, useLiquidBackingPerOhmBacked, useMarketCap } from "src/hooks/useTreasuryMetrics";

export type MetricSubgraphProps = {
  earliestDate?: string | null;
  ignoreCache?: boolean;
};
type MetricProps = PropsOf<typeof Metric>;
export type AbstractedMetricProps = Omit<MetricProps, "metric" | "label" | "tooltip" | "isLoading">;

export const MarketCap: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const [marketCap, ohmPrice, ohmCirculatingSupply] = useMarketCap({ ignoreCache: props.ignoreCache });
  const _props: MetricProps = {
    ...props,
    label: `OHM Market Cap`,
    tooltip: `Market capitalization is the dollar value of the outstanding OHM tokens. It is calculated here as the price of OHM (${formatCurrencyOrLoading(
      ohmPrice,
    )}) multiplied by the circulating supply (${formatNumberOrLoading(ohmCirculatingSupply)}). 
    
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
    tooltip: `This price is sourced from the liquidity pools, so will show the real-time market rate.`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

/**
 * same as OHMPrice but uses Subgraph price
 */
export const OHMPriceFromSubgraph: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const ohmPrice = useOhmPriceFromSubgraph({ ignoreCache: props.ignoreCache });
  const _props: MetricProps = {
    ...props,
    label: "OHM " + `Price`,
    tooltip: `This price is determined at the time a snapshot is recorded (every 8 hours). As a result, it will lag the real-time market rate.`,
  };

  if (ohmPrice) _props.metric = formatCurrency(ohmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const OhmCirculatingSupply: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const totalSupply = useOhmTotalSupply({ ignoreCache: props.ignoreCache });
  const circSupply = useOhmCirculatingSupply({ ignoreCache: props.ignoreCache });
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
    tooltip: `gOHM supply is synthetically derived from OHM circulating supply divided by the index.`,
  };

  _props.metric = `- / -`;

  return <Metric {..._props} />;
};

export const BackingPerOHM: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const [liquidBackingPerOhmBacked, liquidBacking, backedSupply] = useLiquidBackingPerOhmBacked({
    ignoreCache: props.ignoreCache,
  });

  // We include floating supply in the tooltip, as it is not displayed as a separate metric anywhere else
  const tooltip = `Liquid backing (${formatCurrencyOrLoading(
    liquidBacking,
  )}) is divided by backed supply of OHM (${formatNumberOrLoading(backedSupply)}) to give liquid backing per OHM.
  
Backed supply is the quantity of outstanding OHM that is backed by assets in the treasury. This typically excludes pre-minted OHM and user deposits for bonds, protocol-owned OHM in liquidity pools and OHM deployed into lending markets.`;

  const _props: MetricProps = {
    ...props,
    label: `Liquid Backing per OHM`,
    tooltip: tooltip,
  };

  if (liquidBackingPerOhmBacked) _props.metric = `${formatCurrency(liquidBackingPerOhmBacked, 2)}`;
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const BackingPerGOHM: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const [liquidBackingPerGOhm, liquidBacking, latestIndex, ohmBackedSupply] = useLiquidBackingPerGOhm({
    ignoreCache: props.ignoreCache,
  });

  const tooltip = `Liquid backing per gOHM is calculated as liquid backing (${formatCurrencyOrLoading(
    liquidBacking,
  )}) multiplied by the latest index (${formatNumberOrLoading(
    latestIndex,
    2,
  )}) and divided by OHM backed supply (${formatNumberOrLoading(ohmBackedSupply)}).`;

  const _props: MetricProps = {
    ...props,
    label: `Liquid Backing per gOHM`,
    tooltip: tooltip,
  };

  if (liquidBackingPerGOhm) _props.metric = `${formatCurrency(liquidBackingPerGOhm, 2)}`;
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
  const gOhmPrice = useGOhmPriceFromSubgraph({ ignoreCache: props.ignoreCache });
  const _props: MetricProps = {
    ...props,
    label: "gOHM " + `Price`,
    tooltip:
      "gOHM = sOHM * index" +
      "\n\n" +
      `The price of gOHM is equal to the price of OHM multiplied by the current index.`,
  };

  if (gOhmPrice) _props.metric = formatCurrency(gOhmPrice, 2);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const TotalValueDeposited: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const totalValueDeposited = useTotalValueDeposited({ ignoreCache: props.ignoreCache });
  const _props: MetricProps = {
    ...props,
    label: `Total Value Deposited`,
  };

  if (totalValueDeposited) _props.metric = formatCurrency(totalValueDeposited, 0);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};

export const TreasuryBalance: React.FC<AbstractedMetricProps & MetricSubgraphProps> = props => {
  const marketValueQuery = useTreasuryMarketValueLatest();

  const _props: MetricProps = {
    ...props,
    label: `Treasury Balance`,
  };

  if (marketValueQuery) _props.metric = formatCurrency(marketValueQuery);
  else _props.isLoading = true;

  return <Metric {..._props} />;
};
