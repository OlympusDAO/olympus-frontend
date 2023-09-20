import { useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import { Snapshot } from "src/generated/coolerLoans";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
} from "src/helpers/subgraph/ProtocolMetricsHelper";
import { useCoolerSnapshot } from "src/views/Lending/Cooler/hooks/useSnapshot";
import { DEFAULT_BULLETPOINT_COLOURS, DEFAULT_COLORS } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";

export const IncomeGraph = () => {
  const theme = useTheme();

  // TODO replace with prop
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const { data } = useCoolerSnapshot(startDate);

  const [coolerSnapshots, setCoolerSnapshots] = useState<Snapshot[] | undefined>();
  useMemo(() => {
    if (!data) {
      setCoolerSnapshots(undefined);
      return;
    }

    // Sort in descending order
    data.sort((a, b) => b.timestamp - a.timestamp);
    setCoolerSnapshots(data);
  }, [data]);

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
      data={coolerSnapshots || []}
      dataFormat={DataFormat.Currency}
      headerText="Protocol Income"
      headerSubText={""}
      dataKeys={dataKeys}
      dataKeyColors={colorsMap}
      dataKeyBulletpointStyles={bulletpointStyles}
      dataKeyLabels={dataKeyLabels}
      infoTooltipMessage={""}
      isLoading={!coolerSnapshots}
      tickStyle={getTickStyle(theme)}
      itemDecimals={0}
      margin={{ left: 30 }}
    />
  );
};
