import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> formatting
=======
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
>>>>>>> dashboard tiles use graph queries from app state
import axios from "axios";
import { contractForReserve, addressForAsset } from "../helpers";
import { BONDS } from "../constants";
import { abi as BondOhmDaiCalcContract } from "../abi/bonds/OhmDaiCalcContract.json";
import apollo from "../lib/apolloClient.js";
<<<<<<< HEAD
=======
import axios from 'axios';
import { contractForReserve, addressForAsset } from "../helpers";
import { BONDS } from "../constants";
import { abi as BondOhmDaiCalcContract } from "../abi/bonds/OhmDaiCalcContract.json";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
const APIRUL = "https://api.thegraph.com/subgraphs/id/QmPkygj4BhudwpNWREYCz3uNkHXDRL1XKCt4SJYwMDcSoS";

const protocolMetricsQuery = `
    query {
      _meta {
        block {
          number
        }
      }
      protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
        timestamp
        circulatingSupply
        totalSupply
        ohmPrice
        marketCap
        totalValueLocked
      }
    }
    `;
<<<<<<< HEAD
=======

const client = new ApolloClient({
  uri: APIRUL,
  cache: new InMemoryCache()
});
    
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph

const client = new ApolloClient({
  uri: APIRUL,
  cache: new InMemoryCache()
});
    
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
>>>>>>> dashboard tiles use graph queries from app state

