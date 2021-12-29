import { ethers, BigNumber, BigNumberish } from "ethers";
import { error, info } from "./MessagesSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import {
  IApproveBondAsyncThunk,
  IJsonRPCError,
  IBaseAsyncThunk,
  IValueOnlyAsyncThunk,
  IBaseAddressAsyncThunk,
} from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import ReactGA from "react-ga";
import { BondDepository__factory } from "src/typechain";
import { addresses } from "src/constants";
import { fetchAccountSuccess } from "./AccountSlice";
import { NetworkID } from "src/lib/Bond";
import { getTokenIdByContract, getTokenPrice } from "src/helpers";

export const changeApproval = createAsyncThunk(
  "bonding/changeApproval",
  async ({ address, bond, provider, networkID }: IApproveBondAsyncThunk, { dispatch }) => {},
);

export interface IBondV2 {
  quoteToken: string;
  capacityInQuote: boolean;
  capacity: BigNumber;
  totalDebt: BigNumber;
  maxPayout: BigNumber;
  purchased: BigNumber;
  sold: BigNumber;
  index: number;
  displayName: string;
  price: number;
}

export interface IUserNote {
  payout: ethers.BigNumber;
  created: number;
  matured: number;
  redeemed: number;
  marketID: number;
}

function checkNetwork(networkID: NetworkID) {
  if (networkID !== 1 && networkID !== 4) {
    throw Error("Network is not supported for V2 bonds");
  }
}

export const getAllBonds = createAsyncThunk("bondsV2/getAll", async ({ provider, networkID }: IBaseAsyncThunk, {}) => {
  checkNetwork(networkID);
  const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, provider);
  const liveBondIndexes = await depositoryContract.liveMarkets();
  const liveBondPromises = liveBondIndexes.map(async index => await depositoryContract.markets(index));
  let liveBonds: IBondV2[] = [];

  for (let i = 0; i < liveBondPromises.length; i++) {
    const bond = await liveBondPromises[i];
    liveBonds.push({
      ...bond,
      index: +liveBondIndexes[i],
      displayName: `${+liveBondIndexes[i]}`,
      price: Number(await getTokenPrice(await getTokenIdByContract(bond.quoteToken))),
    });
  }
  return liveBonds;
});

export const getUserNotes = createAsyncThunk(
  "bondsV2/getUser",
  async ({ provider, networkID, address }: IBaseAddressAsyncThunk, {}) => {
    checkNetwork(networkID);
    const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, provider);
    const userNoteIndexes = await depositoryContract.indexesFor(address);
    const userNotes = userNoteIndexes.map(async index => await depositoryContract.notes(address, index));
    const notes: IUserNote[] = [];
    for (let i = 0; i < userNotes.length; i++) {
      const note = await userNotes[i];
      notes.push(note);
    }
    fetchAccountSuccess({ notes });
  },
);

// Note(zx): this is a barebones interface for the state. Update to be more accurate
interface IBondSlice {
  loading: boolean;
  indexes: number[];
  [key: string]: any;
}

const initialState: IBondSlice = {
  loading: false,
  indexes: [],
};

const bondingSliceV2 = createSlice({
  name: "bondsV2",
  initialState,
  reducers: {
    fetchBondSuccessV2(state, action) {
      state[action.payload.bond] = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getAllBonds.pending, state => {
        state.loading = true;
      })
      .addCase(getAllBonds.fulfilled, (state, action) => {
        state.indexes = [];
        action.payload.forEach(bond => {
          state[bond.index] = bond;
          state.indexes.push(bond.index);
        });
        state.loading = false;
      })
      .addCase(getAllBonds.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.message);
      });
  },
});

export const bondingReducerV2 = bondingSliceV2.reducer;

export const { fetchBondSuccessV2 } = bondingSliceV2.actions;

const baseInfo = (state: RootState) => state.bondingV2;

export const getBondingStateV2 = createSelector(baseInfo, bonding => bonding);
