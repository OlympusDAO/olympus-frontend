import Constants from './actions/constants';

export function app(state = {}, action) {
  switch (action.type) {
    case Constants.Actions.FETCH_ACCOUNT_SUCCESS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
