import { ethers, BigNumber } from "ethers";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IApproveBondAsyncThunk, IBaseAsyncThunk, IBaseAddressAsyncThunk } from "./interfaces";
import { BondDepository__factory } from "src/typechain";
import { addresses } from "src/constants";
import { fetchAccountSuccess } from "./AccountSlice";
import { NetworkID } from "src/lib/Bond";
import { getTokenIdByContract, getTokenPrice, prettifySeconds, secondsUntilBlock } from "src/helpers";
import { findOrLoadMarketPrice } from "./AppSlice";

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
  discount: number;
  lastTune: number;
  lastDecay: number;
  length: number;
  depositInterval: number;
  tuneInterval: number;
  baseDecimals: number;
  quoteDecimals: number;
  fixedTerm: boolean;
  controlVariable: ethers.BigNumber;
  vesting: number;
  conclusion: number;
  maxDebt: ethers.BigNumber;
  days: string;
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

export const getAllBonds = createAsyncThunk(
  "bondsV2/getAll",
  async ({ provider, networkID }: IBaseAsyncThunk, { dispatch, getState }) => {
    checkNetwork(networkID);
    const currentBlock = await provider.getBlockNumber();
    const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, provider);
    const liveBondIndexes = await depositoryContract.liveMarkets();
    const liveBondPromises = liveBondIndexes.map(async index => await depositoryContract.markets(index));
    const liveBondMetadataPromises = liveBondIndexes.map(async index => await depositoryContract.metadata(index));
    const liveBondTermsPromises = liveBondIndexes.map(async index => await depositoryContract.terms(index));
    let liveBonds: IBondV2[] = [];

    const ohmPrice = (await dispatch(findOrLoadMarketPrice({ provider, networkID })).unwrap())?.marketPrice;

    for (let i = 0; i < liveBondPromises.length && i < liveBondMetadataPromises.length; i++) {
      const bondIndex = +liveBondIndexes[i];
      const bond = await liveBondPromises[i];
      const bondMetadata = await liveBondMetadataPromises[i];
      const bondTerms = await liveBondTermsPromises[i];
      const quoteTokenPrice = Number(await getTokenPrice((await getTokenIdByContract(bond.quoteToken)) ?? "dai"));
      const bondPrice = (quoteTokenPrice * +(await depositoryContract.marketPrice(bondIndex))) / Math.pow(10, 9);
      const bondDiscount = (100 * Math.max(ohmPrice - bondPrice, ohmPrice)) / ohmPrice;

      let days = "";
      if (!bondTerms.fixedTerm) {
        const vestingBlock = currentBlock + bondTerms.vesting;
        const seconds = secondsUntilBlock(currentBlock, vestingBlock);
        days = prettifySeconds(seconds, "day");
      } else {
        const conclusionBlock = bondTerms.conclusion;
        const seconds = secondsUntilBlock(currentBlock, conclusionBlock);
        days = prettifySeconds(seconds, "day");
      }

      liveBonds.push({
        ...bond,
        ...bondMetadata,
        ...bondTerms,
        index: bondIndex,
        displayName: `${bondIndex}`,
        price: bondPrice,
        discount: bondDiscount,
        days,
      });
    }
    return liveBonds;
  },
);

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
