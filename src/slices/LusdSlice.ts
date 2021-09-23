import { ethers } from "ethers";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";

import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { setAll } from "../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { NetworkID } from "src/lib/Bond";

const pickleApi = "https://api.pickle.finance/prod";

// from pickle: https://github.com/pickle-finance/pickle-ui/blob/4aa4955ec65d75cb8ab13d6237c533bf0de2d441/util/api.js#L90
const getPoolData = async () => {
  const resp = await fetch(`${pickleApi}/protocol/pools`).then(response => response.json());
  return resp;
};

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
  async ({ provider, address, networkID }: IGetBalances) => {
    // TODO (appleseed-lusd): use correct address, change out abi
    const contractAddress = addresses[networkID].PICKLE_OHM_LUSD_ADDRESS as string;
    const pickleOhmLusdContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, ierc20Abi, provider);
    const pickleOhmLusdBalance = await pickleOhmLusdContract.balanceOf(address);

    // PICKLE API DATA
    const resp = await getPoolData();
    var poolInfo = resp.filter((pool: IPoolInfo) => {
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
  },
);

/**
 * interface for object returned from getLusdData + loading status
 */
export interface IUserLusdDetails {
  apy: number;
  tvl: number;
  balance: string; //Payout formatted in gwei.
  loading: boolean;
}

const initialState: IUserLusdDetails = {
  loading: false,
  apy: 0,
  tvl: 0,
  balance: "",
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
