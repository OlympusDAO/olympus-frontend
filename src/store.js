import { configureStore } from "@reduxjs/toolkit";

import accountReducer from "./slices/AccountSlice";
import bondingReducer from "./slices/BondSlice";
import appReducer from "./slices/MainSlice";
import stakeReducer from "./slices/StakeSlice";
import migrateReducer from "./slices/MigrateSlice";
// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
  reducer: {
    //   we'll have state.account, state.bonding, etc, each handled by the corresponding
    // reducer imported from the slice file
    account: accountReducer,
    bonding: bondingReducer,
    app: appReducer,
    stake: stakeReducer,
    migrate: migrateReducer,
  },
});

export default store;
