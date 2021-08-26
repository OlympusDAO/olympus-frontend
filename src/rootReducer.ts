import { combineReducers } from "redux";
import { app, bonding, fraxData, pendingTransactions } from "./reducers";

// TS-REFACTOR-TODO: Delete this file, it is redundant/deprecated.

const rootReducer = combineReducers({
  app,
  bonding,
  fraxData,
  pendingTransactions,
});

export default rootReducer;
