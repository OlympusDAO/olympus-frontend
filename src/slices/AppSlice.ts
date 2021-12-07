import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as OlympusStakingv2ABI } from "../abi/OlympusStakingv2.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { setAll, getTokenPrice, getMarketPrice } from "../helpers";
import { NodeHelper } from "src/helpers/NodeHelper";
import apollo from "../lib/apolloClient";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";
import { OlympusStakingv2, SOhmv2 } from "../typechain";

interface IProtocolMetrics {
  readonly timestamp: string;
  readonly ohmCirculatingSupply: string;
  readonly sOhmCirculatingSupply: string;
  readonly totalSupply: string;
  readonly ohmPrice: string;
  readonly marketCap: string;
  readonly totalValueLocked: string;
  readonly treasuryMarketValue: string;
  readonly nextEpochRebase: string;
  readonly nextDistributedOhm: string;
}

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    const protocolMetricsQuery = `
      query {
        _meta {
          block {
            number
          }
        }
        protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
          timestamp
          ohmCirculatingSupply
          sOhmCirculatingSupply
          totalSupply
          ohmPrice
          marketCap
          totalValueLocked
          treasuryMarketValue
          nextEpochRebase
          nextDistributedOhm
        }
      }
    `;

    if (networkID !== 1) {
      provider = NodeHelper.getMainnetStaticProvider();
      networkID = 1;
    }
    const graphData = await apollo<{ protocolMetrics: IProtocolMetrics[] }>(protocolMetricsQuery);

    if (!graphData || graphData == null) {
      console.error("Returned a null response when querying TheGraph");
      return;
    }

    const stakingTVL = parseFloat(graphData.data.protocolMetrics[0].totalValueLocked);
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

    const marketCap = parseFloat(graphData.data.protocolMetrics[0].marketCap);
    const circSupply = parseFloat(graphData.data.protocolMetrics[0].ohmCirculatingSupply);
    const totalSupply = parseFloat(graphData.data.protocolMetrics[0].totalSupply);
    const treasuryMarketValue = parseFloat(graphData.data.protocolMetrics[0].treasuryMarketValue);
    // const currentBlock = parseFloat(graphData.data._meta.block.number);

    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return {
        stakingTVL,
        marketPrice,
        marketCap,
        circSupply,
        totalSupply,
        treasuryMarketValue,
      } as IAppData;
    }
    const currentBlock = await provider.getBlockNumber();

    const stakingContract = new ethers.Contract(
      addresses[networkID].STAKING_ADDRESS as string,
      OlympusStakingv2ABI,
      provider,
    ) as OlympusStakingv2;

    const sohmMainContract = new ethers.Contract(
      addresses[networkID].SOHM_ADDRESS as string,
      sOHMv2,
      provider,
    ) as SOhmv2;

    // Calculating staking
    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute;
    const circ = await sohmMainContract.circulatingSupply();
    const stakingRebase = Number(stakingReward.toString()) / Number(circ.toString());
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

    // Current index
    const currentIndex = await stakingContract.index();
    return {
      currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
      currentBlock,
      fiveDayRate,
      stakingAPY,
      stakingTVL,
      stakingRebase,
      marketCap,
      marketPrice,
      circSupply,
      totalSupply,
      treasuryMarketValue,
    } as IAppData;
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
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
    }
    return { marketPrice };
  },
);

/**
 * - fetches the OHM price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from ohm-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
  let marketPrice: number;
  try {
    // only get marketPrice from eth mainnet
    marketPrice = await getMarketPrice({ networkID, provider });
    // let mainnetProvider = (marketPrice = await getMarketPrice({ 1: NetworkID, provider }));
    marketPrice = marketPrice / Math.pow(10, 9);
  } catch (e) {
    marketPrice = await getTokenPrice("olympus");
  }
  return { marketPrice };
});

interface IAppData {
  readonly circSupply?: number;
  readonly currentIndex?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly loading: boolean;
  readonly loadingMarketPrice: boolean;
  readonly marketCap?: number;
  readonly marketPrice?: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL?: number;
  readonly totalSupply?: number;
  readonly treasuryBalance?: number;
  readonly treasuryMarketValue?: number;
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
      .addCase(loadMarketPrice.pending, (state, action) => {
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
