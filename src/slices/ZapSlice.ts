// const ZAPPER_API_KEY: string = "96e0cc51-a62e-42ca-acee-910ea7d2a241";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { setAll } from "src/helpers";
import { ZapHelper } from "src/helpers/ZapHelper";
import { getBalances } from "./AccountSlice";
import { IActionValueAsyncThunk, IBaseAddressAsyncThunk, IZapAsyncThunk } from "./interfaces";
import { error, info } from "./MessagesSlice";

export const getZapTokenAllowance = createAsyncThunk(
  "zap/getZapTokenAllowance",
  async ({ address, value, action }: IActionValueAsyncThunk, { dispatch }) => {
    try {
      const result = await ZapHelper.getZapTokenAllowanceHelper(value, address);
      return Object.fromEntries([[action, result]]);
    } catch (e: unknown) {
      console.error(e);
      dispatch(error("An error has occurred when fetching token allowance."));
    }
  },
);

export const changeZapTokenAllowance = createAsyncThunk(
  "zap/changeZapTokenAllowance",
  async ({ address, value, provider, action }: IActionValueAsyncThunk, { dispatch }) => {
    try {
      const rawTransactionData = await ZapHelper.changeZapTokenAllowanceHelper(value, address, 1);
      const transactionData = {
        data: rawTransactionData.data,
        to: rawTransactionData.to,
        from: rawTransactionData.from,
      };
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction(transactionData);
      await tx.wait();
      dispatch(info("Successfully approved token!"));
      return Object.fromEntries([[action, true]]);
    } catch (e: unknown) {
      const rpcError = e as any;
      console.error(e);
      dispatch(error(`${rpcError.message} ${rpcError.data?.message}`));
    }
  },
);

export const getZapTokenBalances = createAsyncThunk(
  "zap/getZapTokenBalances",
  async ({ address }: IBaseAddressAsyncThunk, { dispatch }) => {
    if (address) {
      try {
        const result = await ZapHelper.getZapTokens(address);
        return result;
      } catch (e: unknown) {
        console.error(e);
        dispatch(error("An error has occurred when fetching token balances."));
      }
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
      dispatch(info("Successful Zap!"));
    } catch (e: unknown) {
      console.error(e);
      const rpcError = e as any;
      dispatch(error(`${rpcError.message} ${rpcError.data?.message}`));
    }
    dispatch(getBalances({ address, provider, networkID }));
  },
);

export interface IZapSlice {
  balances: { [key: string]: any };
  balancesLoading: boolean;
  changeAllowanceLoading: boolean;
  stakeLoading: boolean;
  allowances: { [key: string]: number };
}

const initialState: IZapSlice = {
  balances: {},
  balancesLoading: false,
  allowances: {},
  changeAllowanceLoading: false,
  stakeLoading: false,
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
        state.balancesLoading = true;
      })
      .addCase(getZapTokenBalances.fulfilled, (state, action) => {
        if (!action.payload) return;
        setAll(state, action.payload);
        state.balancesLoading = false;
      })
      .addCase(getZapTokenBalances.rejected, (state, { error }) => {
        state.balancesLoading = false;
        console.error(error.message);
      })
      .addCase(changeZapTokenAllowance.pending, state => {
        state.changeAllowanceLoading = true;
      })
      .addCase(changeZapTokenAllowance.fulfilled, (state, action) => {
        if (!action.payload) return;
        setAll(state.allowances, action.payload);
        state.changeAllowanceLoading = false;
      })
      .addCase(changeZapTokenAllowance.rejected, (state, { error }) => {
        state.changeAllowanceLoading = false;
        console.error(error.message);
      })
      .addCase(getZapTokenAllowance.pending, state => {})
      .addCase(getZapTokenAllowance.fulfilled, (state, action) => {
        if (!action.payload) return;
        setAll(state.allowances, action.payload);
      })
      .addCase(getZapTokenAllowance.rejected, (state, { error }) => {
        console.error(error.message);
      })
      .addCase(executeZap.pending, state => {
        state.stakeLoading = true;
      })
      .addCase(executeZap.fulfilled, (state, action) => {
        state.stakeLoading = false;
      })
      .addCase(executeZap.rejected, (state, { error }) => {
        console.error(error.message);
        state.stakeLoading = false;
      });
  },
});

export default zapTokenBalancesSlice.reducer;

const baseInfo = (state: any) => state.zap;

export const { fetchZapTokensSuccess } = zapTokenBalancesSlice.actions;

export const getZapState = createSelector(baseInfo, zap => zap);
