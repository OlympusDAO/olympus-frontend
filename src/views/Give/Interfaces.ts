import { BigNumber } from "bignumber.js";
import { IAccountSlice } from "src/slices/AccountSlice";
import { IAppData } from "src/slices/AppSlice";
import { IPendingTxn } from "src/slices/PendingTxnsSlice";

export interface SubmitCallback {
  (walletAddress: string, depositAmount: BigNumber, depositAmountDiff?: BigNumber): void;
}

export interface CancelCallback {
  (): void;
}

export interface RecipientTotalDeposited {
  recipient: string;
  total: string;
}

export interface DonationInfoState {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
  app: IAppData;
}
