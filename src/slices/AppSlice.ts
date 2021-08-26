import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import axios from "axios";
import { contractForReserve, addressForAsset, contractForBond, setAll } from "../helpers";
import { BONDS } from "../constants";
import { abi as BondCalcContract } from "../abi/BondCalcContract.json";
import apollo from "../lib/apolloClient.js";
import { createSlice, createSelector, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
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
  const bondCalculator = new ethers.Contract(addresses[networkID].BONDINGCALC_ADDRESS, BondCalcContract, provider);

  // Get ETH price
  const ethBondContract = contractForBond({ bond: BONDS.eth, networkID, provider });
  let ethPrice = await ethBondContract.assetPrice();
  ethPrice = ethPrice / Math.pow(10, 18);

  // Calculate Treasury Balance
  // TODO: PLS DRY and modularize.
  let token = contractForReserve({ bond: BONDS.dai, networkID, provider });
  let daiAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);

  token = contractForReserve({ bond: BONDS.frax, networkID, provider });
  let fraxAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);

  token = contractForReserve({ bond: BONDS.eth, networkID, provider });
  let ethAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);

  token = contractForReserve({ bond: BONDS.ohm_dai, networkID, provider });
  let ohmDaiAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
  let valuation = await bondCalculator.valuation(addressForAsset({ bond: BONDS.ohm_dai, networkID }), ohmDaiAmount);
  let markdown = await bondCalculator.markdown(addressForAsset({ bond: BONDS.ohm_dai, networkID }));
  let ohmDaiUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));

  token = contractForReserve({ bond: BONDS.ohm_frax, networkID, provider });
  let ohmFraxAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
  valuation = await bondCalculator.valuation(addressForAsset({ bond: BONDS.ohm_frax, networkID }), ohmFraxAmount);
  markdown = await bondCalculator.markdown(addressForAsset({ bond: BONDS.ohm_frax, networkID }));
  let ohmFraxUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));

  const treasuryBalance =
    daiAmount / Math.pow(10, 18) +
    fraxAmount / Math.pow(10, 18) +
    (ethAmount / Math.pow(10, 18)) * ethPrice +
    ohmDaiUSD +
    ohmFraxUSD;

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

export const getFraxData = createAsyncThunk("app/getFraxData", async () => {
  const resp = await axios.get("https://api.frax.finance/combineddata/");
  return {
    type: Actions.FETCH_FRAX_SUCCESS,
    payload: resp.data && resp.data.liq_staking && resp.data.liq_staking["Uniswap FRAX/OHM"],
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
        state.status = "loading";
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.status = "idle";
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.status = "idle";
        console.log(error);
      });
  },
});

const baseInfo = state => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