=======
>>>>>>> formatting
export const fetchAppSuccess = payload => ({
  type: Actions.FETCH_APP_SUCCESS,
  payload,
});

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> formatting
=======
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
>>>>>>> dashboard tiles use graph queries from app state
export const loadAppDetails =
  ({ networkID, provider }) =>
  async dispatch => {
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
          totalSupply
          ohmPrice
          marketCap
          totalValueLocked
        }
      }
    `;

<<<<<<< HEAD
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
      return dispatch(
        fetchAppSuccess({
          stakingTVL,
          marketPrice,
          marketCap,
          circSupply,
          totalSupply,
        }),
      );
    }
=======

export const loadAppDetails =
  ({ networkID, provider }) =>
  async dispatch => {

    const graphData = await client.query({
      query: gql(protocolMetricsQuery)
    })
    .then(data => {
      console.log('subgraph data: ', data);
      return data;
    })
    .catch(err => console.log('qraph ql error: ', err));

=======
    const graphData = await apollo(protocolMetricsQuery);
>>>>>>> cleaned up topbar, made hamburger left anchored, removed font awesome for custom icons
    const stakingTVL = parseFloat(graphData.data.protocolMetrics[0].totalValueLocked);
    const marketPrice = parseFloat(graphData.data.protocolMetrics[0].ohmPrice);
    const marketCap = parseFloat(graphData.data.protocolMetrics[0].marketCap);
    const circSupply = parseFloat(graphData.data.protocolMetrics[0].ohmCirculatingSupply);
    const totalSupply = parseFloat(graphData.data.protocolMetrics[0].totalSupply);
    // const currentBlock = parseFloat(graphData.data._meta.block.number);

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return dispatch(
        fetchAppSuccess({
          stakingTVL,
          marketPrice,
          marketCap,
          circSupply,
          totalSupply,
        }),
      );
    }

<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> cleaned up topbar, made hamburger left anchored, removed font awesome for custom icons
    const currentBlock = await provider.getBlockNumber();
=======
    const currentBlock = await provider.getBlockNumber(); 
>>>>>>> dashboard tiles use graph queries from app state
=======
=======
=======

export const loadAppDetails =
  ({ networkID, provider }) =>
  async dispatch => {

    const graphData = await client.query({
      query: gql(protocolMetricsQuery)
    })
    .then(data => {
      console.log('subgraph data: ', data);
      return data;
    })
    .catch(err => console.log('qraph ql error: ', err));

    const stakingTVL = graphData.data.protocolMetrics[0].totalValueLocked;
    const marketPrice = graphData.data.protocolMetrics[0].ohmPrice;
    const circSupply = parseFloat(graphData.data.protocolMetrics[0].circulatingSupply);
    const totalSupply = parseFloat(graphData.data.protocolMetrics[0].totalSupply);

>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
>>>>>>> dashboard tiles use graph queries from app state
    const currentBlock = await provider.getBlockNumber();
>>>>>>> formatting
    const stakingContract = new ethers.Contract(addresses[networkID].STAKING_ADDRESS, OlympusStakingv2, provider);
    const oldStakingContract = new ethers.Contract(addresses[networkID].OLD_STAKING_ADDRESS, OlympusStaking, provider);
    const sohmMainContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, sOHMv2, provider);
    const sohmOldContract = new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS, sOHM, provider);
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> formatting
    const bondCalculator = new ethers.Contract(
      addresses[networkID].BONDS.OHM_DAI_CALC,
      BondOhmDaiCalcContract,
      provider,
    );
<<<<<<< HEAD
=======
    const bondCalculator = new ethers.Contract(addresses[networkID].BONDS.OHM_DAI_CALC, BondOhmDaiCalcContract, provider);
>>>>>>> dashboard tiles use graph queries from app state
=======
>>>>>>> formatting

    // Calculate Treasury Balance
    let token = contractForReserve({ bond: BONDS.dai, networkID, provider });
    let daiAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);

    token = contractForReserve({ bond: BONDS.frax, networkID, provider });
    let fraxAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);

    token = contractForReserve({ bond: BONDS.ohm_dai, networkID, provider });
    let ohmDaiAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    let valuation = await bondCalculator.valuation(addressForAsset({ bond: BONDS.ohm_dai, networkID }), ohmDaiAmount);
    let markdown = await bondCalculator.markdown(addressForAsset({ bond: BONDS.ohm_dai, networkID }));
    let ohmDaiUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));

    token = contractForReserve({ bond: BONDS.ohm_frax, networkID, provider });
    let ohmFraxAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
    valuation = await bondCalculator.valuation(addressForAsset({ bond: BONDS.ohm_frax, networkID }), ohmFraxAmount);
    markdown = await bondCalculator.markdown(addressForAsset({ bond: BONDS.ohm_frax, networkID }));
    let ohmFraxUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));

    const treasuryBalance = daiAmount / Math.pow(10, 18) + fraxAmount / Math.pow(10, 18) + ohmDaiUSD + ohmFraxUSD;
=======
    valuation    = await bondCalculator.valuation(addressForAsset({bond: BONDS.ohm_frax, networkID}), ohmFraxAmount);
    markdown     = await bondCalculator.markdown(addressForAsset({bond: BONDS.ohm_frax, networkID}));
    let ohmFraxUSD   = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18))
=======
=======
>>>>>>> dashboard tiles use graph queries from app state
    valuation = await bondCalculator.valuation(addressForAsset({ bond: BONDS.ohm_frax, networkID }), ohmFraxAmount);
    markdown = await bondCalculator.markdown(addressForAsset({ bond: BONDS.ohm_frax, networkID }));
    let ohmFraxUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));
>>>>>>> formatting

    const treasuryBalance = daiAmount / Math.pow(10, 18) + ohmDaiUSD + ohmFraxUSD;

    // Calculate TVL staked
    // let ohmInNewStaking = await ohmContract.balanceOf(addresses[networkID].STAKING_ADDRESS);
    // let ohmInOldStaking = await ohmContract.balanceOf(addresses[networkID].OLD_STAKING_ADDRESS);
    // const ohmInTreasury = ohmInNewStaking / Math.pow(10, 9) + ohmInOldStaking / Math.pow(10, 9);

    // Calculate TVL staked
    // let ohmInTreasury = await ohmContract.balanceOf(addresses[networkID].STAKING_ADDRESS);
    // ohmInTreasury = ohmInTreasury / Math.pow(10, 9);

    // Get market price of OHM
    // const pairContract = new ethers.Contract(addresses[networkID].LP_ADDRESS, PairContract, provider);
    // const reserves = await pairContract.getReserves();
    // const marketPrice = (reserves[1] / reserves[0]) / Math.pow(10, 9);
    // const stakingTVL = marketPrice * ohmInTreasury;
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph

    // Calculating staking
    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    const circ = await sohmMainContract.circulatingSupply();
=======
    const circ =  await sohmMainContract.circulatingSupply();
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
    const circ = await sohmMainContract.circulatingSupply();
>>>>>>> formatting
=======
    const circ = await sohmMainContract.circulatingSupply();
=======
    const circ =  await sohmMainContract.circulatingSupply();
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
    const circ = await sohmMainContract.circulatingSupply();
>>>>>>> dashboard tiles use graph queries from app state
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

    console.log("graphData", graphData);

    return dispatch(
      fetchAppSuccess({
        currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
        currentBlock,
        fiveDayRate,
        treasuryBalance,
        stakingAPY,
        stakingTVL,
        oldStakingAPY,
        stakingRebase,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        marketCap,
=======
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
        marketCap,
>>>>>>> dashboard tiles use graph queries from app state
=======
        marketCap,
=======
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
        marketCap,
>>>>>>> dashboard tiles use graph queries from app state
        marketPrice,
        circSupply,
        totalSupply,
      }),
    );
  };

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> formatting
=======
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
>>>>>>> dashboard tiles use graph queries from app state
export const getFraxData = () => async dispatch => {
  const resp = await axios.get("https://api.frax.finance/combineddata/");
  return dispatch({
    type: Actions.FETCH_FRAX_SUCCESS,
    payload: resp.data && resp.data.liq_staking && resp.data.liq_staking["Uniswap FRAX/OHM"],
  });
};
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
export const getFraxData = () =>
  async dispatch => {
    const resp = await axios.get('https://api.frax.finance/combineddata/');
    return dispatch({
      type: Actions.FETCH_FRAX_SUCCESS,
      payload: resp.data && resp.data.liq_staking && resp.data.liq_staking["Uniswap FRAX/OHM"]
    })
  };
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
<<<<<<< HEAD
=======
>>>>>>> formatting
=======
>>>>>>> apollo installed and implemented for basic app state. still getting issues with circ and total supply from the graph
=======
>>>>>>> dashboard tiles use graph queries from app state
