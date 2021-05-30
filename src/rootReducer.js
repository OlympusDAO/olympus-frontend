import { combineReducers } from 'redux';
import { app, bonding } from './reducers';

const rootReducer = combineReducers({
  app,
  bonding
});

export default rootReducer;
