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

export const getCoolerSnapshotData = async () => {
  // Get the data from the subgraph hooks: CoolerLoan and ClearinghouseSnapshot
  // When the data loading is complete, process it into a CoolerSnapshot
  // Return the CoolerSnapshot
};
