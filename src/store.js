import { configureStore } from "@reduxjs/toolkit";

import accountReducer from "./slices/AccountSlice";
import bondingReducer from "./slices/BondSlice";
import appReducer from "./slices/AppSlice";
import pendingTransactionsReducer from "./slices/PendingTxnsSlice";
import lusdDataReducer from "./slices/LusdSlice";
import messagesReducer from "./slices/MessagesSlice";
// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: {
    //   we'll have state.account, state.bonding, etc, each handled by the corresponding
    // reducer imported from the slice file
    account: accountReducer,
    bonding: bondingReducer,
    app: appReducer,
    pendingTransactions: pendingTransactionsReducer,
    lusdData: lusdDataReducer,
    messages: messagesReducer,
  },
});

export default store;
