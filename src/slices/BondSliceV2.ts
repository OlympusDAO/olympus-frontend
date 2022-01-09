import { ethers, BigNumber } from "ethers";
import { AnyAction, createAsyncThunk, createSelector, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import {
  IBaseAddressAsyncThunk,
  IBondV2AysncThunk,
  IValueAsyncThunk,
  IBondV2PurchaseAsyncThunk,
  IJsonRPCError,
  IBaseBondV2ClaimAsyncThunk,
  IBaseBondV2SingleClaimAsyncThunk,
  IBondV2IndexAsyncThunk,
} from "./interfaces";
import { BondDepository__factory, IERC20__factory } from "src/typechain";
import { addresses, NetworkId, V2BondDetails, v2BondDetails, UnknownDetails } from "src/constants";
import { getTokenIdByContract, getTokenPrice, prettifySeconds } from "src/helpers";
import { findOrLoadMarketPrice } from "./AppSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { error, info } from "./MessagesSlice";
import { getBalances } from "./AccountSlice";

const BASE_TOKEN_DECIMALS: number = 9;

export interface IBondV2 extends IBondV2Core, IBondV2Meta, IBondV2Terms {
  index: number;
  displayName: string;
  priceUSD: number;
  priceToken: number;
  priceTokenBigNumber: BigNumber;
  discount: number;
  duration: string;
  expiration: string;
  isLP: boolean;
  lpUrl: string;
  marketPrice: number;
}

export interface IBondV2Balance {
  allowance: BigNumber;
  balance: BigNumber;
  tokenAddress: string;
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
  quoteDecimals: number;
}

interface IBondV2Terms {
  fixedTerm: boolean;
  controlVariable: ethers.BigNumber;
  vesting: number;
  conclusion: number;
  maxDebt: ethers.BigNumber;
}

interface IBondV2Terms {
  fixedTerm: boolean;
  controlVariable: ethers.BigNumber;
  vesting: number;
  conclusion: number;
  maxDebt: ethers.BigNumber;
}

export interface IUserNote {
  payout: number;
  created: number;
  matured: number;
  redeemed: number;
  marketID: number;
  fullyMatured: boolean;
  originalDurationSeconds: number;
  remainingDurationSeconds: number;
  originalDuration: string;
  timeLeft: string;
  claimed: boolean;
  displayName: string;
  quoteToken: string;
  index: number;
}

function checkNetwork(networkID: NetworkId) {
  if (networkID !== 1 && networkID !== 4) {
    //ENABLE FOR MAINNET LAUNCH
    throw Error(`Network=${networkID} is not supported for V2 bonds`);
  }
}

export const changeApproval = createAsyncThunk(
  "bondsV2/changeApproval",
  async ({ bond, provider, networkID, address }: IBondV2AysncThunk, { dispatch, getState }) => {
    checkNetwork(networkID);
    const signer = provider.getSigner();
    const bondState: IBondV2 = (getState() as RootState).bondingV2.bonds[bond.index];
    const tokenContractAddress: string = bondState.quoteToken;
    const tokenDecimals: number = bondState.quoteDecimals;
    const tokenContract = IERC20__factory.connect(tokenContractAddress, signer);
    let approveTx: ethers.ContractTransaction | undefined;
    try {
      approveTx = await tokenContract.approve(
        addresses[networkID].BOND_DEPOSITORY,
        ethers.utils.parseUnits("10000000000000", tokenDecimals),
      );
      const text = `Approve ${bond.displayName} Bonding`;
      const pendingTxnType = `approve_${bond.displayName}_bonding`;
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

        await approveTx.wait();
        dispatch(clearPendingTxn(approveTx.hash));
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(getTokenBalance({ provider, networkID, address, value: tokenContractAddress }));
      }
    }
  },
);

export const purchaseBond = createAsyncThunk(
  "bondsV2/purchase",
  async ({ provider, address, bond, networkID, amount, maxPrice }: IBondV2PurchaseAsyncThunk, { dispatch }) => {
    checkNetwork(networkID);
    const signer = provider.getSigner();
    const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, signer);

    let depositTx: ethers.ContractTransaction | undefined;
    try {
      depositTx = await depositoryContract.deposit(bond.index, amount, maxPrice, address, address);
      const text = `Purchase ${bond.displayName} Bond`;
      const pendingTxnType = `bond_${bond.displayName}`;
      if (depositTx) {
        dispatch(fetchPendingTxns({ txnHash: depositTx.hash, text, type: pendingTxnType }));
        await depositTx.wait();
        dispatch(clearPendingTxn(depositTx.hash));
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (depositTx) {
        dispatch(info("Successfully purchased bond!"));
        dispatch(getUserNotes({ provider, networkID, address }));
        dispatch(getAllBonds({ address, provider, networkID }));
      }
    }
  },
);

export const getSingleBond = createAsyncThunk(
  "bondsV2/getSingle",
  async ({ provider, networkID, bondIndex }: IBondV2IndexAsyncThunk, { dispatch }): Promise<IBondV2> => {
    checkNetwork(networkID);
    const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, provider);
    const bondCore = await depositoryContract.markets(bondIndex);
    const bondMetadata = await depositoryContract.metadata(bondIndex);
    const bondTerms = await depositoryContract.terms(bondIndex);
    return processBond(bondCore, bondMetadata, bondTerms, bondIndex, provider, networkID, dispatch);
  },
);

