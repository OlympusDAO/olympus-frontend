import { setAll } from "../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { IBaseAddressAsyncThunk } from "./interfaces";

import { calcAludelDetes } from "../helpers/OhmLusdCrucible";

export const getLusdData = createAsyncThunk(
  "stake/getLusdData",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    // only works on mainnet
    if (networkID !== 1) {
      // we don't have rinkeby contracts
      return { apy: 0, tvl: 0 };
    } else {
      // calcing APY & tvl
      const crucibleDetes = await calcAludelDetes(networkID, provider);
      let avgApy = crucibleDetes.averageApy;
      if (isNaN(avgApy)) avgApy = 0;

      return {
        apy: avgApy,
        tvl: crucibleDetes.tvlUsd,
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
