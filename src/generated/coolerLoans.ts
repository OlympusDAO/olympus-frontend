/**
 * Generated by orval v6.23.0 🍺
 * Do not edit manually.
 * Cooler Loans
 * OpenAPI spec version: 1.0
 */
import type { QueryFunction, QueryKey, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { customHttpClient } from "src/views/Lending/Cooler/hooks/customHttpClient";
export type GetSnapshots200 = {
  records?: Snapshot[];
};

export type GetSnapshotsParams = {
  /**
   * The start date (YYYY-MM-DD) of the loan period
   */
  startDate: string;
  /**
   * The date (YYYY-MM-DD) up to (but not including) which records should be retrieved
   */
  beforeDate: string;
};

/**
 * Represents the state of the Treasury at the time of the snapshot.
 */
export type SnapshotTreasury = {
  daiBalance: number;
  sDaiBalance: number;
  sDaiInDaiBalance: number;
};

export type SnapshotTerms = {
  duration: number;
  interestRate: number;
  loanToCollateral: number;
};

/**
 * Status of the loan
 */
export type SnapshotLoansStatus = (typeof SnapshotLoansStatus)[keyof typeof SnapshotLoansStatus];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SnapshotLoansStatus = {
  Active: "Active",
  Expired: "Expired",
  Reclaimed: "Reclaimed",
  Repaid: "Repaid",
} as const;

/**
 * Dictionary of the loans that had been created by this date.

Key: `cooler address`-`loanId`
Value: Loan record

Will only be fetched if explicitly specified.
 */
export type SnapshotLoans = {
  [key: string]: {
    borrowerAddress: string;
    collateralClaimedQuantity: number;
    collateralClaimedValue: number;
    /** The current quantity of the collateral token that is deposited.

As the loan is repaid, this will decrease. */
    collateralDeposited: number;
    collateralIncome: number;
    coolerAddress: string;
    /** Timestamp of the loan creation, in seconds */
    createdTimestamp: number;
    /** The loan duration, in seconds. */
    durationSeconds: number;
    /** Timestamp of the expected loan expiry, in seconds */
    expiryTimestamp: number;
    /** Loan id unique across the clearinghouse and its coolers

Format: cooler-loanId */
    id: string;
    /** The total interest charged on the loan.

When the loan is extended, this number will be increased. */
    interest: number;
    /** Cumulative interest paid on the loan.

Any outstanding interest is paid first, followed by principal. */
    interestPaid: number;
    /** The interest rate, stored as a decimal.

e.g. 0.5% = 0.005 */
    interestRate: number;
    lenderAddress: string;
    /** Loan id unique to the cooler */
    loanId: number;
    /** The loan principal. Will not change after loan creation. */
    principal: number;
    /** Cumulative principal paid on the loan. */
    principalPaid: number;
    secondsToExpiry: number;
    /** Status of the loan */
    status: SnapshotLoansStatus;
  };
};

/**
 * Principal due for each expiry bucket.
 */
export type SnapshotExpiryBuckets = {
  "121Days": number;
  "30Days": number;
  active: number;
  expired: number;
};

/**
 * Represents the state of the Clearinghouse at the time of the snapshot.
 */
export type SnapshotClearinghouse = {
  collateralAddress: string;
  coolerFactoryAddress: string;
  daiBalance: number;
  debtAddress: string;
  fundAmount: number;
  fundCadence: number;
  sDaiBalance: number;
  sDaiInDaiBalance: number;
};

export type RepayLoanEventOptionalAllOfLoan = {
  id: string;
};

export type RepayLoanEventOptionalAllOf = {
  loan: RepayLoanEventOptionalAllOfLoan;
};

export type OmitRepayLoanEventLoan = {
  amountPaid: number;
  blockNumber: number;
  blockTimestamp: number;
  clearinghouseDaiBalance: number;
  clearinghouseSDaiBalance: number;
  clearinghouseSDaiInDaiBalance: number;
  collateralDeposited: number;
  date: string;
  id: string;
  interestPayable: number;
  principalPayable: number;
  secondsToExpiry: number;
  transactionHash: string;
  treasuryDaiBalance: number;
  treasurySDaiBalance: number;
  treasurySDaiInDaiBalance: number;
};

export type RepayLoanEventOptional = OmitRepayLoanEventLoan & RepayLoanEventOptionalAllOf;

export type ExtendLoanEventOptionalAllOfLoan = {
  id: string;
};

export type ExtendLoanEventOptionalAllOf = {
  loan: ExtendLoanEventOptionalAllOfLoan;
};

export type OmitExtendLoanEventLoan = {
  blockNumber: number;
  blockTimestamp: number;
  clearinghouseDaiBalance: number;
  clearinghouseSDaiBalance: number;
  clearinghouseSDaiInDaiBalance: number;
  date: string;
  expiryTimestamp: number;
  id: string;
  interestDue: number;
  periods: number;
  transactionHash: string;
  treasuryDaiBalance: number;
  treasurySDaiBalance: number;
  treasurySDaiInDaiBalance: number;
};

export type ExtendLoanEventOptional = OmitExtendLoanEventLoan & ExtendLoanEventOptionalAllOf;

export type ClaimDefaultedLoanEventOptionalAllOfLoan = {
  id: string;
};

export type ClaimDefaultedLoanEventOptionalAllOf = {
  loan: ClaimDefaultedLoanEventOptionalAllOfLoan;
};

export type OmitClaimDefaultedLoanEventLoan = {
  blockNumber: number;
  blockTimestamp: number;
  collateralPrice: number;
  collateralQuantityClaimed: number;
  collateralValueClaimed: number;
  date: string;
  id: string;
  secondsSinceExpiry: number;
  transactionHash: string;
};

export type ClaimDefaultedLoanEventOptional = OmitClaimDefaultedLoanEventLoan & ClaimDefaultedLoanEventOptionalAllOf;

export type ClearLoanRequestEventOptional = OmitClearLoanRequestEventLoanRequest & ClearLoanRequestEventOptionalAllOf;

export type Snapshot = {
  /** Represents the state of the Clearinghouse at the time of the snapshot. */
  clearinghouse: SnapshotClearinghouse;
  clearinghouseEvents: ClearinghouseSnapshotOptional[];
  /** Quantity of collateral deposited across all Coolers */
  collateralDeposited: number;
  /** Income from collateral reclaimed on this date. */
  collateralIncome: number;
  creationEvents: ClearLoanRequestEventOptional[];
  date: string;
  defaultedClaimEvents: ClaimDefaultedLoanEventOptional[];
  /** Principal due for each expiry bucket. */
  expiryBuckets: SnapshotExpiryBuckets;
  extendEvents: ExtendLoanEventOptional[];
  /** Income from interest payments made on this date. */
  interestIncome: number;
  /** Interest receivable across all Coolers */
  interestReceivables: number;
  /** Dictionary of the loans that had been created by this date.

Key: `cooler address`-`loanId`
Value: Loan record

Will only be fetched if explicitly specified. */
  loans: SnapshotLoans;
  /** Principal receivable across all Coolers */
  principalReceivables: number;
  repaymentEvents: RepayLoanEventOptional[];
  terms: SnapshotTerms;
  /** Timestamp of the snapshot, in milliseconds */
  timestamp: number;
  /** Represents the state of the Treasury at the time of the snapshot. */
  treasury: SnapshotTreasury;
};

export type CoolerLoanOptionalAllOfRequest = {
  durationSeconds: number;
  interestPercentage: number;
};

export type CoolerLoanOptionalAllOf = {
  request: CoolerLoanOptionalAllOfRequest;
};

export type OmitCoolerLoanRequestCreationEventsDefaultedClaimEventsExtendEventsRepaymentEvents = {
  borrower: string;
  collateral: number;
  collateralToken: string;
  cooler: string;
  createdBlock: number;
  createdTimestamp: number;
  createdTransaction: string;
  debtToken: string;
  expiryTimestamp: number;
  hasCallback: boolean;
  id: string;
  interest: number;
  lender: string;
  loanId: number;
  principal: number;
};

export type CoolerLoanOptional = OmitCoolerLoanRequestCreationEventsDefaultedClaimEventsExtendEventsRepaymentEvents &
  CoolerLoanOptionalAllOf;

export type ClearLoanRequestEventOptionalAllOf = {
  loan: CoolerLoanOptional;
};

export type OmitClearLoanRequestEventLoanRequest = {
  blockNumber: number;
  blockTimestamp: number;
  clearinghouseDaiBalance: number;
  clearinghouseSDaiBalance: number;
  clearinghouseSDaiInDaiBalance: number;
  date: string;
  id: string;
  transactionHash: string;
  treasuryDaiBalance: number;
  treasurySDaiBalance: number;
  treasurySDaiInDaiBalance: number;
};

export type ClearinghouseSnapshotOptional = {
  blockNumber: number;
  blockTimestamp: number;
  clearinghouse: string;
  collateralAddress: string;
  coolerFactoryAddress: string;
  daiBalance: number;
  date: string;
  debtAddress: string;
  duration: number;
  fundAmount: number;
  fundCadence: number;
  id: string;
  interestRate: number;
  interestReceivables: number;
  isActive: boolean;
  loanToCollateral: number;
  nextRebalanceTimestamp: number;
  principalReceivables: number;
  sDaiBalance: number;
  sDaiInDaiBalance: number;
  treasuryDaiBalance: number;
  treasurySDaiBalance: number;
  treasurySDaiInDaiBalance: number;
};

/**
 * @summary Retrieves all Cooler Loans snapshots between the given dates.
 */
export const getSnapshots = (params: GetSnapshotsParams, signal?: AbortSignal) => {
  return customHttpClient<GetSnapshots200>({ url: `/`, method: "GET", params, signal });
};

export const getGetSnapshotsQueryKey = (params: GetSnapshotsParams) => {
  return [`/`, ...(params ? [params] : [])] as const;
};

export const getGetSnapshotsQueryOptions = <TData = Awaited<ReturnType<typeof getSnapshots>>, TError = unknown>(
  params: GetSnapshotsParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getSnapshots>>, TError, TData> },
) => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetSnapshotsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getSnapshots>>> = ({ signal }) => getSnapshots(params, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getSnapshots>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetSnapshotsQueryResult = NonNullable<Awaited<ReturnType<typeof getSnapshots>>>;
export type GetSnapshotsQueryError = unknown;

/**
 * @summary Retrieves all Cooler Loans snapshots between the given dates.
 */
export const useGetSnapshots = <TData = Awaited<ReturnType<typeof getSnapshots>>, TError = unknown>(
  params: GetSnapshotsParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getSnapshots>>, TError, TData> },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetSnapshotsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};