export const getTokenBalance = createAsyncThunk(
  "bondsV2/getBalance",
  async ({ provider, networkID, address, value }: IValueAsyncThunk, {}): Promise<IBondV2Balance> => {
    checkNetwork(networkID);
    const tokenContract = IERC20__factory.connect(value, provider);
    const balance = await tokenContract.balanceOf(address);
    const allowance = await tokenContract.allowance(address, addresses[networkID].BOND_DEPOSITORY);
    return { balance, allowance, tokenAddress: value };
  },
);

async function processBond(
  bond: IBondV2Core,
  metadata: IBondV2Meta,
  terms: IBondV2Terms,
  index: number,
  provider: ethers.providers.JsonRpcProvider,
  networkID: NetworkId,
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
): Promise<IBondV2> {
  const currentTime = Date.now() / 1000;
  const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, provider);
  let v2BondDetail: V2BondDetails = v2BondDetails[networkID][bond.quoteToken.toLowerCase()];

  if (!v2BondDetail) {
    v2BondDetail = UnknownDetails;
    console.error(`Add details for bond index=${index}`);
  }
  const quoteTokenPrice = await v2BondDetail.pricingFunction(provider, bond.quoteToken);
  const bondPriceBigNumber = await depositoryContract.marketPrice(index);
  let bondPrice = +bondPriceBigNumber / Math.pow(10, BASE_TOKEN_DECIMALS);
  const bondPriceUSD = quoteTokenPrice * +bondPrice;
  const ohmPrice = (await dispatch(findOrLoadMarketPrice({ provider, networkID })).unwrap())?.marketPrice;
  const bondDiscount = (ohmPrice - bondPriceUSD) / ohmPrice;

  let seconds = 0;
  if (terms.fixedTerm) {
    const vestingTime = currentTime + terms.vesting;
    seconds = vestingTime - currentTime;
  } else {
    const conclusionTime = terms.conclusion;
    seconds = conclusionTime - currentTime;
  }
  let duration = "";
  if (seconds > 86400) {
    duration = prettifySeconds(seconds, "day");
  } else {
    duration = prettifySeconds(seconds);
  }

  return {
    ...bond,
    ...metadata,
    ...terms,
    index: index,
    displayName: `${v2BondDetail.name}`,
    priceUSD: bondPriceUSD,
    priceToken: bondPrice,
    priceTokenBigNumber: bondPriceBigNumber,
    discount: bondDiscount,
    expiration: new Date(terms.vesting * 1000).toDateString(),
    duration,
    isLP: v2BondDetail.isLP,
    lpUrl: v2BondDetail.isLP ? v2BondDetail.lpUrl[networkID] : "",
    marketPrice: ohmPrice,
    quoteToken: bond.quoteToken.toLowerCase(),
  };
}

export const getAllBonds = createAsyncThunk(
  "bondsV2/getAll",
  async ({ provider, networkID, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    checkNetwork(networkID);
    const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, provider);
    const liveBondIndexes = await depositoryContract.liveMarkets();
    // `markets()` returns quote/price data
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

      if (address) {
        dispatch(getTokenBalance({ provider, networkID, address, value: finalBond.quoteToken }));
      }
    }
    return liveBonds;
  },
);

export const getUserNotes = createAsyncThunk(
  "bondsV2/notes",
  async ({ provider, networkID, address }: IBaseAddressAsyncThunk, { dispatch, getState }): Promise<IUserNote[]> => {
    checkNetwork(networkID);
    const currentTime = Date.now() / 1000;
    const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, provider);
    const userNoteIndexes = await depositoryContract.indexesFor(address);
    const userNotePromises = userNoteIndexes.map(async index => await depositoryContract.notes(address, index));
    const userNotes: {
      payout: ethers.BigNumber;
      created: number;
      matured: number;
      redeemed: number;
      marketID: number;
    }[] = await Promise.all(userNotePromises);
    const bonds = await Promise.all(
      Array.from(new Set(userNotes.map(note => note.marketID))).map(
        async id => await dispatch(getSingleBond({ address, provider, networkID, bondIndex: id })).unwrap(),
      ),
    ).then(result => Object.fromEntries(result.map(bond => [bond.index, bond])));
    const notes: IUserNote[] = [];
    for (let i = 0; i < userNotes.length; i++) {
      const rawNote: {
        payout: ethers.BigNumber;
        created: number;
        matured: number;
        redeemed: number;
        marketID: number;
      } = userNotes[i];
      const bond: IBondV2 = bonds[rawNote.marketID];
      let originalDurationSeconds = Math.max(rawNote.matured - rawNote.created, 0);
      let seconds = Math.max(rawNote.matured - currentTime, 0);
      let duration = "";
      if (seconds > 86400) {
        duration = prettifySeconds(seconds, "day");
      } else if (seconds > 0) {
        duration = prettifySeconds(seconds);
      } else {
        duration = "Fully Vested";
      }
      let originalDuration = "";
      if (originalDurationSeconds > 86400) {
        originalDuration = prettifySeconds(originalDurationSeconds, "day");
      } else {
        originalDuration = prettifySeconds(originalDurationSeconds);
      }
      const note: IUserNote = {
        ...rawNote,
        payout: +rawNote.payout / Math.pow(10, 18), //Always in gOHM
        fullyMatured: seconds == 0,
        claimed: rawNote.matured == rawNote.redeemed,
        originalDurationSeconds: originalDurationSeconds,
        remainingDurationSeconds: seconds,
        originalDuration: originalDuration,
        timeLeft: duration,
        displayName: bond?.displayName,
        quoteToken: bond.quoteToken.toLowerCase(),
        index: +userNoteIndexes[i],
      };
      notes.push(note);
    }
    return notes;
  },
);

