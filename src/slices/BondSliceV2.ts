import { OHMTokenStackProps } from "@olympusdao/component-library";
import { AnyAction, createAsyncThunk, createSelector, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { addresses, NetworkId, UnknownDetails, V2BondDetails, V2BondParser } from "src/constants";
import { RootState } from "src/store";
import { BondDepository__factory, IERC20__factory } from "src/typechain";

import { prettifySecondsInDays } from "../helpers/timeUtil";
import { getBalances } from "./AccountSlice";
import { findOrLoadMarketPrice } from "./AppSlice";
import {
  IBaseAddressAsyncThunk,
  IBaseBondV2ClaimAsyncThunk,
  IBaseBondV2SingleClaimAsyncThunk,
  IBondV2AysncThunk,
  IBondV2IndexAsyncThunk,
  IBondV2PurchaseAsyncThunk,
  IJsonRPCError,
  IValueAsyncThunk,
} from "./interfaces";
import { error, info } from "./MessagesSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";

const BASE_TOKEN_DECIMALS = 9;

export interface IBondV2 extends IBondInverseCore, IBondInverseMeta, IBondV2Terms {
  index: number;
  displayName: string;
  payoutName: string;
  priceUSD: number;
  priceToken: number;
  priceTokenBigNumber: BigNumber;
  discount: number;
  duration: string;
  expiration: string;
  isLP: boolean;
  lpUrl: string;
  marketPrice: number;
  soldOut: boolean;
  capacityInBaseToken: string;
  capacityInQuoteToken: string;
  maxPayoutInBaseToken: string;
  maxPayoutInQuoteToken: string;
  maxPayoutOrCapacityInQuote: string;
  maxPayoutOrCapacityInBase: string;
  bondIconSvg: OHMTokenStackProps["tokens"];
  payoutIconSvg: OHMTokenStackProps["tokens"];
}

export interface IBondInverseCore extends IBondV2Core {
  // creator: string;
  baseToken: string;
  // call: boolean;
}

export interface IBondInverseMeta extends IBondV2Meta {
  baseDecimals: number;
}

export interface IBondV2Balance {
  allowance: BigNumber;
  balance: BigNumber;
  tokenAddress: string;
}

export interface IBondV2Core {
  quoteToken: string;
  capacityInQuote: boolean;
  capacity: BigNumber;
  totalDebt: BigNumber;
  maxPayout: BigNumber;
  purchased: BigNumber;
  sold: BigNumber;
}

export interface IBondV2Meta {
  lastTune: number;
  lastDecay: number;
  length: number;
  depositInterval: number;
  tuneInterval: number;
  quoteDecimals: number;
}

export interface IBondV2Terms {
  fixedTerm: boolean;
  controlVariable: ethers.BigNumber;
  vesting: number;
  conclusion: number;
  maxDebt: ethers.BigNumber;
}

export interface IDepoNote {
  payout: ethers.BigNumber;
  created: number;
  matured: number;
  redeemed: number;
  marketID: number;
}

export interface IInverseDepoNote extends IDepoNote {
  token: string;
}

export interface IUserNoteIsh extends Omit<IInverseDepoNote, "payout"> {
  payout: number;
}

export interface IUserNote extends IUserNoteIsh {
  fullyMatured: boolean;
  originalDurationSeconds: number;
  remainingDurationSeconds: number;
  originalDuration: string;
  timeLeft: string;
  claimed: boolean;
  displayName: string;
  quoteToken: string;
  bondIconSvg: OHMTokenStackProps["tokens"];
  index: number;
}

function checkNetwork(networkID: NetworkId) {
  if (networkID !== 1 && networkID !== 4) {
    //ENABLE FOR MAINNET LAUNCH
    throw Error(`Network=${networkID} is not supported for V2 bonds`);
  }
}

export function convertAmountInBondUnitToQuoteTokenUnit(
  amountInBondUnit: BigNumber,
  price: BigNumber,
  decimals: number,
): BigNumber {
  return amountInBondUnit.mul(price).div(Math.pow(10, 2 * BASE_TOKEN_DECIMALS - decimals));
}

export function convertAmountInBondUnitToBaseTokenUnit(
  amountInBondUnit: BigNumber,
  decimals: number,
  price: BigNumber,
): BigNumber {
  return amountInBondUnit.mul(Math.pow(10, 2 * BASE_TOKEN_DECIMALS - decimals)).div(price);
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
      depositTx = await depositoryContract.deposit(
        bond.index,
        amount,
        maxPrice,
        address,
        addresses[networkID].DAO_TREASURY,
      );
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

export function getBondCapacities(bond: IBondV2Core, quoteDecimals: number, bondPriceBigNumber: BigNumber) {
  let capacityInBaseToken: string, capacityInQuoteToken: string;
  if (bond.capacityInQuote) {
    capacityInBaseToken = ethers.utils.formatUnits(
      convertAmountInBondUnitToBaseTokenUnit(bond.capacity, quoteDecimals, bondPriceBigNumber),
      BASE_TOKEN_DECIMALS,
    );
    capacityInQuoteToken = ethers.utils.formatUnits(bond.capacity, quoteDecimals);
  } else {
    capacityInBaseToken = ethers.utils.formatUnits(bond.capacity, BASE_TOKEN_DECIMALS);
    capacityInQuoteToken = ethers.utils.formatUnits(
      convertAmountInBondUnitToQuoteTokenUnit(bond.capacity, bondPriceBigNumber, quoteDecimals),
      quoteDecimals,
    );
  }
  return { capacityInBaseToken, capacityInQuoteToken };
}

export function getBondDuration(terms: IBondV2Terms): string {
  const currentTime = Date.now() / 1000;
  let secondsRemaining = 0;

  if (terms.fixedTerm) {
    secondsRemaining = terms.vesting;
  } else {
    const conclusionTime = terms.conclusion;
    secondsRemaining = conclusionTime - currentTime;
  }

  return prettifySecondsInDays(secondsRemaining);
}

async function processBond(
  bond: IBondV2Core,
  metadata: IBondV2Meta,
  terms: IBondV2Terms,
  index: number,
  provider: ethers.providers.JsonRpcProvider,
  networkID: NetworkId,
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
): Promise<IBondV2> {
  const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, provider);
  const bondParser = new V2BondParser(bond.quoteToken.toLowerCase(), networkID, provider);
  let v2BondDetail: V2BondDetails = await bondParser.details();

  if (!v2BondDetail) {
    v2BondDetail = UnknownDetails;
    console.error(`Add details for bond index=${index}`);
  }
  const quoteTokenPrice = await v2BondDetail.pricingFunction();
  const bondPriceBigNumber = await depositoryContract.marketPrice(index);
  const bondPrice = +bondPriceBigNumber / Math.pow(10, BASE_TOKEN_DECIMALS);
  const bondPriceUSD = quoteTokenPrice * +bondPrice;
  const ohmPrice = (await dispatch(findOrLoadMarketPrice({ provider, networkID })).unwrap())?.marketPrice;
  const bondDiscount = (ohmPrice - bondPriceUSD) / ohmPrice;
  const { capacityInBaseToken, capacityInQuoteToken } = getBondCapacities(
    bond,
    metadata.quoteDecimals,
    bondPriceBigNumber,
  );
  const maxPayoutInBaseToken: string = ethers.utils.formatUnits(bond.maxPayout, BASE_TOKEN_DECIMALS);
  const maxPayoutInQuoteToken: string = ethers.utils.formatUnits(
    convertAmountInBondUnitToQuoteTokenUnit(bond.maxPayout, bondPriceBigNumber, metadata.quoteDecimals),
    metadata.quoteDecimals,
  );
  const duration = getBondDuration(terms);

  const soldOut = +capacityInBaseToken < 1 || +maxPayoutInBaseToken < 1;

  const maxPayoutOrCapacityInQuote =
    +capacityInQuoteToken > +maxPayoutInQuoteToken ? maxPayoutInQuoteToken : capacityInQuoteToken;
  const maxPayoutOrCapacityInBase =
    +capacityInBaseToken > +maxPayoutInBaseToken ? maxPayoutInBaseToken : capacityInBaseToken;

  return {
    ...bond,
    ...metadata,
    ...terms,
    index: index,
    displayName: `${v2BondDetail.name}`,
    payoutName: `OHM`,
    priceUSD: bondPriceUSD,
    priceToken: bondPrice,
    priceTokenBigNumber: bondPriceBigNumber,
    discount: bondDiscount,
    expiration: new Date(terms.vesting * 1000).toDateString(),
    duration,
    isLP: v2BondDetail.isLP,
    lpUrl: v2BondDetail.isLP ? v2BondDetail.lpUrl : "",
    marketPrice: ohmPrice,
    quoteToken: bond.quoteToken.toLowerCase(),
    baseToken: "OHM",
    baseDecimals: BASE_TOKEN_DECIMALS,
    maxPayoutInQuoteToken,
    maxPayoutInBaseToken,
    capacityInQuoteToken,
    capacityInBaseToken,
    soldOut,
    maxPayoutOrCapacityInQuote,
    maxPayoutOrCapacityInBase,
    bondIconSvg: v2BondDetail.bondIconSvg,
    payoutIconSvg: ["OHM"],
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
    const liveBonds: IBondV2[] = [];

    for (let i = 0; i < liveBondIndexes.length; i++) {
      const bondIndex = +liveBondIndexes[i];
      try {
        const bond: IBondV2Core = await liveBondPromises[i];
        const bondMetadata: IBondV2Meta = await liveBondMetadataPromises[i];
        const bondTerms: IBondV2Terms = await liveBondTermsPromises[i];
        const finalBond = await processBond(bond, bondMetadata, bondTerms, bondIndex, provider, networkID, dispatch);
        liveBonds.push(finalBond);

        if (address) {
          dispatch(getTokenBalance({ provider, networkID, address, value: finalBond.quoteToken }));
        }
      } catch (e) {
        console.log("getAllBonds Error for Bond Index: ", bondIndex);
        console.log(e);
      }
    }
    return liveBonds;
  },
);

export const getUserNotes = createAsyncThunk(
  "bondsV2/notes",
  async ({ provider, networkID, address }: IBaseAddressAsyncThunk): Promise<IUserNote[]> => {
    checkNetwork(networkID);
    const currentTime = Date.now() / 1000;
    const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, provider);
    const userNoteIndexes = await depositoryContract.indexesFor(address);
    const userNotePromises = userNoteIndexes.map(async index => await depositoryContract.notes(address, index));
    const userNotes: IDepoNote[] = await Promise.all(userNotePromises);
    const bonds = await Promise.all(
      Array.from(new Set(userNotes.map(note => note.marketID))).map(async id => {
        const bond = await depositoryContract.markets(id);
        const bondParser = new V2BondParser(bond.quoteToken.toLowerCase(), networkID, provider);
        const bondDetail: V2BondDetails = await bondParser.details();
        return { index: id, quoteToken: bond.quoteToken, ...bondDetail };
      }),
    ).then(result => Object.fromEntries(result.map(bond => [bond.index, bond])));
    const notes: IUserNote[] = [];
    for (let i = 0; i < userNotes.length; i++) {
      const rawNote: IDepoNote = userNotes[i];
      const bond = bonds[rawNote.marketID];
      const originalDurationSeconds = Math.max(rawNote.matured - rawNote.created, 0);
      const seconds = Math.max(rawNote.matured - currentTime, 0);
      let duration = "";
      if (seconds > 0) {
        duration = prettifySecondsInDays(seconds);
      } else {
        duration = "Fully Vested";
      }
      const originalDuration = prettifySecondsInDays(originalDurationSeconds);
      const note: IUserNote = {
        ...rawNote,
        payout: +rawNote.payout / Math.pow(10, 18), //Always in gOHM
        fullyMatured: seconds == 0,
        claimed: rawNote.matured == rawNote.redeemed,
        originalDurationSeconds: originalDurationSeconds,
        remainingDurationSeconds: seconds,
        originalDuration: originalDuration,
        timeLeft: duration,
        displayName: bond?.name,
        quoteToken: bond.quoteToken.toLowerCase(),
        index: +userNoteIndexes[i],
        bondIconSvg: bond?.bondIconSvg,
        token: "OHM",
      };
      notes.push(note);
    }
    return notes;
  },
);

export const claimAllNotes = createAsyncThunk(
  "bondsV2/claimAll",
  async ({ provider, networkID, address, gOHM }: IBaseBondV2ClaimAsyncThunk, { dispatch }) => {
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
  async ({ provider, networkID, address, indexes, gOHM }: IBaseBondV2SingleClaimAsyncThunk, { dispatch }) => {
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
  balanceLoading: { [key: string]: boolean };
  notesLoading: boolean;
  indexes: number[];
  balances: { [key: string]: IBondV2Balance };
  bonds: { [key: string]: IBondV2 };
  notes: IUserNote[];
}

const initialState: IBondSlice = {
  loading: false,
  balanceLoading: {},
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
      .addCase(getTokenBalance.pending, (state, action) => {
        state.balanceLoading[action.meta.arg.value] = true;
      })
      .addCase(getTokenBalance.fulfilled, (state, action) => {
        state.balances[action.payload.tokenAddress] = action.payload;
        state.balanceLoading[action.meta.arg.value] = false;
      })
      .addCase(getTokenBalance.rejected, (state, { error, meta }) => {
        state.balanceLoading[meta.arg.value] = false;
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
