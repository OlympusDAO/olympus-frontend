import { t } from "@lingui/macro";
import { Metric } from "@olympusdao/component-library";
import { useSelector } from "react-redux";

import { formatCurrency, trim } from "../../../../helpers";

const sharedProps = {
  labelVariant: "h6",
  metricVariant: "h5",
};

export const MarketCap = () => {
  const marketCap = useSelector(state => state.app.marketCap || 0);
  return <Metric label={t`Market Cap`} metric={formatCurrency(marketCap, 0)} isLoading={!marketCap} {...sharedProps} />;
};

export const OHMPrice = () => {
  const marketPrice = useSelector(state => state.app.marketPrice);
  return (
    <Metric
      label={t`OHM Price`}
      metric={marketPrice && formatCurrency(marketPrice, 2)}
      isLoading={!marketPrice}
      {...sharedProps}
    />
  );
};

export const CircSupply = () => {
  const circSupply = useSelector(state => state.app.circSupply);
  const totalSupply = useSelector(state => state.app.totalSupply);
  const isDataLoaded = circSupply && totalSupply;
  return (
    <Metric
      label={t`Circulating Supply (total)`}
      metric={isDataLoaded && parseInt(circSupply) + " / " + parseInt(totalSupply)}
      isLoading={!isDataLoaded}
      {...sharedProps}
    />
  );
};

export const BackingPerOHM = () => {
  const backingPerOhm = useSelector(state => state.app.treasuryMarketValue / state.app.circSupply);
  return (
    <Metric
      label={t`Backing per OHM`}
      metric={!isNaN(backingPerOhm) && formatCurrency(backingPerOhm, 2)}
      isLoading={!backingPerOhm}
      {...sharedProps}
    />
  );
};

export const CurrentIndex = () => {
  const currentIndex = useSelector(state => state.app.currentIndex);
  return (
    <Metric
      label={t`Current Index`}
      metric={currentIndex && trim(currentIndex, 2) + " sOHM"}
      isLoading={!currentIndex}
      {...sharedProps}
      tooltip={t`The current index tracks the amount of sOHM accumulated since the beginning of staking. Basically, how much sOHM one would have if they staked and held a single OHM from day 1.`}
    />
  );
};

export const GOHMPrice = () => {
  const gOhmPrice = useSelector(state => state.app.marketPrice * state.app.currentIndex);
  return (
    <Metric
      className="metric wsoprice"
      label={t`gOHM Price`}
      metric={gOhmPrice && formatCurrency(gOhmPrice, 2)}
      isLoading={!gOhmPrice}
      {...sharedProps}
      tooltip={
        t`gOHM = sOHM * index` +
        "\n\n" +
        t`The price of gOHM is equal to the price of OHM multiplied by the current index`
      }
    />
  );
};
