import { combineReducers } from "redux";
import { app, bonding, fraxData, pendingTransactions } from "./reducers";

const rootReducer = combineReducers({
  app,
  bonding,
  fraxData,
  pendingTransactions,
});

export default rootReducer;
