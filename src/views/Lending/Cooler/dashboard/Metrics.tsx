import { Skeleton } from "@mui/material";
import { Metric } from "@olympusdao/component-library";
import { BigNumber, ethers } from "ethers";
import { useMemo, useState } from "react";
import { formatCurrency, formatNumber } from "src/helpers";
import {
  getTotalCapacity,
  useCoolerSnapshot,
  useCurrentCoolerSnapshot,
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
      label="Income From Interest"
      metric={cumulativeInterestIncome !== undefined ? formatCurrency(cumulativeInterestIncome, 0, "DAI") : ""}
      isLoading={cumulativeInterestIncome === undefined}
      tooltip="The value of interest collected from repayments during the selected time period"
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
      label="Income From Defaults"
      metric={cumulativeCollateralIncome !== undefined ? formatCurrency(cumulativeCollateralIncome, 0, "USD") : ""}
      isLoading={cumulativeCollateralIncome === undefined}
      tooltip="The residual value of collateral (collateral value - outstanding principal) reclaimed due to defaults during the selected time period"
    />
  );
};

export const CollateralDeposited = () => {
  const { latestSnapshot } = useCurrentCoolerSnapshot();

  return (
    <Metric
      label="gOHM Collateral"
      metric={latestSnapshot ? formatNumber(latestSnapshot.collateralDeposited, 0) : ""}
      isLoading={latestSnapshot === undefined}
    />
  );
};

export const OutstandingPrincipal = () => {
  const { latestSnapshot } = useCurrentCoolerSnapshot();

  return (
    <Metric
      label="Amount Borrowed"
      metric={latestSnapshot ? formatCurrency(latestSnapshot.principalReceivables, 0, "DAI") : ""}
      isLoading={latestSnapshot === undefined}
      tooltip="The value of the principal outstanding"
    />
  );
};

export const WeeklyCapacityRemaining = ({
  capacity,
  reserveAsset,
}: {
  capacity?: BigNumber;
  reserveAsset?: string;
}) => {
  return (
    <Metric
      label="Weekly Capacity Remaining"
      metric={
        capacity && reserveAsset ? (
          formatCurrency(Number(ethers.utils.formatUnits(capacity.toString())), 0, reserveAsset)
        ) : (
          <Skeleton />
        )
      }
      isLoading={capacity === undefined}
    />
  );
};

export const TotalCapacityRemaining = () => {
  const { latestSnapshot } = useCurrentCoolerSnapshot();

  return (
    <Metric
      label="Total Capacity Remaining"
      metric={formatCurrency(getTotalCapacity(latestSnapshot), 0, "DAI")}
      isLoading={latestSnapshot === undefined}
      tooltip={`The capacity remaining is the sum of the DAI and sDAI in the clearinghouse and treasury. As of the latest snapshot, the values (in DAI) are:

Clearinghouse:
DAI: ${formatCurrency(latestSnapshot?.clearinghouseTotals.daiBalance || 0, 0, "DAI")}
sDAI: ${formatCurrency(latestSnapshot?.clearinghouseTotals.sDaiInDaiBalance || 0, 0, "DAI")}

Treasury:
DAI: ${formatCurrency(latestSnapshot?.treasury?.daiBalance || 0, 0, "DAI")}
sDAI: ${formatCurrency(latestSnapshot?.treasury?.sDaiInDaiBalance || 0, 0, "DAI")}`}
    />
  );
};

const SECONDS_PER_DAY = 60 * 60 * 24;

export const PrincipalMaturingInUnder = ({ days, previousBucket }: { days: number; previousBucket: number }) => {
  if (days != 30 && days != 121) {
    throw new Error("Invalid days");
  }

  const { latestSnapshot } = useCurrentCoolerSnapshot();

  const [principalMaturing, setPrincipalMaturing] = useState<number | undefined>();
  useMemo(() => {
    if (!latestSnapshot) {
      setPrincipalMaturing(undefined);
      return;
    }

    if (days == 30) {
      setPrincipalMaturing(latestSnapshot.expiryBuckets.days30);
      return;
    }

    if (days == 121) {
      setPrincipalMaturing(latestSnapshot.expiryBuckets.days121);
      return;
    }

    setPrincipalMaturing(undefined);
  }, [latestSnapshot]);

  return (
    <Metric
      label={`Principal Maturing in < ${days} Days`}
      metric={formatCurrency(principalMaturing || 0, 0, "DAI")}
      isLoading={latestSnapshot === undefined}
      tooltip={`The value of principal that will mature in more than ${previousBucket} days but less than ${days} days`}
    />
  );
};

export const BorrowRate = () => {
  const { latestSnapshot } = useCurrentCoolerSnapshot();

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
