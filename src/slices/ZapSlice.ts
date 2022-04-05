import { AnyAction, createAsyncThunk, createSelector, createSlice, ThunkDispatch } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { addresses, NetworkId } from "src/constants";
import { GOHM_ADDRESSES, SOHM_ADDRESSES } from "src/constants/addresses";
import { setAll } from "src/helpers";
import { ZapHelper, ZapperToken } from "src/helpers/ZapHelper";
import { IERC20__factory, Zap__factory } from "src/typechain";

import { trackGAEvent } from "../helpers/analytics";
import { getBalances } from "./AccountSlice";
import { IActionValueAsyncThunk, IBaseAddressAsyncThunk, IValueAsyncThunk, IZapAsyncThunk } from "./interfaces";
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
export const getZapTokenAllowance = createAsyncThunk(
  "zap/getZapTokenAllowance",
  async ({ address, value, provider, networkID }: IValueAsyncThunk, { dispatch }) => {
    if (value === ethers.constants.AddressZero) {
      return { eth: ethers.constants.MaxUint256 };
    }
    try {
      const tokenContract = IERC20__factory.connect(value, provider);
      const allowance = await tokenContract.allowance(address, addresses[networkID].ZAP);
      const symbol = await tokenContract.symbol();
      return Object.fromEntries([[symbol.toLowerCase(), allowance]]);
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
      const signer = provider.getSigner();
      const tokenContract = IERC20__factory.connect(value, signer);
      const tx = await tokenContract.approve(addresses[networkID].ZAP, ethers.constants.MaxUint256);
      await tx.wait();

      const uaData: IUAData = {
        address: address,
        value: value,
        approved: true,
        type: "Zap Approval Request Success",
      };
      trackGAEvent({
        category: "OlyZaps",
        action: uaData.type,
        metric1: parseFloat(uaData.value),
      });
      dispatch(info("Successfully approved token!"));
      return Object.fromEntries([[action, BigNumber.from(ethers.constants.MaxUint256)]]);
    } catch (e: unknown) {
      const rpcError = e as any;
      const uaData: IUAData = {
        address: address,
        value: value,
        approved: false,
        type: "Zap Approval Request Failure",
      };
      trackGAEvent({
        category: "OlyZaps",
        action: uaData.type,
        metric1: parseFloat(uaData.value),
      });
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

        for (const key in result.balances) {
          const balance = result.balances[key];
          const balanceRaw = balance.balanceRaw;
          const balanceBigNumber = BigNumber.from(balanceRaw);
          balance.balanceRaw = ethers.utils.formatUnits(balanceBigNumber, balance.decimals);
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
  balances: { [key: string]: ZapperToken };
  balancesLoading: boolean;
  changeAllowanceLoading: boolean;
  stakeLoading: boolean;
  allowances: { [key: string]: BigNumber };
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
      .addCase(getZapTokenAllowance.pending, () => {})
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
