import { useTheme } from "@mui/material";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
} from "src/helpers/subgraph/ProtocolMetricsHelper";
import { useCoolerSnapshots } from "src/views/Lending/Cooler/dashboard/DataHelper";
import { DEFAULT_BULLETPOINT_COLOURS, DEFAULT_COLORS } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";

export const IncomeGraph = () => {
  const theme = useTheme();

  // Get loan data
  const byDateSnapshots = useCoolerSnapshots();

  /**
   * Chart inputs
   */
  const dataKeys: string[] = ["interestIncome", "collateralIncome"];
  const itemNames: string[] = ["Interest", "Reclaimed Collateral"];

  const bulletpointStyles = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);
  const colorsMap = getDataKeyColorsMap(DEFAULT_COLORS, dataKeys);
  const dataKeyLabels = getCategoriesMap(itemNames, dataKeys);

  return (
    <Chart
      type={ChartType.Bar}
      data={byDateSnapshots || []}
      dataFormat={DataFormat.Currency}
      headerText="Protocol Income"
      headerSubText={""}
      dataKeys={dataKeys}
      dataKeyColors={colorsMap}
      dataKeyBulletpointStyles={bulletpointStyles}
      dataKeyLabels={dataKeyLabels}
      infoTooltipMessage={""}
      isLoading={byDateSnapshots == null}
      tickStyle={getTickStyle(theme)}
      itemDecimals={0}
      margin={{ left: 30 }}
    />
  );
};
