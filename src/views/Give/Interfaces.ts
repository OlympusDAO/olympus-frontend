import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { IAccountSlice } from "src/slices/AccountSlice";
import { IAppData } from "src/slices/AppSlice";
import { IPendingTxn } from "src/slices/PendingTxnsSlice";

export interface SubmitCallback {
  (
    walletAddress: string,
    eventSource: string,
    depositAmount: DecimalBigNumber,
    depositAmountDiff?: DecimalBigNumber,
  ): void;
}

export interface SubmitEditCallback {
  (
    walletAddress: string,
    id: string,
    eventSource: string,
    depositAmount: DecimalBigNumber,
    depositAmountDiff?: DecimalBigNumber,
  ): void;
}

export type WithdrawSubmitCallback = {
  (walletAddress: string, id: string, eventSource: string, depositAmount: DecimalBigNumber): void;
};

export interface CancelCallback {
  (): void;
}

export interface DonationInfoState {
  account: IAccountSlice;
  pendingTransactions: IPendingTxn[];
  app: IAppData;
}

export interface IButtonChangeView {
  (newView: number): void;
}

export interface GiveData {
  amount: string;
  recipient: string;
  token: string;
}

export interface EditGiveData extends GiveData {
  id: string;
}

export interface RedeemData {
  token: string;
}

export interface IUserDonationInfo {
  id: string;
  date: string;
  deposit: string;
  recipient: string;
  yieldDonated: string;
}
