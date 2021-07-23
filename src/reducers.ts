import { BigNumber } from "ethers";
import { Actions } from "./constants";

/**
 * An action with a string type and an associated payload. This is the
 * type of action returned by `createAction()` action creators.
 *
 * @template P The type of the action's payload.
 * @template T the type used for the action type.
 * @template M The type of the action's meta (optional)
 * @template E The type of the action's error (optional)
 *
 * @public
 */
export declare type PayloadAction<P = void, T extends string = string, M = never, E = never> = {
  payload: P;
  type: T;
} & ([M] extends [never]
  ? {}
  : {
      meta: M;
    }) &
  ([E] extends [never]
    ? {}
    : {
        error: E;
      });

interface IAppData {
  readonly circSupply: number;
  readonly currentBlock: number;
  readonly currentIndex: string;
  readonly fiveDayRate: number;
  readonly marketCap: number;
  readonly marketPrice: number;
  readonly oldStakingAPY: number;
  readonly stakingAPY: number;
  readonly stakingRebase: number;
  readonly stakingTVL: number;
  readonly totalSupply: number;
  readonly treasuryBalance: number;
}

interface IBondData {
  readonly bond: string;
  readonly bondDiscount: number;
  readonly bondPrice: number;
  readonly bondQuote: number;
  readonly debtRatio: BigNumber;
  readonly marketPrice: number;
  readonly maxBondPrice: number;
  readonly purchased: number;
  readonly vestingTerm: BigNumber;
}

interface IFraxData {
  readonly apy: number;
  readonly balance: number;
  readonly tvl: number;
}

interface IBondingState {
  readonly [bond: string]: IBondData;
}

export function app(state = {}, action: PayloadAction<IAppData>) {
  switch (action.type) {
    case Actions.FETCH_APP_SUCCESS:
    case Actions.FETCH_MIGRATE_SUCCESS:
    case Actions.FETCH_ACCOUNT_SUCCESS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function fraxData(state = {}, action: PayloadAction<IFraxData>) {
  switch (action.type) {
    case Actions.FETCH_FRAX_SUCCESS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function bonding(state = {} as IBondingState, action: PayloadAction<IBondData>) {
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
      break;
    default:
      return state;
  }
}
