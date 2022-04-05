import { AnyAction, createAsyncThunk, createSelector, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { addresses, NetworkId } from "src/constants";
import { GOHM_ADDRESSES, SOHM_ADDRESSES } from "src/constants/addresses";
import { setAll } from "src/helpers";
import { ZapHelper } from "src/helpers/ZapHelper";
import { Zap__factory } from "src/typechain";

import { trackGAEvent } from "../helpers/analytics";
import { getBalances } from "./AccountSlice";
import { IZapAsyncThunk } from "./interfaces";
import { error, info } from "./MessagesSlice";
interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  type: string;
}
interface IUADataZap {
  address: string;
  value: string;
  token: string;
  type: string;
  slippage: string;
  approved: boolean;
}

export const zapNetworkCheck = createAsyncThunk(
  "zap/zapNetworkCheck",
  async ({ networkID }: { networkID: NetworkId }, { dispatch }) => {
    zapNetworkAvailable(networkID, dispatch);
  },
);

export const executeZap = createAsyncThunk(
  "zap/executeZap",
  async (
    { provider, address, sellAmount, slippage, tokenAddress, networkID, minimumAmount, gOHM }: IZapAsyncThunk,
    { dispatch },
  ) => {
    if (!zapNetworkAvailable(networkID, dispatch)) return;
    try {
      const signer = provider.getSigner();
      const rawTransactionData = await ZapHelper.executeZapHelper(address, sellAmount, tokenAddress, +slippage / 100);
      const zapContract = Zap__factory.connect(addresses[networkID].ZAP, signer);
      let tx: ethers.ContractTransaction;
      if (tokenAddress === ethers.constants.AddressZero) {
        tx = await zapContract.ZapStake(
          tokenAddress,
          sellAmount,
          gOHM
            ? GOHM_ADDRESSES[networkID as keyof typeof GOHM_ADDRESSES]
            : SOHM_ADDRESSES[networkID as keyof typeof SOHM_ADDRESSES],
          ethers.utils.parseUnits(minimumAmount, gOHM ? 18 : 9),
          rawTransactionData.to,
          rawTransactionData.data,
          address,
          { value: sellAmount },
        );
      } else {
        tx = await zapContract.ZapStake(
          tokenAddress,
          sellAmount,
          gOHM
            ? GOHM_ADDRESSES[networkID as keyof typeof GOHM_ADDRESSES]
            : SOHM_ADDRESSES[networkID as keyof typeof SOHM_ADDRESSES],
          ethers.utils.parseUnits(minimumAmount, gOHM ? 18 : 9),
          rawTransactionData.to,
          rawTransactionData.data,
          address,
        );
      }
      await tx.wait();

      const uaData: IUADataZap = {
        address: address,
        value: sellAmount.toString(),
        token: tokenAddress,
        type: "Zap Swap Success",
        slippage: slippage,
        approved: true,
      };
      trackGAEvent({
        category: "OlyZaps",
        action: uaData.type,
        metric1: parseFloat(uaData.value),
      });
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
      trackGAEvent({
        category: "OlyZaps",
        action: uaData.type,
        metric1: parseFloat(uaData.value),
      });
      console.error(e);
      const rpcError = e as any;
      if (rpcError.message.indexOf("High Slippage") > 0) {
        dispatch(error(`Transaction would fail due to slippage. Please use a higher slippage tolerance value.`));
      } else if (rpcError.message.indexOf("TRANSFER_AMOUNT_EXCEEDS_BALANCE") > 0) {
        dispatch(error(`Insufficient balance.`));
      } else {
        dispatch(error(`${rpcError.message} ${rpcError.data?.message ?? ""}`));
      }
      throw e;
    }
    dispatch(getBalances({ address, provider, networkID }));
    // TODO force refresh of zapTokenBalances
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
  changeAllowanceLoading: boolean;
  stakeLoading: boolean;
  allowances: { [key: string]: BigNumber };
}

const initialState: IZapSlice = {
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
      .addCase(executeZap.pending, state => {
        state.stakeLoading = true;
      })
      .addCase(executeZap.fulfilled, state => {
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
