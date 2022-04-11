import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { addresses, NetworkId, UnknownDetails, V2BondDetails, V2BondParser } from "src/constants";
import { prettifySeconds } from "src/helpers/timeUtil";
import { RootState } from "src/store";
import { IERC20__factory, OlympusProV2__factory } from "src/typechain";

import { getBalances } from "./AccountSlice";
import {
  IBondInverseCore,
  IBondInverseMeta,
  IBondV2,
  IBondV2Balance,
  IBondV2Terms,
  IInverseDepoNote,
  IUserNote,
} from "./BondSliceV2";
import {
  IBaseAddressAsyncThunk,
  IBaseBondV2ClaimAsyncThunk,
  IBaseBondV2SingleClaimAsyncThunk,
  IBondInversePurchaseAsyncThunk,
  IBondV2AysncThunk,
  IBondV2IndexAsyncThunk,
  IJsonRPCError,
  IValueAsyncThunk,
} from "./interfaces";
import { error, info } from "./MessagesSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";

function checkNetwork(networkID: NetworkId) {
  if (networkID !== 1 && networkID !== 4) {
    //ENABLE FOR MAINNET LAUNCH
    throw Error(`Network=${networkID} is not supported for V2 bonds`);
  }
}

export const changeInverseApproval = createAsyncThunk(
  "inverseBonds/changeApproval",
  async ({ bond, provider, networkID, address }: IBondV2AysncThunk, { dispatch, getState }) => {
    checkNetwork(networkID);
    const signer = provider.getSigner();
    const bondState: IBondV2 = (getState() as RootState).inverseBonds.bonds[bond.index];
    const tokenContractAddress: string = bondState.quoteToken;
    const tokenDecimals: number = bondState.quoteDecimals;
    const tokenContract = IERC20__factory.connect(tokenContractAddress, signer);
    let approveTx: ethers.ContractTransaction | undefined;
    try {
      approveTx = await tokenContract.approve(
        addresses[networkID].OP_BOND_DEPOSITORY,
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
        dispatch(getInverseTokenBalance({ provider, networkID, address, value: tokenContractAddress }));
      }
    }
  },
);

export const purchaseInverseBond = createAsyncThunk(
  "inverseBonds/purchase",
  async ({ provider, address, bond, networkID, amounts }: IBondInversePurchaseAsyncThunk, { dispatch }) => {
    checkNetwork(networkID);
    const signer = provider.getSigner();
    // TODO (appleseed-inverse) update the ABI & Factory one last time before launch
    const depositoryContract = OlympusProV2__factory.connect(addresses[networkID].OP_BOND_DEPOSITORY, signer);

    let depositTx: ethers.ContractTransaction | undefined;
    try {
      depositTx = await depositoryContract.deposit(
        bond.index,
        [amounts[0], amounts[1]],
        [address, addresses[networkID].DAO_TREASURY],
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
        dispatch(getAllInverseBonds({ address, provider, networkID }));
      }
    }
  },
);

export const getSingleBond = createAsyncThunk(
  "inverseBonds/getSingle",
  async ({ provider, networkID, bondIndex }: IBondV2IndexAsyncThunk): Promise<IBondV2> => {
    checkNetwork(networkID);
    // TODO (appleseed-inverse): update this factory & abi to the deployed depository
    const depositoryContract = OlympusProV2__factory.connect(addresses[networkID].OP_BOND_DEPOSITORY, provider);
    const bondCore = await depositoryContract.markets(bondIndex);
    const bondMetadata = await depositoryContract.metadata(bondIndex);
    const bondTerms = await depositoryContract.terms(bondIndex);
    return processBond(bondCore, bondMetadata, bondTerms, bondIndex, provider, networkID);
  },
);

export const getInverseTokenBalance = createAsyncThunk(
  "inverseBonds/getBalance",
  async ({ provider, networkID, address, value }: IValueAsyncThunk, {}): Promise<IBondV2Balance> => {
    checkNetwork(networkID);
    const tokenContract = IERC20__factory.connect(value, provider);
    const balance = await tokenContract.balanceOf(address);
    const allowance = await tokenContract.allowance(address, addresses[networkID].OP_BOND_DEPOSITORY);
    return { balance, allowance, tokenAddress: value };
  },
);

