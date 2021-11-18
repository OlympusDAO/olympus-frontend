// const ZAPPER_API_KEY: string = "96e0cc51-a62e-42ca-acee-910ea7d2a241";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { setAll } from "src/helpers";

import { EnvHelper } from "src/helpers/Environment";
import { ZapHelper } from "src/helpers/ZapHelper";
import {
  IActionValueAsyncThunk,
  IActionValueGasAsyncThunk,
  IBaseAddressAsyncThunk,
  IValueAsyncThunk,
} from "./interfaces";

export const getZapTokenAllowance = createAsyncThunk(
  "zap/getZapTokenAllowance",
  async ({ address, value, action }: IActionValueAsyncThunk, { dispatch }) => {
    if (address) {
      const result = await ZapHelper.getZapTokenAllowance(value, address);
      return Object.fromEntries([[action, result]]);
    }
  },
);

export const changeZapTokenAllowance = createAsyncThunk(
  "zap/changeZapTokenAllowance",
  async ({ address, value, action, gas, provider }: IActionValueGasAsyncThunk, { dispatch }) => {
    if (address) {
      const transactionData = await ZapHelper.changeZapTokenAllowance(value, address, gas);
      transactionData.gasPrice = ethers.utils.hexlify(gas);
      const signer = provider.getSigner();
      await signer.sendTransaction(transactionData);
      // await provider.sendTransaction(transactionData);
      // return Object.fromEntries([[action, result]]);
    }
  },
);

export const getZapTokenBalances = createAsyncThunk(
  "zap/getZapTokenBalances",
  async ({ provider, address, networkID }: IBaseAddressAsyncThunk, { dispatch }) => {
    if (address) {
      const result = await ZapHelper.getZapTokens(address);
      return result;
    }
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
