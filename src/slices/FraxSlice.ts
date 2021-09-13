import axios from "axios";
import { setAll } from "../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";

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
  reducers: {},
  initialState,
  extraReducers: builder => {
    builder
      .addCase(getFraxData.pending, state => {
        state.loading = true;
      })
      .addCase(getFraxData.fulfilled, (state, action) => {
        setAll(state, action.payload.data);
        state.loading = false;
      })
      .addCase(getFraxData.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default fraxSlice.reducer;

const baseInfo = (state: RootState) => state.fraxData;

export const getFraxState = createSelector(baseInfo, app => app);