async function processBond(
  bond: IBondInverseCore,
  metadata: IBondInverseMeta,
  terms: IBondV2Terms,
  index: number,
  provider: ethers.providers.JsonRpcProvider,
  networkID: NetworkId,
): Promise<IBondV2> {
  const currentTime = Date.now() / 1000;
  // TODO (appleseed-inverse): update this factory & abi to the deployed depository
  const depositoryContract = OlympusProV2__factory.connect(addresses[networkID].OP_BOND_DEPOSITORY, provider);
  const bondParser = new V2BondParser(bond.quoteToken.toLowerCase(), networkID, provider);
  let v2BondDetail: V2BondDetails = await bondParser.details();
  // let v2BondDetail: V2BondDetails = v2BondDetails[networkID][bond.quoteToken.toLowerCase()];
  const payoutParser = new V2BondParser(bond.baseToken.toLowerCase(), networkID, provider);
  const payoutDetail: V2BondDetails = await payoutParser.details();

  if (!v2BondDetail) {
    v2BondDetail = UnknownDetails;
    console.error(`Add details for bond index=${index}`);
  }
  // quoteTokenPrice === the price of LUSD or DAI or OHM-DAI etc, except with Inverse Bonds == price of OHM
  const quoteTokenPrice = await v2BondDetail.pricingFunction();
  // bondPriceBigNumber === the market price of quote_token (bond_in_token) in base_token (payout_token) where base_token is typically OHM
  // ... in other words, 20 bond_in_token / 1 payout_token w/ payout_token decimals (X bond_in_token per 1 payout_token)
  const bondPriceBigNumber = await depositoryContract.marketPrice(index);
  const bondPrice = +bondPriceBigNumber / Math.pow(10, metadata.baseDecimals);
  // bondPriceUsd === $X/payoutToken
  const bondPriceUSD = quoteTokenPrice * +bondPrice;

  const payoutTokenPrice = await payoutDetail.pricingFunction();
  const bondDiscount = (payoutTokenPrice - bondPriceUSD) / payoutTokenPrice;

  let capacityInBaseToken: string, capacityInQuoteToken: string;
  if (bond.capacityInQuote) {
    capacityInBaseToken = ethers.utils.formatUnits(
      bond.capacity.mul(Math.pow(10, metadata.baseDecimals - metadata.quoteDecimals)).div(bondPriceBigNumber),
      metadata.quoteDecimals,
    );
    capacityInQuoteToken = ethers.utils.formatUnits(bond.capacity, metadata.quoteDecimals);
  } else {
    capacityInBaseToken = ethers.utils.formatUnits(bond.capacity, metadata.baseDecimals);
    capacityInQuoteToken = ethers.utils.formatUnits(bond.capacity.mul(bondPriceBigNumber), metadata.baseDecimals * 2);
  }
  const maxPayoutInBaseToken: string = ethers.utils.formatUnits(bond.maxPayout, metadata.baseDecimals);
  const maxPayoutInQuoteToken: string = ethers.utils.formatUnits(
    bond.maxPayout.mul(bondPriceBigNumber),
    metadata.baseDecimals * 2,
  );
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

  // SAFETY CHECKs
  // 1. check sold out
  let soldOut = false;
  if (+capacityInBaseToken < 1 || +maxPayoutInBaseToken < 1) soldOut = true;
  const maxPayoutOrCapacityInQuote =
    +capacityInQuoteToken > +maxPayoutInQuoteToken ? maxPayoutInQuoteToken : capacityInQuoteToken;
  const maxPayoutOrCapacityInBase =
    +capacityInBaseToken > +maxPayoutInBaseToken ? maxPayoutInBaseToken : capacityInBaseToken;

  soldOut = false;
  return {
    ...bond,
    ...metadata,
    ...terms,
    index: index,
    displayName: `${v2BondDetail.name}`,
    payoutName: `${payoutDetail.name}`,
    priceUSD: bondPriceUSD,
    priceToken: bondPrice,
    priceTokenBigNumber: bondPriceBigNumber,
    discount: bondDiscount,
    expiration: new Date(terms.vesting * 1000).toDateString(),
    duration,
    isLP: v2BondDetail.isLP,
    lpUrl: v2BondDetail.isLP ? v2BondDetail.lpUrl[networkID] : "",
    marketPrice: payoutTokenPrice,
    quoteToken: bond.quoteToken.toLowerCase(),
    baseToken: bond.baseToken.toLowerCase(),
    maxPayoutInQuoteToken,
    maxPayoutInBaseToken,
    capacityInQuoteToken,
    capacityInBaseToken,
    soldOut,
    maxPayoutOrCapacityInQuote,
    maxPayoutOrCapacityInBase,
    bondIconSvg: v2BondDetail.bondIconSvg,
    payoutIconSvg: payoutDetail.bondIconSvg,
  };
}

