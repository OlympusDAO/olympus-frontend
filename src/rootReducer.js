import { combineReducers } from "redux";
import { app, bonding, fraxData, bulletpoints, tooltipItems } from "./reducers";

const rootReducer = combineReducers({
  app,
  bonding,
  fraxData,
  bulletpoints,
  tooltipItems,
});

export default rootReducer;
