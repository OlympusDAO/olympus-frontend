import { AnyAction, createAsyncThunk, createSelector, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { NetworkId } from "src/constants";
import { setAll } from "src/helpers";
import { ZapHelper } from "src/helpers/ZapHelper";

import { segmentUA } from "../helpers/userAnalyticHelpers";
import { getBalances } from "./AccountSlice";
import { IActionValueAsyncThunk, IBaseAddressAsyncThunk, IZapAsyncThunk } from "./interfaces";
import { error, info } from "./MessagesSlice";
interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  type: string | null;
}
interface IUADataZap {
  address: string;
  value: string;
  token: string;
  type: string;
  slippage: string;
  approved: boolean;
}
export const getZapTokenAllowance = createAsyncThunk(
  "zap/getZapTokenAllowance",
  async ({ address, value, action, provider, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    try {
      const result = await ZapHelper.getZapTokenAllowanceHelper(value, address);
      return Object.fromEntries([[action, result]]);
    } catch (e: unknown) {
      console.error(e);
      dispatch(error("An error has occurred when fetching token allowance."));
      throw e;
    }
  },
);

export const zapNetworkCheck = createAsyncThunk(
  "zap/zapNetworkCheck",
  async ({ networkID }: { networkID: NetworkId }, { dispatch }) => {
    zapNetworkAvailable(networkID, dispatch);
  },
);

export const changeZapTokenAllowance = createAsyncThunk(
  "zap/changeZapTokenAllowance",
  async ({ address, value, provider, action, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    try {
      const gasPrice = await provider.getGasPrice();
      const rawTransactionData = await ZapHelper.changeZapTokenAllowanceHelper(value, address, +gasPrice);
      const transactionData = {
        data: rawTransactionData.data,
        to: rawTransactionData.to,
        from: rawTransactionData.from,
      };
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction(transactionData);
      await tx.wait();

      const uaData: IUAData = {
        address: address,
        value: value,
        approved: true,
        type: "Zap Approval Request Success",
      };
      segmentUA(uaData);
      dispatch(info("Successfully approved token!"));
      return Object.fromEntries([[action, true]]);
    } catch (e: unknown) {
      const rpcError = e as any;
      const uaData: IUAData = {
        address: address,
        value: value,
        approved: false,
        type: "Zap Approval Request Failure",
      };
      segmentUA(uaData);
      console.error(e);
      dispatch(error(`${rpcError.message} ${rpcError.data?.message ?? ""}`));
      throw e;
    }
  },
);

export const getZapTokenBalances = createAsyncThunk(
  "zap/getZapTokenBalances",
  async ({ address }: IBaseAddressAsyncThunk, { dispatch }) => {
    if (address) {
      try {
        const result = await ZapHelper.getZapTokens(address);
        if (result.balances["ohm"]) {
          result.balances["ohm"].hide = true;
        }
        return result;
      } catch (e: unknown) {
        console.error(e);
        dispatch(error("An error has occurred when fetching token balances."));
        throw e;
      }
    }
  },
);

export const executeZap = createAsyncThunk(
  "zap/executeZap",
  async ({ provider, address, sellAmount, slippage, tokenAddress, networkID }: IZapAsyncThunk, { dispatch }) => {
    if (!zapNetworkAvailable(networkID, dispatch)) return;
    try {
      const gasPrice = await provider.getGasPrice();
      const rawTransactionData = await ZapHelper.executeZapHelper(
        sellAmount,
        address,
        tokenAddress,
        slippage,
        +gasPrice,
        networkID,
      );
      const transactionData = {
        data: rawTransactionData.data,
        from: rawTransactionData.from,
        to: rawTransactionData.to,
        value: rawTransactionData.value,
        gasLimit: ethers.utils.hexlify(Number(rawTransactionData.gas)),
      };
      const signer = provider.getSigner();
      const tx = await signer.sendTransaction(transactionData);
      await tx.wait();

      const uaData: IUADataZap = {
        address: address,
        value: sellAmount.toString(),
        token: tokenAddress,
        type: "Zap Swap Success",
        slippage: slippage,
        approved: true,
      };
      segmentUA(uaData);
      dispatch(info("Successful Zap!"));
    } catch (e: unknown) {
      const uaData: IUADataZap = {
        address: address,
        value: sellAmount.toString(),
        token: tokenAddress,
        type: "Zap Swap Failure",
        slippage: slippage,
        approved: false,
      };
      segmentUA(uaData);
      console.error(e);
      const rpcError = e as any;
      dispatch(error(`${rpcError.message} ${rpcError.data?.message ?? ""}`));
      throw e;
    }
    dispatch(getBalances({ address, provider, networkID }));
    dispatch(getZapTokenBalances({ address, provider, networkID }));
  },
);

const zapNetworkAvailable = (networkID: NetworkId, dispatch: ThunkDispatch<unknown, unknown, AnyAction>) => {
  if (Number(networkID) === 1) {
    return true;
  } else {
    dispatch(info("Zaps are only available on Mainnet"));
    return false;
  }
};

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
        console.error("Handled error");
        console.error(error.message);
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
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
