import { t } from "@lingui/macro";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IPendingTxn {
  readonly txnHash: string;
  readonly text: string;
  readonly type: string;
}

const initialState: Array<IPendingTxn> = [];

const pendingTxnsSlice = createSlice({
  name: "pendingTransactions",
  initialState,
  reducers: {
    fetchPendingTxns(state, action: PayloadAction<IPendingTxn>) {
      state.push(action.payload);
    },
    clearPendingTxn(state, action: PayloadAction<string>) {
      const target = state.find(x => x.txnHash === action.payload);
      if (target) {
        state.splice(state.indexOf(target), 1);
      }
    },
  },
});
export const getStakingTypeText = (action: string) => {
  return action.toLowerCase() === "stake" ? t`Staking OHM` : t`Unstaking sOHM`;
};

export const getWrappingTypeText = (action: string) => {
  return action.toLowerCase() === "wrap" ? t`Wrapping OHM` : t`Unwrapping sOHM`;
};
export const isPendingTxn = (pendingTransactions: IPendingTxn[], type: string) => {
  return pendingTransactions.map(x => x.type).includes(type);
};
export const txnButtonText = (pendingTransactions: IPendingTxn[], type: string, defaultText: string) => {
  return isPendingTxn(pendingTransactions, type) ? t`Pending...` : defaultText;
};

export const txnButtonTextMultiType = (pendingTransactions: IPendingTxn[], types: string[], defaultText: string) => {
  return types.map(type => isPendingTxn(pendingTransactions, type)).indexOf(true) != -1 ? t`Pending...` : defaultText;
};

export const txnButtonTextGeneralPending = (pendingTransactions: IPendingTxn[], type: string, defaultText: string) => {
  return pendingTransactions.length >= 1 ? t`Pending...` : defaultText;
};

export const { fetchPendingTxns, clearPendingTxn } = pendingTxnsSlice.actions;

export default pendingTxnsSlice.reducer;
