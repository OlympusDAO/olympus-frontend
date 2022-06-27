import { t } from "@lingui/macro";
import { Box, Typography, useTheme } from "@mui/material";
import { DataRow, Metric, MetricCollection, OHMTokenProps, Paper, Tab, Tabs } from "@olympusdao/component-library";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { DAI_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import { formatCurrency, formatNumber, parseBigNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useNetwork } from "wagmi";

import { OperatorPrice, OperatorReserveSymbol, RangeBondPrice, RangeData } from "./hooks";
import RangeChart from "./RangeChart";
import RangeConfirmationModal from "./RangeConfirmationModal";
import RangeInputForm from "./RangeInputForm";

//export interface OHMRangeProps {}

/**
 * Component for Displaying Range
 */
type RangeContracts = "swap" | "bond";

const Range = () => {
  const networks = useTestableNetworks();
  const { activeChain = { id: 1 } } = useNetwork();
  console.log(activeChain, "activeChain");
  const { data: rangeData } = RangeData();
  const {
    data: { symbol: reserveSymbol, reserveAddress },
  } = OperatorReserveSymbol();
  const theme = useTheme();

  const { data: upperBondMarket = 0 } = RangeBondPrice(rangeData.high.market);
  const { data: lowerBondMarket = 0 } = RangeBondPrice(rangeData.low.market);

  const [sellActive, setSellActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [reserveAmount, setReserveAmount] = useState("");
  const [ohmAmount, setOhmAmount] = useState("");

  const reserveBalance = useBalance(DAI_ADDRESSES)[networks.MAINNET].data;
  const ohmBalance = useBalance(OHM_ADDRESSES)[networks.MAINNET].data;

  const { data: currentPrice = 1 } = OperatorPrice();

  const maxOhm = reserveBalance
    ? reserveBalance.div(new DecimalBigNumber(currentPrice.toString())).toString({ decimals: 2 })
    : 0;

  let maxString = t`Max You Can Buy`;

  if (sellActive === true) {
    maxString = t`Max You Can Sell`;
  }

  useEffect(() => {
    if (reserveAmount && ohmAmount) {
      handleChangeReserveAmount(reserveAmount);
    }
  }, [sellActive]);

  /**
   *
   * @param bidOrAsk Return bid or ask side
   * @returns Price and Type of Contract (Bond or Swap)
   * @info
   * Buy Tab:
   * If market price is in cushion, ask price should check if bond market is active.
   * Anywhere else, ask price is wall high
   * Sell Tab:
   * in cushion, bid price = bond price if market is active
   * anywhere else, bid price is wall low.
   **/

  const determinePrice = (bidOrAsk: "bid" | "ask") => {
    const sideActive = bidOrAsk === "ask" ? rangeData.low.active : rangeData.high.active;
    const market = bidOrAsk === "ask" ? rangeData.low.market : rangeData.high.market;
    const activeBondMarket = market.gt(-1) && market.lt(ethers.constants.MaxUint256); //>=0 <=MAXUint256
    if (sideActive && activeBondMarket) {
      return { price: bidOrAsk === "ask" ? lowerBondMarket : upperBondMarket, contract: "bond" as RangeContracts };
    } else {
      return {
        price:
          bidOrAsk === "ask"
            ? parseBigNumber(rangeData.wall.high.price, 18)
            : parseBigNumber(rangeData.wall.low.price, 18),
        contract: "swap" as RangeContracts,
      };
    }
  };

  const bidPrice = determinePrice("bid");
  const askPrice = determinePrice("ask");

  const discount =
    (currentPrice - (sellActive ? bidPrice.price : askPrice.price)) / (sellActive ? -currentPrice : currentPrice);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setModalOpen(true);
  };

  const handleChangeOhmAmount = (value: any) => {
    const reserveValue = value * (sellActive ? bidPrice.price : askPrice.price);
    setOhmAmount(value);
    setReserveAmount(reserveValue.toString());
  };

  const handleChangeReserveAmount = (value: any) => {
    const ohmValue = value / (sellActive ? bidPrice.price : askPrice.price);
    setOhmAmount(ohmValue.toString());
    setReserveAmount(value);
  };

  const swapPrice = sellActive ? formatNumber(bidPrice.price, 2) : formatNumber(askPrice.price, 2);
  const contractType = sellActive ? bidPrice.contract : askPrice.contract; //determine appropriate contract to route to.
  console.log(rangeData);

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
            bidPrice={bidPrice.price}
            askPrice={askPrice.price}
            sellActive={sellActive}
          />
        </Box>
        <Tabs centered value={sellActive}>
          <Tab
            label="Buy"
            value={false}
            onClick={() => {
              setSellActive(false);
            }}
          />
          <Tab
            label="Sell"
            value={true}
            onClick={() => {
              setSellActive(true);
            }}
          />
        </Tabs>
        <RangeInputForm
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
        <DataRow
          title={sellActive ? t`Premium` : t`Discount`}
          balance={
            <Typography sx={{ color: discount > 0 ? theme.colors.feedback.pnlGain : theme.colors.feedback.error }}>
              {formatNumber(discount * 100, 2)}%
            </Typography>
          }
        />
        <DataRow title={t`Swap Price per OHM`} balance={swapPrice} />
      </Paper>
      <RangeConfirmationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sellActive={sellActive}
        reserveAmount={reserveAmount}
        reserveAddress={reserveAddress}
        reserveSymbol={reserveSymbol}
        ohmAmount={ohmAmount}
        swapPrice={swapPrice}
        contract={contractType}
        discount={discount}
        market={sellActive ? rangeData.low.market : rangeData.high.market}
      />
    </div>
  );
};

export default Range;
