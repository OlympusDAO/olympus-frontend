import { configureStore } from "@reduxjs/toolkit";
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import accountReducer from "./slices/AccountSlice";
import bondingReducer from "./slices/BondSlice";
import appReducer from "./slices/AppSlice";
import pendingTransactionsReducer from "./slices/PendingTxnsSlice";
// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const rootReducer = combineReducers({
  account: accountReducer,
  bonding: bondingReducer,
  app: appReducer,
  pendingTransactions: pendingTransactionsReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(thunk)));
// const store = configureStore({
//   reducer: {
//     //   we'll have state.account, state.bonding, etc, each handled by the corresponding
//     // reducer imported from the slice file
//     account: accountReducer,
//     bonding: bondingReducer,
//     app: appReducer,
//     pendingTransactions: pendingTransactionsReducer,
//   },
// });
const persistor = persistStore(store);
export { store, persistor };
