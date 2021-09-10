import { ACTIONS } from "./MigrateThunk";
import { createSlice } from "@reduxjs/toolkit";

interface IPendingTxn {
  readonly txnHash: string;
  readonly text: string;
  readonly type: string;
}

const initialState: Array<any> = [];

const pendingTxnsSlice = createSlice({
  name: "pendingTransactions",
  initialState,
  reducers: {
    fetchPendingTxns(state, action) {
      state.push(action.payload);
    },
    clearPendingTxn(state, action) {
      const target = state.find(x => x.txnHash === action.payload);
      state.splice(state.indexOf(target), 1);
    },
  },
});

export const getStakingTypeText = (action: string) => {
  return action.toLowerCase() === "stake" ? "Staking OHM" : "Unstaking sOHM";
};

export const isPendingTxn = (pendingTransactions: IPendingTxn[], type: string) => {
  return pendingTransactions.map(x => x.type).includes(type);
};

export const txnButtonText = (pendingTransactions: IPendingTxn[], type: string, defaultText: string) => {
  return isPendingTxn(pendingTransactions, type) ? "Pending..." : defaultText;
};

export const txnButtonTextGeneralPending = (pendingTransactions: IPendingTxn[], type: string, defaultText: string) => {
  return pendingTransactions.length >= 1 ? "Pending..." : defaultText;
};

export const { fetchPendingTxns, clearPendingTxn } = pendingTxnsSlice.actions;

export default pendingTxnsSlice.reducer;
