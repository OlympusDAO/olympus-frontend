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
import { getCapacity, getReceivables, useCoolerSnapshot } from "src/views/Lending/Cooler/hooks/useSnapshot";
import { DEFAULT_BULLETPOINT_COLOURS, DEFAULT_COLORS } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";

type CoolerSnapshotWithTotals = Snapshot & {
  capacity: number;
  receivables: number;
};

export const UtilisationGraph = () => {
  const theme = useTheme();

  // TODO replace with prop
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const { data } = useCoolerSnapshot(startDate);

  // Add calculated data
  const [coolerSnapshots, setCoolerSnapshots] = useState<CoolerSnapshotWithTotals[] | undefined>(undefined);
  useMemo(() => {
    if (!data) {
      setCoolerSnapshots(undefined);
      return;
    }

    const _coolerSnapshotsWithTotals = data.map(snapshot => {
      const capacity = getCapacity(snapshot);
      const receivables = getReceivables(snapshot);

      return {
        ...snapshot,
        capacity,
        receivables,
      };
    });

    // Sort in descending order
    _coolerSnapshotsWithTotals.sort((a, b) => b.timestamp - a.timestamp);

    setCoolerSnapshots(_coolerSnapshotsWithTotals);
  }, [data]);

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
      data={coolerSnapshots || []}
      dataFormat={DataFormat.Currency}
      headerText="Utilisation"
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
