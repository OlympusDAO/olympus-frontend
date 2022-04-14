import { configureStore } from "@reduxjs/toolkit";

import accountReducer from "./slices/AccountSlice";
import appReducer from "./slices/AppSlice";
import messagesReducer from "./slices/MessagesSlice";
import pendingTransactionsReducer from "./slices/PendingTxnsSlice";
// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: {
    //   we'll have state.account, state.bonding, etc, each handled by the corresponding
    // reducer imported from the slice file
    account: accountReducer,
    app: appReducer,
    pendingTransactions: pendingTransactionsReducer,
    messages: messagesReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
