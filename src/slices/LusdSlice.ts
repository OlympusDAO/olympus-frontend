import { ethers } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";

import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";

import { setAll } from "../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { NetworkID } from "src/lib/Bond";
import { ohm_lusd } from "../helpers/AllBonds";

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
      const ohm_lusd_reserve_address = ohm_lusd.getAddressForReserve(networkID);
      const ohmLusdReserve = new ethers.Contract(ohm_lusd_reserve_address as string, ierc20Abi, provider);
      const balance = await ohmLusdReserve.balanceOf(crucibleAddress);
      const tvlUSD = parseFloat(formatEther(balance));

      const apy = 0;
      // NOTE (appleseed-lusd): for reference:
      // Pickle also calcs APY another way:
      // // from pickle https://github.com/pickle-finance/pickle-ui/blob/3074c751cbaf83bae88ada1c63bf8a4a3eeb9860/containers/Farms/useJarFarmApy.ts
      // // https://github.com/pickle-finance/pickle-ui/blob/4aa4955ec65d75cb8ab13d6237c533bf0de2d441/containers/Jars/useJarsWithTVL.ts#L31

      return {
        apy: apy,
        tvl: tvlUSD,
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
