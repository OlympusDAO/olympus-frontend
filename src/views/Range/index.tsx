import { t } from "@lingui/macro";
import { Box } from "@mui/material";
import { DataRow, Metric, MetricCollection, OHMTokenProps, Paper, Tab, Tabs } from "@olympusdao/component-library";
import { BigNumber, ethers } from "ethers";
import React, { useState } from "react";
import { DAI_ADDRESSES, OHM_ADDRESSES, RANGE_ADDRESSES } from "src/constants/addresses";
import { formatCurrency, formatNumber, parseBigNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useOhmPrice } from "src/hooks/usePrices";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useNetwork } from "wagmi";

import { OperatorReserveSymbol, RangeBondPrice, RangeData } from "./hooks";
import RangeChart from "./RangeChart";
import RangeConfirmationModal from "./RangeConfirmationModal";
import RangeInputForm from "./RangeInputForm";

//export interface OHMRangeProps {}

/**
 * Component for Displaying Range
 */

interface BidAskPrice {
  active: boolean;
  low: BigNumber;
  high: BigNumber;
  currentPrice: number;
  market: BigNumber;
}

const Range = () => {
  const networks = useTestableNetworks();
  const { activeChain = { id: 1 } } = useNetwork();
  const address = RANGE_ADDRESSES[activeChain.id as keyof typeof RANGE_ADDRESSES];
  const { data: rangeData } = RangeData(address);
  const { data: reserveSymbol } = OperatorReserveSymbol(address);

  const { data: upperBondMarket = 0 } = RangeBondPrice(rangeData.high.market);
  const { data: lowerBondMarket = 0 } = RangeBondPrice(rangeData.low.market);

  const [sellActive, setSellActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [reserveAmount, setReserveAmount] = useState("");
  const [ohmAmount, setOhmAmount] = useState("");

  const reserveBalance = useBalance(DAI_ADDRESSES)[networks.MAINNET].data;
  const ohmBalance = useBalance(OHM_ADDRESSES)[networks.MAINNET].data;

  const { data: currentPrice = 18.15 } = useOhmPrice();

  const maxOhm = reserveBalance
    ? reserveBalance.div(new DecimalBigNumber(currentPrice.toString())).toString({ decimals: 2 })
    : 0;

  let maxString = t`Max You Can Buy`;

  if (sellActive === true) {
    maxString = t`Max You Can Sell`;
  }

  //Buy Tab:
  //If market price is below wall low, ask price pin should be at wall low.
  //If market price is in cushion, ask price pin should be bond price
  //Anywhere else, ask price is wall high

  const determineAskPrice = (props: BidAskPrice) => {
    if (props.active) {
      if (props.currentPrice <= parseBigNumber(props.low, 18)) {
        return parseBigNumber(props.low, 18);
      } else if (props.market.gt(-1) && props.market.lt(ethers.constants.MaxUint256)) {
        return lowerBondMarket;
      } else {
        return parseBigNumber(props.high, 18);
      }
    }
    return parseBigNumber(props.high, 18);
  };

  //Sell Tab:
  //Above wall, bid price at wall high
  //in cushion, bid price = bond price
  //anywhere else, bid price is wall low.

  const determineBidPrice = (props: BidAskPrice) => {
    if (props.active) {
      if (props.currentPrice >= parseBigNumber(props.high, 18)) {
        return parseBigNumber(props.high, 18);
      } else if (props.market.gt(-1) && props.market.lt(ethers.constants.MaxUint256)) {
        return upperBondMarket;
      } else {
        return parseBigNumber(props.low, 18);
      }
    }
    return parseBigNumber(props.low, 18);
  };

  const bidPrice = determineBidPrice({
    active: rangeData.high.active,
    low: rangeData.wall.low.price,
    high: rangeData.wall.high.price,
    currentPrice: currentPrice,
    market: rangeData.high.market,
  });

  const askPrice = determineAskPrice({
    active: rangeData.low.active,
    low: rangeData.wall.low.price,
    high: rangeData.wall.high.price,
    currentPrice: currentPrice,
    market: rangeData.low.market,
  });

  const discount = (currentPrice - (sellActive ? bidPrice : askPrice)) / (sellActive ? -currentPrice : currentPrice);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setModalOpen(true);
  };

  const handleChangeOhmAmount = (value: any) => {
    const reserveValue = value * currentPrice;
    setOhmAmount(value);
    setReserveAmount(reserveValue.toString());
  };

  const handleChangeReserveAmount = (value: any) => {
    const ohmValue = value / currentPrice;
    setOhmAmount(ohmValue.toString());
    setReserveAmount(value);
  };

  const swapPrice = sellActive ? formatNumber(bidPrice, 2) : formatNumber(askPrice, 2);
  return (
    <div id="stake-view">
      <Paper headerText="Range Swap">
        <MetricCollection>
          <Metric label="Current OHM Price" metric={formatCurrency(currentPrice, 2)} />
          <Metric label="Lower Wall" metric={formatCurrency(parseBigNumber(rangeData.wall.low.price, 18), 2)} />
          <Metric label="Upper Wall" metric={formatCurrency(parseBigNumber(rangeData.wall.high.price, 18), 2)} />
        </MetricCollection>
        <Box mt={"20px"}>
          <RangeChart
            rangeData={rangeData}
            reserveSymbol={reserveSymbol}
            currentPrice={currentPrice}
            bidPrice={bidPrice}
            askPrice={askPrice}
            sellActive={sellActive}
          />
        </Box>
        <Tabs centered value={sellActive}>
          <Tab label="Buy" value={false} onClick={() => setSellActive(false)} />
          <Tab label="Sell" value={true} onClick={() => setSellActive(true)} />
        </Tabs>
        <RangeInputForm
          currentPrice={currentPrice}
          reserveSymbol={reserveSymbol as OHMTokenProps["name"]}
          sellActive={sellActive}
          reserveBalance={reserveBalance}
          ohmBalance={ohmBalance}
          onFormSubmit={handleSubmit}
          onChangeReserveAmount={handleChangeReserveAmount}
          onChangeOhmAmount={handleChangeOhmAmount}
          ohmAmount={ohmAmount}
          reserveAmount={reserveAmount}
        />
        <DataRow
          title={maxString}
          balance={`${maxOhm} OHM (${
            reserveBalance ? reserveBalance.toString({ decimals: 2 }) : "0.00"
          } ${reserveSymbol})`}
        />
        <DataRow title={t`Discount`} balance={`${formatNumber(discount * 100, 2)}%`} />
        <DataRow title={t`Swap Price per OHM`} balance={swapPrice} />
      </Paper>
      <RangeConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sellActive={sellActive}
        reserveAmount={reserveAmount}
        reserveSymbol={reserveSymbol}
        ohmAmount={ohmAmount}
        swapPrice={swapPrice}
        discount={discount}
      />
    </div>
  );
};

export default Range;
