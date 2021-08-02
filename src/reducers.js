import {
  Actions,
  BASE_TVL_STATE,
  BASE_COIN_STATE,
  BASE_HOLDER_STATE,
  BASE_APY_STATE,
  BASE_RUNAWAY_STATE,
  BASE_STAKED_STATE,
  BASE_TVL_ITEMS,
  BASE_COIN_ITEMS,
  BASE_HOLDER_ITEMS,
  BASE_APY_ITEMS,
  BASE_RUNAWAY_ITEMS,
} from "./constants";

export function app(state = {}, action) {
  switch (action.type) {
    case Actions.FETCH_APP_SUCCESS:
    case Actions.FETCH_MIGRATE_SUCCESS:
    case Actions.FETCH_ACCOUNT_SUCCESS:
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

export function tvlBulletpointColors(state = BASE_TVL_STATE) {
  return state;
}

export function coinBulletpointColors(state = BASE_COIN_STATE) {
  return state;
}

export function holderBulletpointColors(state = BASE_HOLDER_STATE) {
  return state;
}

export function apyBulletpointColors(state = BASE_APY_STATE) {
  return state;
}

export function runawayBulletpointColors(state = BASE_RUNAWAY_STATE) {
  return state;
}

export function stakedBulletpointColors(state = BASE_STAKED_STATE) {
  return state;
}

export function tvlItemNames(state = BASE_TVL_ITEMS) {
  return state;
}

export function coinItemNames(state = BASE_COIN_ITEMS) {
  return state;
}

export function holderItemNames(state = BASE_HOLDER_ITEMS) {
  return state;
}

export function apyItemNames(state = BASE_APY_ITEMS) {
  return state;
}

export function runawayItemNames(state = BASE_RUNAWAY_ITEMS) {
  return state;
}
