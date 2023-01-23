import { Box, CircularProgress, Grid, Paper, Typography, useTheme } from "@mui/material";
import { DataRow, InfoNotification, OHMTokenProps, PrimaryButton } from "@olympusdao/component-library";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { DAI_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import { formatNumber, parseBigNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useOhmPrice } from "src/hooks/usePrices";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { DetermineRangePrice, OperatorReserveSymbol, RangeBondMaxPayout, RangeData } from "src/views/Range/hooks";
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

  const { data: reserveBalance = new DecimalBigNumber("0", 18) } = useBalance(DAI_ADDRESSES)[networks.MAINNET];
  const { data: ohmBalance = new DecimalBigNumber("0", 9) } = useBalance(OHM_ADDRESSES)[networks.MAINNET];

  const { data: currentPrice = 0 } = useOhmPrice();

  const maxString = sellActive ? `Max You Can Sell` : `Max You Can Buy`;

  const { data: upperMaxPayout } = RangeBondMaxPayout(rangeData.high.market);
  const { data: lowerMaxPayout } = RangeBondMaxPayout(rangeData.low.market);

  const buyAsset = sellActive ? reserveSymbol : "OHM";
  const sellAsset = sellActive ? "OHM" : reserveSymbol;

  const { data: bidPrice } = DetermineRangePrice("bid");
  const { data: askPrice } = DetermineRangePrice("ask");

  const contractType = sellActive ? bidPrice.contract : askPrice.contract; //determine appropriate contract to route to.

  const lowerMaxCapacity =
    lowerMaxPayout && contractType === "bond"
      ? parseBigNumber(lowerMaxPayout, 18)
      : parseBigNumber(rangeData.low.capacity, 18);

  const upperMaxCapacity =
    upperMaxPayout && contractType === "bond"
      ? parseBigNumber(upperMaxPayout, 18)
      : parseBigNumber(rangeData.high.capacity, 9);

  const maxCapacity = sellActive ? lowerMaxCapacity : upperMaxCapacity;

  useEffect(() => {
    if (reserveAmount && ohmAmount) {
      handleChangeReserveAmount(reserveAmount);
    }
  }, [sellActive]);

  useEffect(() => {
    if (currentPrice < parseBigNumber(rangeData.cushion.low.price, 18)) {
      setSellActive(true);
    }
  }, [rangeData.cushion.low.price, currentPrice]);

  const maxBalanceString = `${formatNumber(maxCapacity, 2)} ${buyAsset}  (${formatNumber(
    sellActive ? maxCapacity / bidPrice.price : maxCapacity * askPrice.price,
    2,
  )} ${sellAsset})`;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setModalOpen(true);
  };

  const swapPrice = sellActive ? bidPrice.price : askPrice.price;

  const handleChangeOhmAmount = (value: any) => {
    const reserveValue = value * swapPrice;
    setOhmAmount(value);
    setReserveAmount(reserveValue.toString());
  };

  const handleChangeReserveAmount = (value: any) => {
    const ohmValue = value / swapPrice;
    setOhmAmount(ohmValue.toString());
    setReserveAmount(value);
  };

  const swapPriceFormatted = formatNumber(swapPrice, 2);

  const discount = (currentPrice - swapPrice) / (sellActive ? -currentPrice : currentPrice);

  const hasPrice = (sellActive && askPrice.price) || (!sellActive && bidPrice.price) ? true : false;

  const ohmAmountAsNumber = new DecimalBigNumber(ohmAmount, 9);
  const reserveAmountAsNumber = new DecimalBigNumber(reserveAmount, 18);
  const capacityBN = new DecimalBigNumber(maxCapacity.toString(), sellActive ? 18 : 9); //reserve asset if sell, OHM if buy
  const amountAboveCapacity = sellActive ? reserveAmountAsNumber.gt(capacityBN) : ohmAmountAsNumber.gt(capacityBN);
  const amountAboveBalance = sellActive ? ohmAmountAsNumber.gt(ohmBalance) : reserveAmountAsNumber.gt(reserveBalance);

  const swapButtonText = `Swap ${sellAsset} for ${buyAsset}`;

  return (
    <div id="stake-view">
      <PageTitle name="Range Swap" />
      <Paper sx={{ width: "98%" }}>
        {currentPrice ? (
          <>
            <Grid container>
              <Grid item xs={12} lg={6}>
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
              </Grid>
              <Grid item xs={12} lg={6}>
                <Box justifyContent="center">
                  {!hasPrice && (
                    <Box display="flex" flexDirection="row" width="100%" justifyContent="center" mt="24px">
                      <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
                        <InfoNotification>Side is Currently Inactive</InfoNotification>
                      </Box>
                    </Box>
                  )}
                </Box>
                <form onSubmit={handleSubmit}>
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
                  {hasPrice && (
                    <Box display="flex" flexDirection="row" width="100%" justifyContent="center">
                      <Box display="flex" flexDirection="column" width="100%" maxWidth="476px">
                        <Box mt="12px">
                          <InfoNotification>
                            You are about to swap {sellAsset} for {buyAsset} at a price of {swapPriceFormatted}{" "}
                            {reserveSymbol}. This is a{" "}
                            {sellActive
                              ? discount < 0
                                ? "discount"
                                : "premium"
                              : discount < 0
                              ? "premium"
                              : "discount"}{" "}
                            of {formatNumber(Math.abs(discount) * 100, 2)}% relative to market price of{" "}
                            {formatNumber(currentPrice, 2)} {reserveSymbol}
                          </InfoNotification>
                        </Box>
                        <div data-testid="max-row">
                          <DataRow title={maxString} balance={maxBalanceString} />
                        </div>
                        <div data-testid="premium-discount">
                          <DataRow
                            title={
                              sellActive
                                ? discount < 0
                                  ? "Discount"
                                  : "Premium"
                                : discount < 0
                                ? "Premium"
                                : "Discount"
                            }
                            balance={
                              <Typography
                                sx={{
                                  color: discount > 0 ? theme.colors.feedback.pnlGain : theme.colors.feedback.error,
                                }}
                              >
                                {formatNumber(Math.abs(discount) * 100, 2)}%
                              </Typography>
                            }
                          />
                        </div>
                        <div data-testid="swap-price">
                          <DataRow title={`Swap Price per OHM`} balance={swapPriceFormatted} />
                        </div>
                        <Box mt="8px">
                          <WalletConnectedGuard fullWidth>
                            <PrimaryButton
                              data-testid="range-submit"
                              fullWidth
                              type="submit"
                              disabled={
                                !ohmAmount ||
                                !reserveAmount ||
                                amountAboveCapacity ||
                                amountAboveBalance ||
                                (sellActive && !rangeData.low.active) ||
                                (!sellActive && !rangeData.high.active)
                              }
                            >
                              {amountAboveCapacity
                                ? `Amount exceeds capacity`
                                : amountAboveBalance
                                ? `Amount exceeds balance`
                                : swapButtonText}
                            </PrimaryButton>
                          </WalletConnectedGuard>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </form>
              </Grid>
            </Grid>
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
        swapPrice={swapPriceFormatted}
        contract={contractType}
        discount={discount}
        market={sellActive ? rangeData.low.market : rangeData.high.market}
      />
    </div>
  );
};

export default Range;
