import { Metric } from "@olympusdao/component-library";
import { useMemo, useState } from "react";
import { SnapshotLoansStatus } from "src/generated/coolerLoans";
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

const SECONDS_PER_DAY = 60 * 60 * 24;

export const PrincipalMaturingInUnder = ({ days }: { days: number }) => {
  const { latestSnapshot } = useCoolerSnapshotLatest();

  const [principalMaturing, setPrincipalMaturing] = useState<number | undefined>();
  useMemo(() => {
    if (!latestSnapshot) {
      setPrincipalMaturing(undefined);
      return;
    }

    let _principalMaturing = 0;
    for (const loan of Object.values(latestSnapshot.loans)) {
      if (loan.status != SnapshotLoansStatus.Active) {
        continue;
      }

      const loanDaysToExpiry = loan.secondsToExpiry / SECONDS_PER_DAY;
      if (loanDaysToExpiry < days) {
        _principalMaturing += loan.principal;
      }
    }

    setPrincipalMaturing(_principalMaturing);
  }, [latestSnapshot]);

  return (
    <Metric
      label={`Principal Maturing in < ${days} ${days == 1 ? "Day" : "Days"}`}
      metric={formatCurrency(principalMaturing || 0, 0, "DAI")}
      isLoading={latestSnapshot === undefined}
    />
  );
};

export const PrincipalExpired = () => {
  const { latestSnapshot } = useCoolerSnapshotLatest();

  const [principalExpired, setPrincipalExpired] = useState<number | undefined>();
  useMemo(() => {
    if (!latestSnapshot) {
      setPrincipalExpired(undefined);
      return;
    }

    let _principalExpired = 0;
    for (const loan of Object.values(latestSnapshot.loans)) {
      if (loan.status != SnapshotLoansStatus.Expired) {
        continue;
      }

      _principalExpired += loan.principal;
    }

    setPrincipalExpired(_principalExpired);
  }, [latestSnapshot]);

  return (
    <Metric
      label="Principal Expired"
      metric={formatCurrency(principalExpired || 0, 0, "DAI")}
      isLoading={latestSnapshot === undefined}
    />
  );
};

export const BorrowRate = () => {
  const { latestSnapshot } = useCoolerSnapshotLatest();

  const [borrowRate, setBorrowRate] = useState<number | undefined>();
  useMemo(() => {
    if (!latestSnapshot || !latestSnapshot.terms?.interestRate) {
      setBorrowRate(undefined);
      return;
    }

    // Stored as 0.005 (0.5%)
    // Multiply by 100 to get 0.5
    setBorrowRate(latestSnapshot.terms.interestRate * 100);
  }, [latestSnapshot]);

  return (
    <Metric
      label="Borrow Rate"
      metric={borrowRate !== undefined ? `${borrowRate}%` : ""}
      isLoading={borrowRate === undefined}
    />
  );
};
