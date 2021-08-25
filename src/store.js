import { configureStore } from "@reduxjs/toolkit";
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import accountReducer from "./slices/AccountSlice";
import bondingReducer from "./slices/BondSlice";
import appReducer from "./slices/AppSlice";
import pendingTransactionsReducer from "./slices/PendingTxnsSlice";
// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const saveToLocalStorage = state => {
  try {
    localStorage.setItem("state", JSON.stringify(state));
  } catch (e) {
    console.error(e);
  }
};

const loadFromLocalStorage = () => {
  try {
    const stateStr = localStorage.getItem("state");
    return stateStr ? JSON.parse(stateStr) : undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

const rootReducer = combineReducers({
  account: accountReducer,
  bonding: bondingReducer,
  app: appReducer,
  pendingTransactions: pendingTransactionsReducer,
});

const persistedStore = loadFromLocalStorage();

// we must pass composeEnhancers into the createStore bc redux-thunk is dispatching
// functions into the store, Chad explanation: https://stackoverflow.com/a/54066862
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, persistedStore, composeEnhancers(applyMiddleware(thunk)));

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

export default store;
