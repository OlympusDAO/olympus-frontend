import { t } from "@lingui/macro";
import { Box, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { DataRow, Metric, MetricCollection, Paper, Tab, Tabs } from "@olympusdao/component-library";
import { Route, Routes } from "react-router-dom";
import { DAI_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import { formatCurrency, formatNumber } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useBalance } from "src/hooks/useBalance";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

import { RangeBoundaries } from "./hooks";
import RangeChart from "./RangeChart";
import RangeInputForm from "./RangeInputForm";
import RangeModal from "./RangeModal";

const useStyles = makeStyles<Theme>(theme => ({}));

//export interface OHMRangeProps {}

/**
 * Component for Displaying Range
 */
const Range = () => {
  const classes = useStyles();
  const networks = useTestableNetworks();
  const { data: rangeBoundaries } = RangeBoundaries("CONTRACT_ADDRESS");
  //TODO: Pull from contract if available
  const reserveBalance = useBalance(DAI_ADDRESSES)[networks.MAINNET].data;
  const ohmBalance = useBalance(OHM_ADDRESSES)[networks.MAINNET].data;

  const currentPrice = 15.15;
  const maxOhm = reserveBalance ? reserveBalance.div(new DecimalBigNumber(currentPrice.toString())) : 0;

  const discount = (currentPrice - rangeBoundaries.high) / currentPrice;
  return (
    <div id="stake-view">
      <Paper headerText="Range Swap">
        <MetricCollection>
          <Metric label="Current OHM Price" metric="$15.15" />
          <Metric label="Lower Wall" metric={formatCurrency(rangeBoundaries.low, 2)} />
          <Metric label="Upper Wall" metric={formatCurrency(rangeBoundaries.high, 2)} />
        </MetricCollection>
        <Box mt={"20px"}>
          <RangeChart rangeBoundaries={rangeBoundaries} currentPrice={currentPrice} />
        </Box>
        <Tabs centered>
          <Tab label="Buy" />
          <Tab label="Sell" />
        </Tabs>
        <RangeInputForm currentPrice={currentPrice} reserveSymbol={"DAI"} />
        <DataRow title={t`Max you Can Buy`} balance={`${maxOhm} OHM (${reserveBalance} DAI)`} />
        <DataRow title={t`Discount`} balance={`${formatNumber(discount * 100, 2)}%`} />
        <DataRow title={t`Swap Price per OHM`} balance={formatCurrency(rangeBoundaries.high, 2)} />
      </Paper>
      <Routes>
        <Route path=":id" element={<RangeModal />} />
      </Routes>
    </div>
  );
};

export default Range;
