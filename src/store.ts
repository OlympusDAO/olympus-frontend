import { configureStore } from "@reduxjs/toolkit";

import accountReducer from "./slices/AccountSlice";
import appReducer from "./slices/AppSlice";
import bondingReducer from "./slices/BondSlice";
import { bondingReducerV2 } from "./slices/BondSliceV2";
import messagesReducer from "./slices/MessagesSlice";
import pendingTransactionsReducer from "./slices/PendingTxnsSlice";
import poolDataReducer from "./slices/PoolThunk";
import zapReducer from "./slices/ZapSlice";
// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: {
    //   we'll have state.account, state.bonding, etc, each handled by the corresponding
    // reducer imported from the slice file
    account: accountReducer,
    bonding: bondingReducer,
    bondingV2: bondingReducerV2,
    app: appReducer,
    pendingTransactions: pendingTransactionsReducer,
    poolData: poolDataReducer,
    messages: messagesReducer,
    zap: zapReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
