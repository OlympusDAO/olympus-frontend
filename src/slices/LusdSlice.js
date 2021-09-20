import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { setAll } from "../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";

const pickleApi = "https://api.pickle.finance/prod";

// from pickle: https://github.com/pickle-finance/pickle-ui/blob/4aa4955ec65d75cb8ab13d6237c533bf0de2d441/util/api.js#L90
const getPoolData = async () => {
  const resp = await fetch(`${pickleApi}/protocol/pools`).then(response => response.json());
  return resp;
};

export const getLusdData = createAsyncThunk("app/getLusdData", async ({ provider, address, networkID }) => {
  // TODO (appleseed-lusd): use correct address, change out abi
  const contractAddress = addresses[networkID].PICKLE_OHM_LUSD_ADDRESS;
  const pickleOhmLusdContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, ierc20Abi, provider);
  const pickleOhmLusdBalance = await pickleOhmLusdContract.balanceOf(address);

  // PICKLE API DATA
  const resp = await getPoolData();
  var poolInfo = resp.filter(pool => {
    return pool.tokenAddress.toLowerCase() == contractAddress.toLowerCase();
  });

  const tvlUSD = poolInfo[0]?.liquidity_locked;
  const jarAPY = poolInfo[0]?.apy;

  // NOTE (appleseed-lusd): for reference:
  // Pickle also calcs APY another way:
  // // from pickle https://github.com/pickle-finance/pickle-ui/blob/3074c751cbaf83bae88ada1c63bf8a4a3eeb9860/containers/Farms/useJarFarmApy.ts
  // // https://github.com/pickle-finance/pickle-ui/blob/4aa4955ec65d75cb8ab13d6237c533bf0de2d441/containers/Jars/useJarsWithTVL.ts#L31

  return {
    apy: jarAPY,
    tvl: tvlUSD,
    balance: ethers.utils.formatUnits(pickleOhmLusdBalance, "gwei"),
  };
});

const initialState = { loading: false };

const lusdSlice = createSlice({
  name: "lusdData",
  initialState,
  extraReducers: builder => {
    builder
      .addCase(getLusdData.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getLusdData.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getLusdData.rejected, (state, { error }) => {
        state.status = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

export default lusdSlice.reducer;

const baseInfo = state => state.lusdData;

export const getLusdState = createSelector(baseInfo, app => app);
