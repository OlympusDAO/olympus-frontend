import { ethers, BigNumber } from "ethers";
import { AnyAction, createAsyncThunk, createSelector, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IApproveBondAsyncThunk, IBaseAsyncThunk, IBaseAddressAsyncThunk, IBondV2AysncThunk } from "./interfaces";
import { BondDepository__factory, IERC20__factory } from "src/typechain";
import { addresses } from "src/constants";
import { fetchAccountSuccess } from "./AccountSlice";
import { NetworkID } from "src/lib/Bond";
import { getTokenIdByContract, getTokenPrice, prettifySeconds, secondsUntilBlock } from "src/helpers";
import { findOrLoadMarketPrice } from "./AppSlice";

export const changeApproval = createAsyncThunk(
  "bonding/changeApproval",
  async ({ bondIndex, provider, networkID }: IBondV2AysncThunk, { getState }) => {
    checkNetwork(networkID);
    const signer = provider.getSigner();
    const bondState = (getState() as any).bondingV2[bondIndex];
    const tokenContractAddress: string = bondState.quoteToken;
    const tokenDecimals: number = bondState.quoteDecimals;
    const tokenContract = IERC20__factory.connect(tokenContractAddress, signer);
    await tokenContract.approve(
      addresses[networkID].BOND_DEPOSITORY,
      ethers.utils.parseUnits("10000000000000", tokenDecimals),
    );
  },
);

export interface IBondV2 extends IBondV2Core, IBondV2Meta, IBondV2Terms {
  index: number;
  displayName: string;
  price: number;
  discount: number;
  days: string;
  //   allowance: ethers.BigNumber;
}

interface IBondV2Core {
  quoteToken: string;
  capacityInQuote: boolean;
  capacity: BigNumber;
  totalDebt: BigNumber;
  maxPayout: BigNumber;
  purchased: BigNumber;
  sold: BigNumber;
}

interface IBondV2Meta {
  lastTune: number;
  lastDecay: number;
  length: number;
  depositInterval: number;
  tuneInterval: number;
  baseDecimals: number;
  quoteDecimals: number;
}

interface IBondV2Terms {
  fixedTerm: boolean;
  controlVariable: ethers.BigNumber;
  vesting: number;
  conclusion: number;
  maxDebt: ethers.BigNumber;
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

export const getSingleBond = createAsyncThunk(
  "bondsV2/getSingle",
  async ({ provider, networkID, address, bondIndex }: IBondV2AysncThunk, { dispatch }): Promise<IBondV2> => {
    checkNetwork(networkID);
    const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, provider);
    const bond = await depositoryContract.markets(bondIndex);
    const bondMetadata = await depositoryContract.metadata(bondIndex);
    const bondTerms = await depositoryContract.terms(bondIndex);
    return processBond(bond, bondMetadata, bondTerms, bondIndex, provider, networkID, dispatch);
  },
);

async function processBond(
  bond: IBondV2Core,
  metadata: IBondV2Meta,
  terms: IBondV2Terms,
  index: number,
  provider: ethers.providers.JsonRpcProvider,
  networkID: NetworkID,
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
): Promise<IBondV2> {
  const currentBlock = await provider.getBlockNumber();
  const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, provider);
  const quoteTokenPrice = Number(await getTokenPrice((await getTokenIdByContract(bond.quoteToken)) ?? "dai"));

  const bondPrice = (quoteTokenPrice * +(await depositoryContract.marketPrice(index))) / Math.pow(10, 9);
  const ohmPrice = (await dispatch(findOrLoadMarketPrice({ provider, networkID })).unwrap())?.marketPrice;
  const bondDiscount = (100 * Math.max(ohmPrice - bondPrice, ohmPrice)) / ohmPrice;

  let days = "";
  if (!terms.fixedTerm) {
    const vestingBlock = currentBlock + terms.vesting;
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    days = prettifySeconds(seconds, "day");
  } else {
    const conclusionBlock = terms.conclusion;
    const seconds = secondsUntilBlock(currentBlock, conclusionBlock);
    days = prettifySeconds(seconds, "day");
  }

  return {
    ...bond,
    ...metadata,
    ...terms,
    index: index,
    displayName: `${index}`,
    price: bondPrice,
    discount: bondDiscount,
    days,
  };
}

export const getAllBonds = createAsyncThunk(
  "bondsV2/getAll",
  async ({ provider, networkID }: IBaseAsyncThunk, { dispatch, getState }) => {
    checkNetwork(networkID);
    const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, provider);
    const liveBondIndexes = await depositoryContract.liveMarkets();
    const liveBondPromises = liveBondIndexes.map(async index => await depositoryContract.markets(index));
    const liveBondMetadataPromises = liveBondIndexes.map(async index => await depositoryContract.metadata(index));
    const liveBondTermsPromises = liveBondIndexes.map(async index => await depositoryContract.terms(index));
    let liveBonds: IBondV2[] = [];

    for (let i = 0; i < liveBondIndexes.length; i++) {
      const bondIndex = +liveBondIndexes[i];
      const bond: IBondV2Core = await liveBondPromises[i];
      const bondMetadata: IBondV2Meta = await liveBondMetadataPromises[i];
      const bondTerms: IBondV2Terms = await liveBondTermsPromises[i];
      const finalBond = await processBond(bond, bondMetadata, bondTerms, bondIndex, provider, networkID, dispatch);
      liveBonds.push(finalBond);
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
