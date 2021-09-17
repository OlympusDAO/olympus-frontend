import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { setAll } from "../helpers";
import apollo from "../lib/apolloClient.js";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import allBonds from "src/helpers/AllBonds";
import axios from "axios";

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

  const stakingContract = new ethers.Contract(addresses[networkID].STAKING_ADDRESS, OlympusStakingv2, provider);
  const oldStakingContract = new ethers.Contract(addresses[networkID].OLD_STAKING_ADDRESS, OlympusStaking, provider);
  const sohmMainContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, sOHMv2, provider);
  const sohmOldContract = new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS, sOHM, provider);
  const graphData = await apollo(protocolMetricsQuery);

  let stakingTVL;
  let marketPrice;
  let marketCap;
  let circSupply;
  let totalSupply;

  // If we are on Ethereum, use graphData, if on Arbitrum get staking balance from the contract, everything else from CoinGecko
  if (networkID !== 42161) {
    if (!graphData || graphData == null) {
      console.error("Returned a null response when querying TheGraph");
      return;
    }

    stakingTVL = parseFloat(graphData.data.protocolMetrics[0].totalValueLocked);
    marketPrice = parseFloat(graphData.data.protocolMetrics[0].ohmPrice);
    marketCap = parseFloat(graphData.data.protocolMetrics[0].marketCap);
    circSupply = parseFloat(graphData.data.protocolMetrics[0].ohmCirculatingSupply);
    totalSupply = parseFloat(graphData.data.protocolMetrics[0].totalSupply);
    // const currentBlock = parseFloat(graphData.data._meta.block.number);
  } else {
    const stakingContractBalance = await stakingContract.contractBalance();
    await axios.get("https://api.coingecko.com/api/v3/coins/olympus").then(result => {
      marketPrice = parseFloat(result.data["market_data"]["current_price"]["usd"]);
      marketCap = parseFloat(result.data["market_data"]["market_cap"]["usd"]);
      circSupply = parseFloat(result.data["market_data"]["circulating_supply"]);
      totalSupply = parseFloat(result.data["market_data"]["total_supply"]);
      stakingTVL = ethers.utils.formatUnits(stakingContractBalance, "gwei") * marketPrice;
    });
  }

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
