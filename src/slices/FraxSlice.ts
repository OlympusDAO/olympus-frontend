import axios from "axios";
import { setAll } from "../helpers";
import { createSlice, createSelector, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
};

export const getFraxData = createAsyncThunk("app/getFraxData", async () => {
  const resp = await axios.get("https://api.frax.finance/combineddata/");
  return {
    data: resp.data && resp.data.liq_staking && resp.data.liq_staking["Uniswap FRAX/OHM"],
  };
});

const fraxSlice = createSlice({
  name: "fraxData",
  initialState,
  extraReducers: builder => {
    builder
      .addCase(getFraxData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getFraxData.fulfilled, (state, action) => {
        setAll(state, action.payload.data);
        state.loading = false;
      })
      .addCase(getFraxData.rejected, (state, { error }) => {
        state.status = false;
        console.log(error);
      });
  },
});

export default fraxSlice.reducer;

const baseInfo = state => state.fraxData;

export const getFraxState = createSelector(baseInfo, app => app);
