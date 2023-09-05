import { useTheme } from "@mui/material";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
} from "src/helpers/subgraph/ProtocolMetricsHelper";
import { DEFAULT_BULLETPOINT_COLOURS, DEFAULT_COLORS } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";

export const UtilisationGraph = () => {
  const theme = useTheme();

  // Get loan data

  /**
   * Chart inputs
   */
  const dataKeys: string[] = ["receivables", "capacity"];
  const itemNames: string[] = ["Receivables", "Capacity Remaining"];

  const bulletpointStyles = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);
  const colorsMap = getDataKeyColorsMap(DEFAULT_COLORS, dataKeys);
  const dataKeyLabels = getCategoriesMap(itemNames, dataKeys);

  return (
    <Chart
      type={ChartType.MultiLine}
      data={[]}
      dataFormat={DataFormat.Currency}
      headerText="Utilisation"
      headerSubText={""}
      dataKeys={dataKeys}
      dataKeyColors={colorsMap}
      dataKeyBulletpointStyles={bulletpointStyles}
      dataKeyLabels={dataKeyLabels}
      infoTooltipMessage={""}
      isLoading={false}
      tickStyle={getTickStyle(theme)}
    />
  );
};
