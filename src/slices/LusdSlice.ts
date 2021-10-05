import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";

import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OhmLusdCrucible } from "../abi/OhmLusdCrucible.json";

import { setAll } from "../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { NetworkID } from "src/lib/Bond";
import { ohm_lusd } from "../helpers/AllBonds";
import { calcAludelAPY } from "../helpers/OhmLusdCrucible";

interface IGetBalances {
  address: string;
  networkID: NetworkID;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
}

/**
 * Interface for pickle API objects
 */
interface IPoolInfo {
  tokenAddress: string;
  liquidity_locked: string;
  apy: string;
}

export const getLusdData = createAsyncThunk(
  "stake/getLusdData",
  async ({ address, networkID, provider }: IGetBalances) => {
    // only works on mainnet
    if (networkID !== 1) {
      // we don't have rinkeby contracts
      return { apy: 0, tvl: 0 };
    } else {
      const crucibleAddress = addresses[networkID].CRUCIBLE_OHM_LUSD;
      const ohmLusdReserve = ohm_lusd.getContractForReserve(networkID, provider);
      const balance = await ohmLusdReserve.balanceOf(crucibleAddress);
      const tvlUSD = parseFloat(formatEther(balance));

      // calcing APY
      const crucibleAPY = await calcAludelAPY(networkID, provider);
      console.log("adata", crucibleAPY);
      // const crucibleAPY = 0;

      return {
        apy: crucibleAPY.averageApy,
        tvl: crucibleAPY.tvlUsd,
        // NOTE (appleseed): balance is in accountSlice for the bond
        // balance: ethers.utils.formatUnits(sushiOhmLusdBalance, "gwei"),
      };
    }
  },
);

/**
 * interface for object returned from getLusdData + loading status
 */
export interface IUserLusdDetails {
  apy: number;
  tvl: number;
  loading: boolean;
}

const initialState: IUserLusdDetails = {
  loading: false,
  apy: 0,
  tvl: 0,
};

const lusdSlice = createSlice({
  name: "lusdData",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getLusdData.pending, state => {
        state.loading = true;
      })
      .addCase(getLusdData.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getLusdData.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default lusdSlice.reducer;

const baseInfo = (state: any) => state.lusdData;

export const getLusdState = createSelector(baseInfo, app => app);
