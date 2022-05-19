import { t } from "@lingui/macro";
import { Box } from "@mui/material";
import { DataRow, Metric, MetricCollection, Paper, Tab, Tabs } from "@olympusdao/component-library";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { DAI_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import { formatCurrency, formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useOhmPrice } from "src/hooks/usePrices";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

import { RangeData } from "./hooks";
import RangeChart from "./RangeChart";
import RangeInputForm from "./RangeInputForm";
import RangeModal from "./RangeModal";

//export interface OHMRangeProps {}

/**
 * Component for Displaying Range
 */
const Range = () => {
  const networks = useTestableNetworks();
  const { data: rangeData } = RangeData("CONTRACT_ADDRESS");
  const [currentTab, setCurrentTab] = useState("buy");
  //TODO: Pull from contract if available
  const reserveBalance = useBalance(DAI_ADDRESSES)[networks.MAINNET].data;
  const ohmBalance = useBalance(OHM_ADDRESSES)[networks.MAINNET].data;

  const { data: currentPrice = 0 } = useOhmPrice();
  const maxOhm = reserveBalance ? reserveBalance.div(new DecimalBigNumber(currentPrice.toString())) : 0;

  const discount = (currentPrice - rangeData.wall.high.price) / currentPrice;

  let maxString = t`Max You Can Buy`;

  if (currentTab === "sell") {
    maxString = t`Max You Can Sell`;
  }
  return (
    <div id="stake-view">
      <Paper headerText="Range Swap">
        <MetricCollection>
          <Metric label="Current OHM Price" metric={formatCurrency(currentPrice, 2)} />
          <Metric label="Lower Wall" metric={formatCurrency(rangeData.wall.low.price, 2)} />
          <Metric label="Upper Wall" metric={formatCurrency(rangeData.wall.high.price, 2)} />
        </MetricCollection>
        <Box mt={"20px"}>
          <RangeChart rangeData={rangeData} currentPrice={currentPrice} />
        </Box>
        <Tabs centered value={currentTab}>
          <Tab label="Buy" value={"buy"} onClick={() => setCurrentTab("buy")} />
          <Tab label="Sell" value={"sell"} onClick={() => setCurrentTab("sell")} />
        </Tabs>
        <RangeInputForm currentPrice={currentPrice} reserveSymbol={"DAI"} buyOrSell={currentTab} />
        <DataRow title={maxString} balance={`${maxOhm} OHM (${reserveBalance} DAI)`} />
        <DataRow title={t`Discount`} balance={`${formatNumber(discount * 100, 2)}%`} />
        <DataRow title={t`Swap Price per OHM`} balance={formatCurrency(rangeData.wall.high.price, 2)} />
      </Paper>
      <Routes>
        <Route path=":id" element={<RangeModal />} />
      </Routes>
    </div>
  );
};

export default Range;
