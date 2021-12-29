import { BigNumber } from "bignumber.js";

export interface SubmitCallback {
  (walletAddress: string, depositAmount: BigNumber, depositAmountDiff?: BigNumber): void;
}

export interface CancelCallback {
  (): void;
}
