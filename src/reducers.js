import { Actions } from "./constants";

export function app(state = {}, action) {
  switch (action.type) {
    case Actions.FETCH_APP_SUCCESS:
    case Actions.FETCH_ACCOUNT_SUCCESS:
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
