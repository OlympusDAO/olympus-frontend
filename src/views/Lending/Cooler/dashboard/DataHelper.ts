import { useState } from "react";
import { getISO8601String } from "src/helpers/DateHelper";

/**
 * Represents a daily snapshot of all Cooler Loans
 */
export type CoolerSnapshot = {
  date: string;
  timestamp: number;
  receivables: number;
  capacity: number;
  // Income
  interestIncome: number;
  collateralIncome: number;
  // TODO Maturity
};

export const useCoolerSnapshots = (earliestDate: Date) => {
  // Get the data from the subgraph hooks: CoolerLoan and ClearinghouseSnapshot
  const clearinghouseSnapshots = [
    {
      id: "0",
      date: "2023-08-01",
      blockNumber: 12223,
      blockTimestamp: 100000,
      clearinghouse: "0x00000",
      isActive: true,
      nextRebalanceTimestamp: 100001,
      receivables: 18000000.01,
      daiBalance: 10000000.0,
      sDaiBalance: 500000.0,
      sDaiInDaiBalance: 600000.01,
    },
    {
      id: "0",
      date: "2023-08-20",
      blockNumber: 12223,
      blockTimestamp: 100000,
      clearinghouse: "0x00000",
      isActive: true,
      nextRebalanceTimestamp: 100001,
      receivables: 20000000.01,
      daiBalance: 9000000.0,
      sDaiBalance: 500000.0,
      sDaiInDaiBalance: 600000.01,
    },
  ];

  const repaymentEvents = [
    {
      id: "0",
      date: "2023-08-08",
      // etc
      interestIncome: 50000.02,
    },
    {
      id: "0",
      date: "2023-08-15",
      // etc
      interestIncome: 60000.03,
    },
  ];

  // When the data loading is complete, process it into a CoolerSnapshot
  const [byDateSnapshot, setByDateSnapshot] = useState<CoolerSnapshot[] | null>(null);

  // TODO convert to useMemo
  // Check that both sets of results have been received

  // Sort the results by date

  const tempSnapshots: Map<string, CoolerSnapshot> = new Map<string, CoolerSnapshot>();

  // Iterate through the ClearinghouseSnapshot results, created whenever rebalancing or defunding is performed
  clearinghouseSnapshots.forEach(element => {
    const date: Date = new Date(element.date);
    date.setUTCHours(0, 0, 0, 0);
    const dateString = getISO8601String(date);

    // Create a snapshot
    const coolerSnapshot: CoolerSnapshot = {
      date: dateString,
      timestamp: date.getTime(),
      receivables: element.receivables,
      capacity: element.daiBalance + element.sDaiInDaiBalance,
      interestIncome: 0,
      collateralIncome: 0,
    };

    // Add the snapshot to the map
    tempSnapshots.set(dateString, coolerSnapshot);
  });

  // Forward-fill the snapshots
  let lastSnapshot: CoolerSnapshot | null = null;

  const currentDate: Date = new Date(earliestDate);
  currentDate.setUTCHours(0, 0, 0, 0);
  const today: Date = new Date();
  today.setUTCHours(0, 0, 0, 0);
  while (currentDate <= today) {
    const dateString = getISO8601String(currentDate);

    // Get the snapshot
    const coolerSnapshot = tempSnapshots.get(dateString);

    // If there is an existing snapshot, track it and move on
    if (coolerSnapshot) {
      lastSnapshot = coolerSnapshot;
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // If there is no previous snapshot, create a new one
    const newSnapshot: CoolerSnapshot = {
      date: dateString,
      timestamp: currentDate.getTime(),
      receivables: lastSnapshot ? lastSnapshot.receivables : 0,
      capacity: lastSnapshot ? lastSnapshot.capacity : 0,
      interestIncome: 0,
      collateralIncome: 0,
    };

    tempSnapshots.set(dateString, newSnapshot);

    // Increment currentDate
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Iterate through the Repayment events, created whenever a loan is repaid
  repaymentEvents.forEach(element => {
    const dateString = getISO8601String(new Date(element.date));

    // Get the snapshot
    const coolerSnapshot = tempSnapshots.get(dateString);
    if (!coolerSnapshot) {
      throw new Error("Could not find CoolerSnapshot at date " + dateString);
    }

    // Update the snapshot
    coolerSnapshot.interestIncome = element.interestIncome;
  });

  // Order snapshots to be in reverse-chronological order
  const tempByDateSnapshots = Array.from(tempSnapshots.values()).sort((a, b) => b.timestamp - a.timestamp);
  // setByDateSnapshot(tempByDateSnapshots);

  // Return the CoolerSnapshot
  return tempByDateSnapshots;
};
