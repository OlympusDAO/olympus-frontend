import { Actions } from "src/constants";
import { IPendingTxn } from "src/reducers";
import { ACTIONS } from "./Migrate.actions";

export const fetchPendingTxns = (payload: IPendingTxn) => ({
  type: Actions.FETCH_PENDING_TXNS,
  payload,
});

export const clearPendingTxn = (payload: string) => ({
  type: Actions.CLEAR_PENDING_TXN,
  payload,
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
