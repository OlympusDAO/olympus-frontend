import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { DataRow, InfoNotification, Metric, OHMTokenProps, Paper, Tab, Tabs } from "@olympusdao/component-library";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { DAI_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import { formatCurrency, formatNumber, parseBigNumber } from "src/helpers";
import { useBalance } from "src/hooks/useBalance";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import {
  DetermineRangePrice,
  OperatorPrice,
  OperatorReserveSymbol,
  RangeBondMaxPayout,
  RangeData,
} from "src/views/Range/hooks";
import RangeChart from "src/views/Range/RangeChart";
import RangeConfirmationModal from "src/views/Range/RangeConfirmationModal";
import RangeInputForm from "src/views/Range/RangeInputForm";
import { useNetwork } from "wagmi";

//export interface OHMRangeProps {}

/**
 * Component for Displaying Range
 */

export const Range = () => {
  const navigate = useNavigate();
  const networks = useTestableNetworks();
  const { chain = { id: 1 } } = useNetwork();
  const { data: rangeData, isLoading: rangeDataLoading } = RangeData();
  usePathForNetwork({ pathName: "range", networkID: chain.id, navigate });

  const {
    data: { symbol: reserveSymbol, reserveAddress },
  } = OperatorReserveSymbol();
  const theme = useTheme();

  const [sellActive, setSellActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [reserveAmount, setReserveAmount] = useState("");
  const [ohmAmount, setOhmAmount] = useState("");

  const reserveBalance = useBalance(DAI_ADDRESSES)[networks.MAINNET].data;
  const ohmBalance = useBalance(OHM_ADDRESSES)[networks.MAINNET].data;

  const { data: currentPrice = 0 } = OperatorPrice();

  const maxString = sellActive ? `Max You Can Sell` : `Max You Can Buy`;

  const { data: upperMaxPayout } = RangeBondMaxPayout(rangeData.high.market);
  const { data: lowerMaxPayout } = RangeBondMaxPayout(rangeData.low.market);

  const lowerMaxCapacity =
    lowerMaxPayout && lowerMaxPayout.lte(rangeData.low.capacity)
      ? parseBigNumber(lowerMaxPayout, 18)
      : parseBigNumber(rangeData.low.capacity, 18);
  const upperMaxCapacity =
    upperMaxPayout && upperMaxPayout.lte(rangeData.high.capacity)
      ? parseBigNumber(upperMaxPayout, 9)
      : parseBigNumber(rangeData.high.capacity, 9);
  const maxCapacity = sellActive ? lowerMaxCapacity : upperMaxCapacity;

  const buyAsset = sellActive ? reserveSymbol : "OHM";
  const sellAsset = sellActive ? "OHM" : reserveSymbol;

  useEffect(() => {
    if (reserveAmount && ohmAmount) {
      handleChangeReserveAmount(reserveAmount);
    }
  }, [sellActive]);

  const { data: bidPrice } = DetermineRangePrice("bid");
  const { data: askPrice } = DetermineRangePrice("ask");

  const maxBalanceString = `${maxCapacity.toFixed(2)} ${buyAsset}  (${(sellActive
    ? maxCapacity / bidPrice.price
    : maxCapacity * askPrice.price
  ).toFixed(2)} ${sellAsset})`;

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

  const hasPrice = (sellActive && askPrice.price) || (!sellActive && bidPrice.price) ? true : false;
  return (
    <div id="stake-view">
      <Paper headerText="Range Swap">
        {currentPrice ? (
          <>
            <Box display="flex" flexDirection="row" justifyContent="space-around" mb="54px">
              <Box>
                <Metric label="OHM Price" data-testid="ohm-price" metric={formatCurrency(currentPrice, 2)} />
              </Box>
              <Box data-testid="lower-wall">
                <Metric label="Lower Wall" metric={formatCurrency(parseBigNumber(rangeData.wall.low.price, 18), 2)} />
              </Box>
              <Box data-testid="upper-wall">
                <Metric label="Upper Wall" metric={formatCurrency(parseBigNumber(rangeData.wall.high.price, 18), 2)} />
              </Box>
            </Box>

            <Tabs centered value={sellActive} TabIndicatorProps={{ style: { display: "none" } }}>
              <Tab
                data-testid="buy-tab"
                label="Buy"
                value={false}
                onClick={() => {
                  setSellActive(false);
                }}
              />
              <Tab
                data-testid="sell-tab"
                label="Sell"
                value={true}
                onClick={() => {
                  setSellActive(true);
                }}
              />
            </Tabs>
            <Box justifyContent="center">
              {!hasPrice && (
                <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
                  <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
                    <InfoNotification>Side is Currently Inactive</InfoNotification>
                  </Box>
                </Box>
              )}
            </Box>

            <WalletConnectedGuard message="Connect your wallet to use Range Swap">
              <RangeInputForm
                reserveSymbol={reserveSymbol as OHMTokenProps["name"]}
                onSetSellActive={() => setSellActive(!sellActive)}
                sellActive={sellActive}
                reserveBalance={reserveBalance}
                ohmBalance={ohmBalance}
                onFormSubmit={handleSubmit}
                onChangeReserveAmount={handleChangeReserveAmount}
                onChangeOhmAmount={handleChangeOhmAmount}
                ohmAmount={ohmAmount}
                reserveAmount={reserveAmount}
                capacity={maxCapacity}
                hasPrice={hasPrice}
              />
            </WalletConnectedGuard>
            {hasPrice && (
              <Box display="flex" flexDirection="row" width="100%" justifyContent="center">
                <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
                  <div data-testid="max-row">
                    <DataRow title={maxString} balance={maxBalanceString} />
                  </div>
                  <div data-testid="premium-discount">
                    <DataRow
                      title={sellActive ? `Premium` : `Discount`}
                      balance={
                        <Typography
                          sx={{ color: discount > 0 ? theme.colors.feedback.pnlGain : theme.colors.feedback.error }}
                        >
                          {formatNumber(discount * 100, 2)}%
                        </Typography>
                      }
                    />
                  </div>
                  <div data-testid="swap-price">
                    <DataRow title={`Swap Price per OHM`} balance={swapPrice} />
                  </div>
                </Box>
              </Box>
            )}
            {!rangeDataLoading && (
              <Box mt={"20px"} data-testid="range-chart">
                <RangeChart
                  rangeData={rangeData}
                  reserveSymbol={reserveSymbol}
                  currentPrice={currentPrice}
                  bidPrice={bidPrice.price}
                  askPrice={askPrice.price}
                  sellActive={sellActive}
                />
              </Box>
            )}
          </>
        ) : (
          <Box display="flex" flexDirection="row" justifyContent="center">
            <CircularProgress />
          </Box>
        )}
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
