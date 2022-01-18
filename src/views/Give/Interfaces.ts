import { BigNumber } from "bignumber.js";

export interface SubmitCallback {
  (walletAddress: string, eventSource: string, depositAmount: BigNumber, depositAmountDiff?: BigNumber): void;
}

export interface CancelCallback {
  (): void;
}
