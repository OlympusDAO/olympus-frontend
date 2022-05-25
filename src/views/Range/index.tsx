import { t } from "@lingui/macro";
import { Box, FormControlLabel, FormGroup, Switch, Typography } from "@mui/material";
import { DataRow, Metric, MetricCollection, Paper, PrimaryButton, Tab, Tabs } from "@olympusdao/component-library";
import React, { useState } from "react";
import { DAI_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import { formatCurrency, formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useOhmPrice } from "src/hooks/usePrices";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

import { RangeData } from "./hooks";
import RangeChart from "./RangeChart";
import RangeConfirmationModal from "./RangeConfirmationModal";
import RangeInputForm from "./RangeInputForm";

//export interface OHMRangeProps {}

/**
 * Component for Displaying Range
 */

interface BidAskPrice {
  active: boolean;
  low: number;
  high: number;
  currentPrice: number;
  market: number;
}

const Range = () => {
  const networks = useTestableNetworks();
  const { data: rangeData } = RangeData("CONTRACT_ADDRESS");
  const [sellActive, setSellActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [reserveAmount, setReserveAmount] = useState("");
  const [ohmAmount, setOhmAmount] = useState("");
  //TODO: Remove. used for mocking state
  const [mockRangeData, setMockRangeData] = useState(rangeData);
  //TODO: Pull from contract if available
  const reserveBalance = useBalance(DAI_ADDRESSES)[networks.MAINNET].data;
  const ohmBalance = useBalance(OHM_ADDRESSES)[networks.MAINNET].data;

  const { data: currentPrice = 18.15 } = useOhmPrice();

  //TODO: Remove. used for mocking state
  const [mockCurrentPrice, setMockCurrentPrice] = useState(currentPrice);
  const maxOhm = reserveBalance
    ? reserveBalance.div(new DecimalBigNumber(mockCurrentPrice.toString())).toString({ decimals: 2 })
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
      if (props.currentPrice <= props.low) {
        return props.low;
      } else if (props.market > 0) {
        //TODO: query for bond market price
        return 15.15;
      } else {
        return props.high;
      }
    }
    return props.high;
  };

  //Sell Tab:
  //Above wall, bid price at wall high
  //in cushion, bid price = bond price
  //anywhere else, bid price is wall low.

  const determineBidPrice = (props: BidAskPrice) => {
    if (props.active) {
      if (props.currentPrice >= props.high) {
        return props.high;
      } else if (props.market > 0) {
        return 20.22;
      } else {
        return props.low;
      }
    }
    return props.low;
  };

  const bidPrice = determineBidPrice({
    active: mockRangeData.high.active,
    low: mockRangeData.wall.low.price,
    high: mockRangeData.wall.high.price,
    currentPrice: mockCurrentPrice,
    market: mockRangeData.high.market,
  });

  const askPrice = determineAskPrice({
    active: mockRangeData.low.active,
    low: mockRangeData.wall.low.price,
    high: mockRangeData.wall.high.price,
    currentPrice: mockCurrentPrice,
    market: mockRangeData.low.market,
  });

  const discount =
    (mockCurrentPrice - (sellActive ? bidPrice : askPrice)) / (sellActive ? -mockCurrentPrice : mockCurrentPrice);

  const handleSubmit = (event: React.FormEvent) => {
    console.log(event);
    event.preventDefault();
    setModalOpen(true);
  };

  //TODO: Swap for Current Price

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
      <Paper headerText="Shipoooor Mode: Mock States">
        <Typography>Walls</Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={mockRangeData.high.active}
                onChange={event =>
                  setMockRangeData({ ...mockRangeData, high: { ...mockRangeData.high, active: event.target.checked } })
                }
              />
            }
            label="Upper Wall"
          />
          <FormControlLabel
            control={
              <Switch
                checked={mockRangeData.low.active}
                onChange={event =>
                  setMockRangeData({ ...mockRangeData, low: { ...mockRangeData.low, active: event.target.checked } })
                }
              />
            }
            label="Lower Wall"
          />
        </FormGroup>
        <Typography>Bonds</Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={mockRangeData.high.market > 0 ? true : false}
                onChange={event =>
                  setMockRangeData({
                    ...mockRangeData,
                    high: { ...mockRangeData.high, market: event.target.checked ? 10 : 0 },
                  })
                }
              />
            }
            label="Upper Cushion"
          />
          <FormControlLabel
            control={
              <Switch
                checked={mockRangeData.low.market > 0 ? true : false}
                onChange={event =>
                  setMockRangeData({
                    ...mockRangeData,
                    low: { ...mockRangeData.low, market: event.target.checked ? 10 : 0 },
                  })
                }
              />
            }
            label="Lower Cushion"
          />
        </FormGroup>

        <Typography>Price</Typography>
        <PrimaryButton
          onClick={() => {
            setMockCurrentPrice(26.12);
          }}
        >
          Set Price Above Upper Wall
        </PrimaryButton>
        <PrimaryButton
          onClick={() => {
            setMockCurrentPrice(8.12);
          }}
        >
          Set Price Below Lower Wall
        </PrimaryButton>
        <PrimaryButton
          onClick={() => {
            setMockCurrentPrice(12.12);
          }}
        >
          Set Price Inside Lower Cushion
        </PrimaryButton>
        <PrimaryButton
          onClick={() => {
            setMockCurrentPrice(22.12);
          }}
        >
          Set Price Inside Upper Cushion
        </PrimaryButton>
      </Paper>
      <Paper headerText="Range Swap">
        <MetricCollection>
          <Metric label="Current OHM Price" metric={formatCurrency(mockCurrentPrice, 2)} />
          <Metric label="Lower Wall" metric={formatCurrency(mockRangeData.wall.low.price, 2)} />
          <Metric label="Upper Wall" metric={formatCurrency(mockRangeData.wall.high.price, 2)} />
        </MetricCollection>
        <Box mt={"20px"}>
          <RangeChart
            rangeData={mockRangeData}
            currentPrice={mockCurrentPrice}
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
          currentPrice={mockCurrentPrice}
          reserveSymbol={"DAI"}
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
          balance={`${maxOhm} OHM (${reserveBalance ? reserveBalance.toString({ decimals: 2 }) : "0.00"} DAI)`}
        />
        <DataRow title={t`Discount`} balance={`${formatNumber(discount * 100, 2)}%`} />
        <DataRow title={t`Swap Price per OHM`} balance={swapPrice} />
      </Paper>
      <RangeConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sellActive={sellActive}
        reserveAmount={reserveAmount}
        ohmAmount={ohmAmount}
        swapPrice={swapPrice}
        discount={discount}
      />
    </div>
  );
};

export default Range;