export const getAllInverseBonds = createAsyncThunk(
  "inverseBonds/getAll",
  async ({ provider, networkID, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    checkNetwork(networkID);
    const depositoryContract = OlympusProV2__factory.connect(addresses[networkID].OP_BOND_DEPOSITORY, provider);
    const liveBondIndexes = await depositoryContract.liveMarkets();
    // `markets()` returns quote/price data
    const liveBondPromises = liveBondIndexes.map(async index => await depositoryContract.markets(index));
    const liveBondMetadataPromises = liveBondIndexes.map(async index => await depositoryContract.metadata(index));
    const liveBondTermsPromises = liveBondIndexes.map(async index => await depositoryContract.terms(index));
    const liveBonds: IBondV2[] = [];

    for (let i = 0; i < liveBondIndexes.length; i++) {
      const bondIndex = +liveBondIndexes[i];
      try {
        const bond: IBondInverseCore = await liveBondPromises[i];
        const bondMetadata: IBondInverseMeta = await liveBondMetadataPromises[i];
        const bondTerms: IBondV2Terms = await liveBondTermsPromises[i];
        const finalBond = await processBond(bond, bondMetadata, bondTerms, bondIndex, provider, networkID);
        liveBonds.push(finalBond);

        if (address) {
          dispatch(getInverseTokenBalance({ provider, networkID, address, value: finalBond.quoteToken }));
        }
      } catch (e) {
        console.log("getAllInverseBonds Error for Bond Index: ", bondIndex);
        console.log(e);
      }
    }
    return liveBonds;
  },
);

export const getUserNotes = createAsyncThunk(
  "inverseBonds/notes",
  async ({ provider, networkID, address }: IBaseAddressAsyncThunk): Promise<IUserNote[]> => {
    checkNetwork(networkID);
    const currentTime = Date.now() / 1000;
    const depositoryContract = OlympusProV2__factory.connect(addresses[networkID].OP_BOND_DEPOSITORY, provider);
    const userNoteIndexes = await depositoryContract.indexesFor(address);
    const userNotePromises = userNoteIndexes.map(async index => await depositoryContract.notes(address, index));
    const userNotes: IInverseDepoNote[] = await Promise.all(userNotePromises);
    const bonds = await Promise.all(
      Array.from(new Set(userNotes.map(note => note.marketID))).map(async id => {
        const bond = await depositoryContract.markets(id);
        // const bondDetail = v2BondDetails[networkID][bond.quoteToken.toLowerCase()];
        const bondParser = new V2BondParser(bond.quoteToken.toLowerCase(), networkID, provider);
        const bondDetail: V2BondDetails = await bondParser.details();
        return { index: id, quoteToken: bond.quoteToken, ...bondDetail };
      }),
    ).then(result => Object.fromEntries(result.map(bond => [bond.index, bond])));
    const notes: IUserNote[] = [];
    for (let i = 0; i < userNotes.length; i++) {
      const rawNote: IInverseDepoNote = userNotes[i];
      const bond = bonds[rawNote.marketID];
      const originalDurationSeconds = Math.max(rawNote.matured - rawNote.created, 0);
      const seconds = Math.max(rawNote.matured - currentTime, 0);
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
        displayName: bond?.name,
        quoteToken: bond.quoteToken.toLowerCase(),
        index: +userNoteIndexes[i],
        bondIconSvg: bond?.bondIconSvg,
      };
      notes.push(note);
    }
    return notes;
  },
);

export const claimAllNotes = createAsyncThunk(
  "inverseBonds/claimAll",
  async ({ provider, networkID, address }: IBaseBondV2ClaimAsyncThunk, { dispatch }) => {
    const signer = provider.getSigner();
    const depositoryContract = OlympusProV2__factory.connect(addresses[networkID].OP_BOND_DEPOSITORY, signer);

    let claimTx: ethers.ContractTransaction | undefined;
    try {
      claimTx = await depositoryContract.redeemAll(address);
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
  "inverseBonds/claimSingle",
  async ({ provider, networkID, address, indexes }: IBaseBondV2SingleClaimAsyncThunk, { dispatch }) => {
    const signer = provider.getSigner();
    const depositoryContract = OlympusProV2__factory.connect(addresses[networkID].OP_BOND_DEPOSITORY, signer);

    let claimTx: ethers.ContractTransaction | undefined;
    try {
      claimTx = await depositoryContract.redeem(address, indexes);
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

const inverseBondingSlice = createSlice({
  name: "inverseBonds",
  initialState,
  reducers: {
    fetchBondSuccessInverse(state, action) {
      state.bonds[action.payload.bond] = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getAllInverseBonds.pending, state => {
        state.loading = true;
      })
      .addCase(getAllInverseBonds.fulfilled, (state, action) => {
        state.indexes = [];
        state.bonds = {};
        action.payload.forEach(bond => {
          state.bonds[bond.index] = bond;
          state.indexes.push(bond.index);
        });
        state.loading = false;
      })
      .addCase(getAllInverseBonds.rejected, (state, { error }) => {
        state.indexes = [];
        state.bonds = {};
        state.loading = false;
        console.error(error.message);
      })
      .addCase(getInverseTokenBalance.pending, (state, action) => {
        state.balanceLoading[action.meta.arg.value] = true;
      })
      .addCase(getInverseTokenBalance.fulfilled, (state, action) => {
        state.balances[action.payload.tokenAddress] = action.payload;
        state.balanceLoading[action.meta.arg.value] = false;
      })
      .addCase(getInverseTokenBalance.rejected, (state, { error, meta }) => {
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

export const inverseBondingReducer = inverseBondingSlice.reducer;

export const { fetchBondSuccessInverse } = inverseBondingSlice.actions;

const baseInfo = (state: RootState) => state.inverseBonds;

export const getInverseBondingState = createSelector(baseInfo, bonding => bonding);
