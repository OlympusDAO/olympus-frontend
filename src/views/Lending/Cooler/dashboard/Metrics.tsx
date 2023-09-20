import { Metric } from "@olympusdao/component-library";
import { useMemo, useState } from "react";
import { formatCurrency } from "src/helpers";
import {
  getClearinghouseCapacity,
  getTreasuryCapacity,
  useCoolerSnapshot,
  useCoolerSnapshotLatest,
} from "src/views/Lending/Cooler/hooks/useSnapshot";

export const CumulativeInterestIncome = ({ startDate }: { startDate?: Date }) => {
  const { data } = useCoolerSnapshot(startDate);

  const [cumulativeInterestIncome, setCumulativeInterestIncome] = useState<number | undefined>();
  useMemo(() => {
    if (!data) {
      setCumulativeInterestIncome(undefined);
      return;
    }

    // Calculate cumulative income
    let _cumulativeInterestIncome = 0;
    data.forEach(snapshot => {
      _cumulativeInterestIncome += snapshot.interestIncome;
    });
    setCumulativeInterestIncome(_cumulativeInterestIncome);
  }, [data]);

  return (
    <Metric
      label="Cumulative Interest Income"
      metric={cumulativeInterestIncome !== undefined ? formatCurrency(cumulativeInterestIncome, 0, "DAI") : ""}
      isLoading={cumulativeInterestIncome === undefined}
    />
  );
};

export const CumulativeCollateralIncome = ({ startDate }: { startDate?: Date }) => {
  const { data } = useCoolerSnapshot(startDate);

  const [cumulativeCollateralIncome, setCumulativeCollateralIncome] = useState<number | undefined>();
  useMemo(() => {
    if (!data) {
      setCumulativeCollateralIncome(undefined);
      return;
    }

    // Calculate cumulative income
    let _cumulativeCollateralIncome = 0;
    data.forEach(snapshot => {
      _cumulativeCollateralIncome += snapshot.collateralIncome;
    });
    setCumulativeCollateralIncome(_cumulativeCollateralIncome);
  }, [data]);

  return (
    <Metric
      label="Cumulative Collateral Income"
      metric={cumulativeCollateralIncome !== undefined ? formatCurrency(cumulativeCollateralIncome, 0, "DAI") : ""}
      isLoading={cumulativeCollateralIncome === undefined}
    />
  );
};

export const OutstandingPrincipal = () => {
  const { latestSnapshot } = useCoolerSnapshotLatest();

  return (
    <Metric
      label="Outstanding Principal"
      metric={latestSnapshot ? formatCurrency(latestSnapshot.principalReceivables, 0, "DAI") : ""}
      isLoading={latestSnapshot === undefined}
    />
  );
};

export const WeeklyCapacityRemaining = () => {
  const { latestSnapshot } = useCoolerSnapshotLatest();

  return (
    <Metric
      label="Weekly Capacity Remaining"
      metric={formatCurrency(getClearinghouseCapacity(latestSnapshot), 0, "DAI")}
      isLoading={latestSnapshot === undefined}
    />
  );
};

export const TreasuryCapacityRemaining = () => {
  const { latestSnapshot } = useCoolerSnapshotLatest();

  return (
    <Metric
      label="Treasury Capacity Remaining"
      metric={formatCurrency(getTreasuryCapacity(latestSnapshot), 0, "DAI")}
      isLoading={latestSnapshot === undefined}
    />
  );
};
