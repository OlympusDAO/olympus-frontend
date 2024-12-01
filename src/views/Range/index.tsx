import { Box, CircularProgress, Grid, Link, Paper, Typography, useTheme } from "@mui/material";
import {
  DataRow,
  Icon,
  InfoNotification,
  InfoTooltip,
  Metric,
  OHMTokenProps,
  PrimaryButton,
} from "@olympusdao/component-library";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { WalletConnectedGuard } from "src/components/WalletConnectedGuard";
import { OHM_ADDRESSES, USDS_ADDRESSES } from "src/constants/addresses";
import { formatNumber, parseBigNumber } from "src/helpers";
import CountdownTimer from "src/helpers/CountdownTimer";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useGetDefillamaPrice } from "src/helpers/pricing/useGetDefillamaPrice";
import { useBalance } from "src/hooks/useBalance";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import {
  DetermineRangePrice,
  LastSnapshotPrice,
  OperatorPrice,
  OperatorReserveSymbol,
  RangeBondMaxPayout,
  RangeData,
  RangeNextBeat,
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

  const { data: reserveBalance = new DecimalBigNumber("0", 18) } = useBalance(USDS_ADDRESSES)[networks.MAINNET];
  const { data: ohmBalance = new DecimalBigNumber("0", 9) } = useBalance(OHM_ADDRESSES)[networks.MAINNET];

  const { data: currentPrice } = OperatorPrice();
  const { data: lastPrice } = LastSnapshotPrice();
  const { data: currentMarketPrices } = useGetDefillamaPrice({
    addresses: [USDS_ADDRESSES[1], OHM_ADDRESSES[1]],
  });
  const { data: nextBeat } = RangeNextBeat();

  const usdsPriceUSD = currentMarketPrices?.[`ethereum:${USDS_ADDRESSES[1]}`].price;
  const ohmPriceUSD = currentMarketPrices?.[`ethereum:${OHM_ADDRESSES[1]}`].price;
  const marketOhmPriceUSDS = usdsPriceUSD && ohmPriceUSD ? ohmPriceUSD / usdsPriceUSD : undefined;

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
      ? parseBigNumber(upperMaxPayout, 9)
      : parseBigNumber(rangeData.high.capacity, 9);

  const maxCapacity = sellActive
    ? rangeData.low.active
      ? lowerMaxCapacity
      : 0
    : rangeData.high.active
      ? upperMaxCapacity
      : 0;

  useEffect(() => {
    if (reserveAmount && ohmAmount) {
      handleChangeReserveAmount(reserveAmount);
    }
  }, [sellActive]);

  // Set sell active if market price is defined and is below lower cushion OR if there is a active lower bond market.
  useEffect(() => {
    if (
      (marketOhmPriceUSDS && marketOhmPriceUSDS < parseBigNumber(rangeData.low.cushion.price, 18)) ||
      bidPrice.activeBondMarket
    ) {
      setSellActive(true);
    }
  }, [rangeData.low.cushion.price, marketOhmPriceUSDS]);

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

  const discount =
    (marketOhmPriceUSDS &&
      (marketOhmPriceUSDS - swapPrice) / (sellActive ? -marketOhmPriceUSDS : marketOhmPriceUSDS)) ||
    0;

  const hasPrice = (sellActive && askPrice.price) || (!sellActive && bidPrice.price) ? true : false;

  const ohmAmountAsNumber = new DecimalBigNumber(ohmAmount, 9);
  const reserveAmountAsNumber = new DecimalBigNumber(reserveAmount, 18);
  const capacityBN = new DecimalBigNumber(maxCapacity.toString(), sellActive ? 18 : 9); //reserve asset if sell, OHM if buy
  const amountAboveCapacity = sellActive ? reserveAmountAsNumber.gt(capacityBN) : ohmAmountAsNumber.gt(capacityBN);
  const amountAboveBalance = sellActive ? ohmAmountAsNumber.gt(ohmBalance) : reserveAmountAsNumber.gt(reserveBalance);

  const swapButtonText = `Swap ${sellAsset} for ${buyAsset}`;

  return (
    <div id="stake-view">
      <PageTitle
        name="Range Bound Stability"
        subtitle={
          <Box display="flex" flexDirection="row" alignItems="center" gap="4px">
            Swap ${reserveSymbol} or OHM directly with the treasury.{" "}
            <Link
              component={RouterLink}
              to="https://docs.olympusdao.finance/main/overview/range-bound"
              target="_blank"
              rel="noopener noreferrer"
              alignItems="center"
              display="flex"
              gap="4px"
            >
              Learn More <Icon name="arrow-up" sx={{ fontSize: "14px" }} />
            </Link>
          </Box>
        }
      />
      <Paper sx={{ width: "98%" }}>
        {currentPrice && lastPrice ? (
          <>
            <Metric
              label="Market Price"
              metric={`${formatNumber(marketOhmPriceUSDS || 0, 2)} ${reserveSymbol}`}
              tooltip="Market Price uses DefiLlama API, and is also used when calculating premium/discount on RBS"
              isLoading={!marketOhmPriceUSDS}
            />
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
                    <Typography fontSize="18px" fontWeight="500" mt="12px">
                      Snapshot
                    </Typography>
                    <DataRow
                      title="Last Snapshot Price"
                      balance={
                        <Box display="flex" alignItems="center">
                          {formatNumber(lastPrice, 2)} {reserveSymbol}
                          <Box display="flex" fontSize="12px" alignItems="center">
                            <InfoTooltip
                              message={`Snapshot Price is returned from price feed connected to RBS Operator. The current price feed is Chainlink, which updates price if there's a 2% deviation or 24 hours, whichever comes first. The Snapshot Price is used by RBS Operator to turn on/off bond markets.`}
                            />
                          </Box>
                        </Box>
                      }
                    />
                    <DataRow
                      title="Estimated Next Snapshot"
                      balance={<>{nextBeat && <CountdownTimer targetDate={nextBeat} />}</>}
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
                            {formatNumber(marketOhmPriceUSDS || 0, 2)} {reserveSymbol}
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
                              <Box display="flex" alignItems="center" style={{ fontSize: "12px" }}>
                                <Typography
                                  sx={{
                                    color: discount > 0 ? theme.colors.feedback.pnlGain : theme.colors.feedback.error,
                                  }}
                                >
                                  {formatNumber(Math.abs(discount) * 100, 2)}%
                                </Typography>
                              </Box>
                            }
                          />
                        </div>
                        <div data-testid="swap-price">
                          <DataRow title={`RBS quote per OHM`} balance={`${swapPriceFormatted} ${reserveSymbol}`} />
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
