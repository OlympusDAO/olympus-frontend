import { combineReducers } from "redux";
import {
  app,
  bonding,
  fraxData,
  tvlBulletpointColors,
  coinBulletpointColors,
  holderBulletpointColors,
  apyBulletpointColors,
  runawayBulletpointColors,
  stakedBulletpointColors,
  tvlItemNames,
  coinItemNames,
  holderItemNames,
  apyItemNames,
  runawayItemNames,
} from "./reducers";

const rootReducer = combineReducers({
  app,
  bonding,
  fraxData,
  tvlBulletpointColors,
  coinBulletpointColors,
  holderBulletpointColors,
  apyBulletpointColors,
  runawayBulletpointColors,
  stakedBulletpointColors,
  tvlItemNames,
  coinItemNames,
  holderItemNames,
  apyItemNames,
  runawayItemNames,
});

export default rootReducer;
