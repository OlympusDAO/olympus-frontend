import { Actions } from './constants';

export function app(state = {}, action) {
  switch (action.type) {
    case Actions.FETCH_APP_SUCCESS:
    case Actions.FETCH_ACCOUNT_SUCCESS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
