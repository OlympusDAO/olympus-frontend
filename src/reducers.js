import { Actions } from "./constants";

export function app(state = {}, action) {
  switch (action.type) {
    case Actions.FETCH_APP_SUCCESS:
    case Actions.FETCH_MIGRATE_SUCCESS:
    case Actions.FETCH_ACCOUNT_SUCCESS:
    case Actions.FETCH_STAKE_SUCCESS:
    case Actions.FETCH_BALANCES:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function fraxData(state = {}, action) {
  switch (action.type) {
    case Actions.FETCH_FRAX_SUCCESS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function bonding(state = {}, action) {
  switch (action.type) {
    case Actions.FETCH_BOND_SUCCESS:
      if (action.payload && action.payload.bond) {
        return {
          ...state,
          [action.payload.bond]: {
            ...state[action.payload.bond],
            ...action.payload,
          },
        };
      }
    default:
      return state;
  }
}

export function pendingTransactions(state = [], action) {
  switch (action.type) {
    case Actions.FETCH_PENDING_TXNS:
      return [...state, action.payload];
    case Actions.CLEAR_PENDING_TXN:
      return [...state].filter(x => x.txnHash !== action.payload);
    default:
      return state;
  }
}
