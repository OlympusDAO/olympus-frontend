import { configureStore } from '@reduxjs/toolkit'

import accountReducer from './components/Account/AccountSlice'
import bondingReducer from './components/Bond/BondSlice'
import appReducer from './components/Main/MainSlice'
import stakeReducer from './components/Stake/StakeSlice'
import migrateReducer from './components/Migrate/MigrateSlice'
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
})

export default store
