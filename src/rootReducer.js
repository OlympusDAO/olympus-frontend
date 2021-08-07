import { combineReducers } from "redux";
import { app, bonding, fraxData, bulletpoints, tooltipItems, infoTooltipMessages } from "./reducers";

const rootReducer = combineReducers({
  app,
  bonding,
  fraxData,
  bulletpoints,
  tooltipItems,
  infoTooltipMessages,
});

export default rootReducer;
