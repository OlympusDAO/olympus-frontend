import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as PrizePool } from "../abi/33-together/PrizePoolAbi2.json";
import { abi as AwardPool } from "../abi/33-together/AwardAbi2.json";
import axios from "axios";
import { setAll } from "../helpers";
import apollo from "../lib/apolloClient.js";
import { createSlice, createSelector, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import allBonds from "src/helpers/AllBonds";

const initialState = {
  loading: false,
};

export const loadAppDetails = createAsyncThunk("app/loadAppDetails", async ({ networkID, provider }) => {
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
      nextEpochRebase
      nextDistributedOhm
    }
  }
`;

  const graphData = await apollo(protocolMetricsQuery);

  if (!graphData || graphData == null) {
    console.error("Returned a null response when querying TheGraph");
    return;
  }

  const stakingTVL = parseFloat(graphData.data.protocolMetrics[0].totalValueLocked);
  const marketPrice = parseFloat(graphData.data.protocolMetrics[0].ohmPrice);
  const marketCap = parseFloat(graphData.data.protocolMetrics[0].marketCap);
  const circSupply = parseFloat(graphData.data.protocolMetrics[0].ohmCirculatingSupply);
  const totalSupply = parseFloat(graphData.data.protocolMetrics[0].totalSupply);
  // const currentBlock = parseFloat(graphData.data._meta.block.number);

  if (!provider) {
    console.error("failed to connect to provider, please connect your wallet");
    return {
      stakingTVL,
      marketPrice,
      marketCap,
      circSupply,
      totalSupply,
    };
  }
  const currentBlock = await provider.getBlockNumber();

  const stakingContract = new ethers.Contract(addresses[networkID].STAKING_ADDRESS, OlympusStakingv2, provider);
  const oldStakingContract = new ethers.Contract(addresses[networkID].OLD_STAKING_ADDRESS, OlympusStaking, provider);
  const sohmMainContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, sOHMv2, provider);
  const sohmOldContract = new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS, sOHM, provider);

  // Calculate Treasury Balance
  const tokenBalPromises = allBonds.map(async bond => await bond.getTreasuryBalance(networkID, provider));
  const tokenBalances = await Promise.all(tokenBalPromises);
  const treasuryBalance = tokenBalances.reduce((treasuryBal, tokenBalance) => treasuryBal + tokenBalance, 0);

  // Calculating staking
  const epoch = await stakingContract.epoch();
  const stakingReward = epoch.distribute;
  const circ = await sohmMainContract.circulatingSupply();
  const stakingRebase = stakingReward / circ;
  const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
  const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

  // TODO: remove this legacy shit
  const oldStakingReward = await oldStakingContract.ohmToDistributeNextEpoch();
  const oldCircSupply = await sohmOldContract.circulatingSupply();

  const oldStakingRebase = oldStakingReward / oldCircSupply;
  const oldStakingAPY = Math.pow(1 + oldStakingRebase, 365 * 3) - 1;

  // Current index
  const currentIndex = await stakingContract.index();

  return {
    currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
    currentBlock,
    fiveDayRate,
    treasuryBalance,
    stakingAPY,
    stakingTVL,
    oldStakingAPY,
    stakingRebase,
    marketCap,
    marketPrice,
    circSupply,
    totalSupply,
  };
});

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
      .addCase(loadAppDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.status = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = state => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
