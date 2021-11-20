// const ZAPPER_API_KEY: string = "96e0cc51-a62e-42ca-acee-910ea7d2a241";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { setAll } from "src/helpers";

import { EnvHelper } from "src/helpers/Environment";
import { ZapHelper } from "src/helpers/ZapHelper";
import { getBalances } from "./AccountSlice";
import {
  IActionValueAsyncThunk,
  IActionValueGasAsyncThunk,
  IBaseAddressAsyncThunk,
  IJsonRPCError,
  IValueAsyncThunk,
  IZapAsyncThunk,
} from "./interfaces";
import { error } from "./MessagesSlice";

export const getZapTokenAllowance = createAsyncThunk(
  "zap/getZapTokenAllowance",
  async ({ address, value, action }: IActionValueAsyncThunk, { dispatch }) => {
    const result = await ZapHelper.getZapTokenAllowanceHelper(value, address);
    return Object.fromEntries([[action, result]]);
  },
);

export const changeZapTokenAllowance = createAsyncThunk(
  "zap/changeZapTokenAllowance",
  async ({ address, value, provider, action }: IActionValueAsyncThunk, { dispatch }) => {
    const rawTransactionData = await ZapHelper.changeZapTokenAllowanceHelper(value, address, 1);
    const transactionData = {
      data: rawTransactionData.data,
      to: rawTransactionData.to,
      from: rawTransactionData.from,
    };
    const signer = provider.getSigner();
    await signer.sendTransaction(transactionData);
    return Object.fromEntries([[action, true]]);
  },
);

export const getZapTokenBalances = createAsyncThunk(
  "zap/getZapTokenBalances",
  async ({ provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    if (address) {
      const result = await ZapHelper.getZapTokens(address);
      return result;
    }
  },
);

export const executeZap = createAsyncThunk(
  "zap/executeZap",
  async ({ provider, address, sellAmount, slippage, tokenAddress, networkID }: IZapAsyncThunk, { dispatch }) => {
    try {
      const rawTransactionData = await ZapHelper.executeZapHelper(sellAmount, address, tokenAddress, slippage, 1);
      const transactionData = {
        data: rawTransactionData.data,
        from: rawTransactionData.from,
        to: rawTransactionData.to,
        value: rawTransactionData.value,
      };
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction(transactionData);
      await tx.wait();
    } catch (e: unknown) {
      console.log(e);
      const rpcError = e as any;
      dispatch(error(`${rpcError.message} ${rpcError.data.message}`));
    }
    dispatch(getBalances({ address, provider, networkID }));
  },
);

export interface IZapSlice {
  balances: { [key: string]: any };
  loading: boolean;
  allowances: { [key: string]: number };
}

const initialState: IZapSlice = {
  balances: {},
  loading: false,
  allowances: {},
};

const zapTokenBalancesSlice = createSlice({
  name: "zap",
  initialState,
  reducers: {
    fetchZapTokensSuccess(state, action) {
      setAll(state, action.payload);
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getZapTokenBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getZapTokenBalances.fulfilled, (state, action) => {
        if (!action.payload) return;
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getZapTokenBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.message);
      })
      .addCase(changeZapTokenAllowance.pending, state => {
        state.loading = true;
      })
      .addCase(changeZapTokenAllowance.fulfilled, (state, action) => {
        if (!action.payload) return;
        setAll(state.allowances, action.payload);
        state.loading = false;
      })
      .addCase(changeZapTokenAllowance.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.message);
      })
      .addCase(getZapTokenAllowance.pending, state => {
        state.loading = true;
      })
      .addCase(getZapTokenAllowance.fulfilled, (state, action) => {
        if (!action.payload) return;
        setAll(state.allowances, action.payload);
        state.loading = false;
      })
      .addCase(getZapTokenAllowance.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.message);
      });
  },
});

export default zapTokenBalancesSlice.reducer;

const baseInfo = (state: any) => state.zap;

export const { fetchZapTokensSuccess } = zapTokenBalancesSlice.actions;

export const getZapState = createSelector(baseInfo, zap => zap);
