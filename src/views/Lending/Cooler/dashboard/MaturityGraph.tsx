import { useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import Chart from "src/components/Chart/Chart";
import { ChartType, DataFormat } from "src/components/Chart/Constants";
import { Snapshot, SnapshotLoansExpiryStatus } from "src/generated/coolerLoans";
import {
  getBulletpointStylesMap,
  getCategoriesMap,
  getDataKeyColorsMap,
} from "src/helpers/subgraph/ProtocolMetricsHelper";
import { useCoolerSnapshot } from "src/views/Lending/Cooler/hooks/useSnapshot";
import { DEFAULT_BULLETPOINT_COLOURS, DEFAULT_COLORS } from "src/views/TreasuryDashboard/components/Graph/Constants";
import { getTickStyle } from "src/views/TreasuryDashboard/components/Graph/helpers/ChartHelper";

type SnapshotWithStatusSummary = Snapshot & {
  statusCount: {
    active: number;
    lessThanOneDay: number;
    lessThanSevenDays: number;
    lessThanFourteenDays: number;
    expired: number;
    reclaimed: number;
    repaid: number;
  };
};

export const MaturityGraph = ({ startDate }: { startDate?: Date }) => {
  const theme = useTheme();

  const { data } = useCoolerSnapshot(startDate);

  const [coolerSnapshots, setCoolerSnapshots] = useState<SnapshotWithStatusSummary[] | undefined>();
  useMemo(() => {
    if (!data) {
      setCoolerSnapshots(undefined);
      return;
    }

    const _coolerSnapshots = data.map(snapshot => {
      const _snapshot: SnapshotWithStatusSummary = {
        ...snapshot,
        statusCount: {
          active: 0,
          lessThanOneDay: 0,
          lessThanSevenDays: 0,
          lessThanFourteenDays: 0,
          expired: 0,
          reclaimed: 0,
          repaid: 0,
        },
      };

      // Iterate over the loans and set the expiry count
      Object.values(_snapshot.loans).forEach(loan => {
        switch (loan.expiryStatus) {
          case SnapshotLoansExpiryStatus.Active:
            _snapshot.statusCount.active++;
            break;
          case SnapshotLoansExpiryStatus["<_1_Day"]:
            _snapshot.statusCount.lessThanOneDay++;
            break;
          case SnapshotLoansExpiryStatus["<_7_Days"]:
            _snapshot.statusCount.lessThanSevenDays++;
            break;
          case SnapshotLoansExpiryStatus["<_14_Days"]:
            _snapshot.statusCount.lessThanFourteenDays++;
            break;
          case SnapshotLoansExpiryStatus.Expired:
            _snapshot.statusCount.expired++;
            break;
          case SnapshotLoansExpiryStatus.Reclaimed:
            _snapshot.statusCount.reclaimed++;
            break;
          case SnapshotLoansExpiryStatus.Repaid:
            _snapshot.statusCount.repaid++;
            break;
          default:
            break;
        }
      });

      return _snapshot;
    });

    // Sort in descending order
    _coolerSnapshots.sort((a, b) => b.timestamp - a.timestamp);
    setCoolerSnapshots(_coolerSnapshots);
  }, [data]);

  /**
   * Chart inputs
   */
  const dataKeys: string[] = [
    "statusCount.active",
    "statusCount.lessThanOneDay",
    "statusCount.lessThanSevenDays",
    "statusCount.lessThanFourteenDays",
  ];
  const itemNames: string[] = ["Active", "< 1 Day", "< 7 Days", "< 14 Days"];

  const bulletpointStyles = getBulletpointStylesMap(DEFAULT_BULLETPOINT_COLOURS, dataKeys);
  const colorsMap = getDataKeyColorsMap(DEFAULT_COLORS, dataKeys);
  const dataKeyLabels = getCategoriesMap(itemNames, dataKeys);

  return (
    <Chart
      type={ChartType.Bar}
      data={coolerSnapshots || []}
      dataFormat={DataFormat.Number}
      headerText="Maturity"
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
