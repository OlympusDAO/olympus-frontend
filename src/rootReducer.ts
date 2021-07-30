import { combineReducers } from "redux";
import { app, bonding, fraxData } from "./reducers";

const rootReducer = combineReducers({
  app,
  bonding,
  fraxData,
});

export default rootReducer;
