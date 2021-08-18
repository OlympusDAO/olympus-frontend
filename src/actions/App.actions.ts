import { ethers } from "ethers";
import { addresses, Actions, Nested } from "../constants";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as BondCalcContract } from "../abi/BondCalcContract.json";
import axios from "axios";
import { contractForReserve, addressForAsset, toNum, contractForBond } from "../helpers";
import { BONDS } from "../constants";
import apollo from "../lib/apolloClient";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { Dispatch } from "redux";
import { OlympusBondingCalculator, OlympusStaking as OlympusStakingType, SOlympus } from "../typechain";

interface IAppDetails {
  readonly circSupply: number;
  readonly currentIndex?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly marketCap: number;
  readonly marketPrice: number;
  readonly oldStakingAPY?: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL: number;
  readonly totalSupply: number;
  readonly treasuryBalance?: number;
}

interface IBalance {
  readonly balances: { ohm: string; sohm: string };
}

export const fetchAppInProgress = () => ({
  type: Actions.FETCH_APP_INPROGRESS,
  payload: { loading: true },
});

export const fetchAppSuccess = (payload: IAppDetails) => ({
  type: Actions.FETCH_APP_SUCCESS,
  payload: { ...payload, loading: false },
});

export const fetchBalances = (payload: IBalance) => ({
  type: Actions.FETCH_BALANCES,
  payload,
});

export const getBalances =
  ({ address, networkID, provider }: { address: string; networkID: number; provider: StaticJsonRpcProvider }) =>
  async (dispatch: Dispatch) => {
    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20Abi, provider);
    const ohmBalance = await ohmContract.balanceOf(address);
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, ierc20Abi, provider);
    const sohmBalance = await sohmContract.balanceOf(address);

    return dispatch(
      fetchBalances({
        balances: {
          ohm: ethers.utils.formatUnits(ohmBalance, "gwei"),
          sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        },
      }),
    );
  };

export const loadAppDetails =
  ({ networkID, provider }: { networkID: number; provider: StaticJsonRpcProvider }) =>
  async (dispatch: Dispatch) => {
    dispatch(fetchAppInProgress());
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
    const currentBlock = await provider.getBlockNumber();
    const stakingContract = new ethers.Contract(
      addresses[networkID].STAKING_ADDRESS as string,
      OlympusStakingv2,
      provider,
    ) as OlympusStakingType;
    const oldStakingContract = new ethers.Contract(
      addresses[networkID].OLD_STAKING_ADDRESS as string,
      OlympusStaking,
      provider,
    ); // TS-REFACTOR-NOTE: need types for old staking contract
    const sohmMainContract = new ethers.Contract(
      addresses[networkID].SOHM_ADDRESS as string,
      sOHMv2,
      provider,
    ) as SOlympus;
    const sohmOldContract = new ethers.Contract(
      addresses[networkID].OLD_SOHM_ADDRESS as string,
      sOHM,
      provider,
    ) as SOlympus;
    const bondCalculator = new ethers.Contract(
      addresses[networkID].BONDINGCALC_ADDRESS as string,
      BondCalcContract,
      provider,
    ) as OlympusBondingCalculator;

    // Get ETH price
    const ethBondContract = contractForBond({ bond: BONDS.eth, networkID, provider });
    let ethPrice = await (ethBondContract as ethers.Contract).assetPrice();
    ethPrice = ethPrice / Math.pow(10, 18);

    // Calculate Treasury Balance
    // TODO: PLS DRY and modularize.
    let token = contractForReserve({ bond: BONDS.dai, networkID, provider });
    let daiAmount = toNum(await token.balanceOf(addresses[networkID].TREASURY_ADDRESS as string));

    token = contractForReserve({ bond: BONDS.frax, networkID, provider });
    let fraxAmount = toNum(await token.balanceOf(addresses[networkID].TREASURY_ADDRESS as string));

    token = contractForReserve({ bond: BONDS.eth, networkID, provider });
    let ethAmount = toNum(await token.balanceOf(addresses[networkID].TREASURY_ADDRESS as string));

    token = contractForReserve({ bond: BONDS.ohm_dai, networkID, provider });
    let ohmDaiAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS as string);
    let valuation = toNum(
      await bondCalculator.valuation(addressForAsset({ bond: BONDS.ohm_dai, networkID }), ohmDaiAmount),
    );
    let markdown = toNum(await bondCalculator.markdown(addressForAsset({ bond: BONDS.ohm_dai, networkID })));
    let ohmDaiUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));

    token = contractForReserve({ bond: BONDS.ohm_frax, networkID, provider });
    let ohmFraxAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS as string);
    valuation = toNum(
      await bondCalculator.valuation(addressForAsset({ bond: BONDS.ohm_frax, networkID }), ohmFraxAmount),
    );
    markdown = toNum(await bondCalculator.markdown(addressForAsset({ bond: BONDS.ohm_frax, networkID })));
    let ohmFraxUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));

    const treasuryBalance =
      daiAmount / Math.pow(10, 18) +
      fraxAmount / Math.pow(10, 18) +
      (ethAmount / Math.pow(10, 18)) * ethPrice +
      ohmDaiUSD +
      ohmFraxUSD;

    // Calculating staking
    const epoch = await stakingContract.epoch();
    const stakingReward = toNum(epoch.distribute);
    const circ = toNum(await sohmMainContract.circulatingSupply());
    const stakingRebase = stakingReward / circ;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

    // TODO: remove this legacy shit
    const oldStakingReward = await oldStakingContract.ohmToDistributeNextEpoch();
    const oldCircSupply = toNum(await sohmOldContract.circulatingSupply());

    const oldStakingRebase = oldStakingReward / oldCircSupply;
    const oldStakingAPY = Math.pow(1 + oldStakingRebase, 365 * 3) - 1;

    // Current index
    const currentIndex = await stakingContract.index();

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
        marketCap,
        marketPrice,
        circSupply,
        totalSupply,
      }),
    );
  };

export const getFraxData = () => async (dispatch: Dispatch) => {
  const resp = await axios.get("https://api.frax.finance/combineddata/");
  return dispatch({
    type: Actions.FETCH_FRAX_SUCCESS,
    payload: resp.data && resp.data.liq_staking && resp.data.liq_staking["Uniswap FRAX/OHM"],
  });
};
