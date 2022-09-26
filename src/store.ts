import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "src/slices/AccountSlice";
import appReducer from "src/slices/AppSlice";
import pendingTransactionsReducer from "src/slices/PendingTxnsSlice";
// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: {
    account: accountReducer,
    app: appReducer,
    pendingTransactions: pendingTransactionsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
