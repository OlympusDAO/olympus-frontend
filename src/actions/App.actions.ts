import { ethers } from "ethers";
import { addresses, Actions, Nested } from "../constants";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import axios from "axios";
import { contractForReserve, addressForAsset } from "../helpers";
import { BONDS } from "../constants";
import { abi as BondOhmDaiCalcContract } from "../abi/bonds/OhmDaiCalcContract.json";
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

export const fetchAppSuccess = (payload: IAppDetails) => ({
  type: Actions.FETCH_APP_SUCCESS,
  payload,
});

export const loadAppDetails =
  ({ networkID, provider }: { networkID: number; provider: StaticJsonRpcProvider }) =>
  async (dispatch: Dispatch) => {
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
          totalOHMstaked
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
    ); // TS-REFACTOR-TODO: need to get types for old staking contract
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
      (addresses[networkID].BONDS as Nested).OHM_DAI_CALC,
      BondOhmDaiCalcContract,
      provider,
    ) as OlympusBondingCalculator;

    // Calculate Treasury Balance
    // TS-REFACTOR-TODO: token can possibly be null, we aren't checking this possibility
    // currently just casting it as definitely not null to maintain the same logic

    // TS-REFACTOR-TODO: addressForAsset can return null, we aren't checking this. casting as not null.
    let token = contractForReserve({ bond: BONDS.dai, networkID, provider })!;

    const treasuryAddress = addresses[networkID].TREASURY_ADDRESS as string;
    let daiAmount = (await token.balanceOf(treasuryAddress)) as unknown as number;

    token = contractForReserve({ bond: BONDS.frax, networkID, provider })!;
    let fraxAmount = (await token.balanceOf(treasuryAddress)) as unknown as number;

    token = contractForReserve({ bond: BONDS.ohm_dai, networkID, provider })!;
    let ohmDaiAmount = await token.balanceOf(treasuryAddress);
    let valuation = (await bondCalculator.valuation(
      addressForAsset({ bond: BONDS.ohm_dai, networkID })!,
      ohmDaiAmount,
    )) as unknown as number;
    let markdown = (await bondCalculator.markdown(
      addressForAsset({ bond: BONDS.ohm_dai, networkID })!,
    )) as unknown as number;
    let ohmDaiUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));

    token = contractForReserve({ bond: BONDS.ohm_frax, networkID, provider })!;
    let ohmFraxAmount = await token.balanceOf(treasuryAddress);
    valuation = (await bondCalculator.valuation(
      addressForAsset({ bond: BONDS.ohm_frax, networkID })!,
      ohmFraxAmount,
    )) as unknown as number;
    markdown = (await bondCalculator.markdown(
      addressForAsset({ bond: BONDS.ohm_frax, networkID })!,
    )) as unknown as number;
    let ohmFraxUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));

    const treasuryBalance = daiAmount / Math.pow(10, 18) + fraxAmount / Math.pow(10, 18) + ohmDaiUSD + ohmFraxUSD;

    // TS-REFACTOR-TODO: we are doing / with BigNumber and expecting it to be of type number
    // Calculating staking
    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute as unknown as number;
    const circ = (await sohmMainContract.circulatingSupply()) as unknown as number;
    const stakingRebase = stakingReward / circ;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

    // TODO: remove this legacy shit
    const oldStakingReward = await oldStakingContract.ohmToDistributeNextEpoch();
    const oldCircSupply = (await sohmOldContract.circulatingSupply()) as unknown as number;

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
