import { Actions, BULLETPOINTS, INFO_TOOLTIP_MESSAGES, TOOLTIP_ITEMS } from "./constants";

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

export function bulletpoints(state = BULLETPOINTS, action) {
  switch (action.type) {
    case Actions.FETCH_BULLETPOINTS_SUCCESS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function tooltipItems(state = TOOLTIP_ITEMS, action) {
  switch (action.type) {
    case Actions.FETCH_TOOLTIP_ITEMS_SUCCESS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function infoTooltipMessages(state = INFO_TOOLTIP_MESSAGES, action) {
  switch (action.type) {
    case Actions.FETCH_INFO_TOOLTIP_MESSAGES_SUCCESS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
