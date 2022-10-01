import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { NetworkId } from "src/constants";
import { STAKING_ADDRESSES, V1_STAKING_ADDRESSES } from "src/constants/addresses";
import { getMarketPrice, getTokenPrice, setAll } from "src/helpers";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { IBaseAsyncThunk } from "src/slices/interfaces";
import { RootState } from "src/store";
import { OlympusStaking__factory, OlympusStakingv2__factory } from "src/typechain";

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    if (networkID !== NetworkId.MAINNET) {
      provider = Providers.getStaticProvider(NetworkId.MAINNET);
      networkID = NetworkId.MAINNET;
    }

    // NOTE (appleseed): marketPrice from Graph was delayed, so get CoinGecko price
    // const marketPrice = parseFloat(graphData.data.protocolMetrics[0].ohmPrice);
    let marketPrice;
    try {
      const originalPromiseResult = await dispatch(
        loadMarketPrice({ networkID: networkID, provider: provider }),
      ).unwrap();
      marketPrice = originalPromiseResult?.marketPrice;
    } catch (rejectedValueOrSerializedError) {
      // handle error here
      console.error("Returned a null response from dispatch(loadMarketPrice)");
      return;
    }

    // const currentBlock = parseFloat(graphData.data._meta.block.number);

    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return {
        marketPrice,
      } as IAppData;
    }
    const currentBlock = await provider.getBlockNumber();

    const stakingContract = OlympusStakingv2__factory.connect(
      STAKING_ADDRESSES[networkID as keyof typeof STAKING_ADDRESSES],
      provider,
    );
    const stakingContractV1 = OlympusStaking__factory.connect(
      V1_STAKING_ADDRESSES[networkID as keyof typeof STAKING_ADDRESSES],
      provider,
    );

    // Current index
    const currentIndex = await stakingContract.index();
    const currentIndexV1 = await stakingContractV1.index();
    return {
      currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
      currentIndexV1: ethers.utils.formatUnits(currentIndexV1, "gwei"),
      currentBlock,
      marketPrice,
    } as IAppData;
  },
);

/**
 * - fetches the OHM price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from ohm-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({}: IBaseAsyncThunk) => {
  let marketPrice: number;
  try {
    // only get marketPrice from eth mainnet
    marketPrice = await getMarketPrice();
  } catch (e) {
    marketPrice = await getTokenPrice("olympus");
  }
  return { marketPrice };
});

export interface IAppData {
  readonly currentIndex?: string;
  readonly currentIndexV1?: string;
  readonly currentBlock?: number;
  readonly loading: boolean;
  readonly loadingMarketPrice: boolean;
  readonly marketPrice?: number;
  readonly stakingTVL?: number;
  readonly totalSupply?: number;
  readonly treasuryBalance?: number;
  readonly treasuryMarketValue?: number;
  readonly secondsToEpoch?: number;
}

const initialState: IAppData = {
  loading: false,
  loadingMarketPrice: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketPrice.pending, state => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
