// const ZAPPER_API_KEY: string = "96e0cc51-a62e-42ca-acee-910ea7d2a241";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { setAll } from "src/helpers";

import { EnvHelper } from "src/helpers/Environment";
import { ZapHelper } from "src/helpers/ZapHelper";
import { IBaseAddressAsyncThunk } from "./interfaces";

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
}

const initialState: IZapSlice = {
  balances: {},
  loading: false,
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
      });
  },
});

export default zapTokenBalancesSlice.reducer;

const baseInfo = (state: any) => state.zap;

export const { fetchZapTokensSuccess } = zapTokenBalancesSlice.actions;

export const getZapState = createSelector(baseInfo, zap => zap);