export const claimAllNotes = createAsyncThunk(
  "bondsV2/claimAll",
  async ({ provider, networkID, address, gOHM }: IBaseBondV2ClaimAsyncThunk, { dispatch, getState }) => {
    const signer = provider.getSigner();
    const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, signer);

    let claimTx: ethers.ContractTransaction | undefined;
    try {
      claimTx = await depositoryContract.redeemAll(address, gOHM);
      const text = `Claim All Bonds`;
      const pendingTxnType = `redeem_all_notes`;
      if (claimTx) {
        dispatch(fetchPendingTxns({ txnHash: claimTx.hash, text, type: pendingTxnType }));

        await claimTx.wait();
        dispatch(clearPendingTxn(claimTx.hash));
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (claimTx) {
        dispatch(getUserNotes({ address, provider, networkID }));
        dispatch(getBalances({ address, networkID, provider }));
      }
    }
  },
);

export const claimSingleNote = createAsyncThunk(
  "bondsV2/claimSingle",
  async ({ provider, networkID, address, indexes, gOHM }: IBaseBondV2SingleClaimAsyncThunk, { dispatch, getState }) => {
    const signer = provider.getSigner();
    const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, signer);

    let claimTx: ethers.ContractTransaction | undefined;
    try {
      claimTx = await depositoryContract.redeem(address, indexes, gOHM);
      const text = `Redeem Note Index=${indexes}`;
      if (claimTx) {
        for (let i = 0; i < indexes.length; i++) {
          const pendingTxnType = `redeem_note_${indexes[i]}`;
          dispatch(fetchPendingTxns({ txnHash: claimTx.hash, text, type: pendingTxnType }));
        }

        await claimTx.wait();
        dispatch(clearPendingTxn(claimTx.hash));
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (claimTx) {
        dispatch(getUserNotes({ address, provider, networkID }));
        dispatch(getBalances({ address, networkID, provider }));
      }
    }
  },
);
// Note(zx): this is a barebones interface for the state. Update to be more accurate
interface IBondSlice {
  loading: boolean;
  balanceLoading: boolean;
  notesLoading: boolean;
  indexes: number[];
  balances: { [key: string]: IBondV2Balance };
  bonds: { [key: string]: IBondV2 };
  notes: IUserNote[];
}

const initialState: IBondSlice = {
  loading: false,
  balanceLoading: false,
  notesLoading: false,
  indexes: [],
  balances: {},
  bonds: {},
  notes: [],
};

const bondingSliceV2 = createSlice({
  name: "bondsV2",
  initialState,
  reducers: {
    fetchBondSuccessV2(state, action) {
      state.bonds[action.payload.bond] = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getAllBonds.pending, state => {
        state.loading = true;
      })
      .addCase(getAllBonds.fulfilled, (state, action) => {
        state.indexes = [];
        state.bonds = {};
        action.payload.forEach(bond => {
          state.bonds[bond.index] = bond;
          state.indexes.push(bond.index);
        });
        state.loading = false;
      })
      .addCase(getAllBonds.rejected, (state, { error }) => {
        state.indexes = [];
        state.bonds = {};
        state.loading = false;
        console.error(error.message);
      })
      .addCase(getTokenBalance.pending, state => {
        state.balanceLoading = true;
      })
      .addCase(getTokenBalance.fulfilled, (state, action) => {
        state.balances[action.payload.tokenAddress] = action.payload;
        state.balanceLoading = false;
      })
      .addCase(getTokenBalance.rejected, (state, { error }) => {
        state.balanceLoading = false;
        console.error(error.message);
      })
      .addCase(getUserNotes.pending, state => {
        state.notesLoading = true;
      })
      .addCase(getUserNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
        state.notesLoading = false;
      })
      .addCase(getUserNotes.rejected, (state, { error }) => {
        state.notes = [];
        state.notesLoading = false;
        console.error(`Error when getting user notes: ${error.message}`);
      });
  },
});

export const bondingReducerV2 = bondingSliceV2.reducer;

export const { fetchBondSuccessV2 } = bondingSliceV2.actions;

const baseInfo = (state: RootState) => state.bondingV2;

export const getBondingStateV2 = createSelector(baseInfo, bonding => bonding);
