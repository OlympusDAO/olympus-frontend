import { combineReducers } from "redux";
import {
  app,
  bonding,
  fraxData,
  pendingTransactions,
  bulletpoints,
  tooltipItems,
  infoTooltipMessages,
} from "./reducers";

const rootReducer = combineReducers({
  app,
  bonding,
  fraxData,
  bulletpoints,
  tooltipItems,
  infoTooltipMessages,
  pendingTransactions,
});

export default rootReducer;
