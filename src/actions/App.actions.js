import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OHMPreSale } from "../abi/OHMPreSale.json";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as MigrateToOHM } from "../abi/MigrateToOHM.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as LPStaking } from "../abi/LPStaking.json";
import { abi as DistributorContract } from "../abi/DistributorContract.json";
import { abi as BondContract } from "../abi/BondContract.json";
import { abi as DaiBondContract } from "../abi/DaiBondContract.json";
import { abi as PairContract } from "../abi/PairContract.json";
import { abi as CirculatingSupplyContract } from "../abi/CirculatingSupplyContract.json";
import axios from 'axios';
import { contractForReserve } from "../helpers";
import { BONDS } from "../constants";
import { abi as BondOhmDaiCalcContract } from "../abi/bonds/OhmDaiCalcContract.json";

const parseEther = ethers.utils.parseEther;

export const fetchAppSuccess = payload => ({
  type: Actions.FETCH_APP_SUCCESS,
  payload,
});

async function calculateAPY(sohmContract, stakingReward) {
  const circSupply = await sohmContract.circulatingSupply();

  const stakingRebase = stakingReward / circSupply;
  const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

  return stakingAPY;
}

export const loadAppDetails =
  ({ networkID, provider }) =>
  async dispatch => {
    const currentBlock = await provider.getBlockNumber();

    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS, ierc20Abi, provider);
    const stakingContract = new ethers.Contract(addresses[networkID].STAKING_ADDRESS, OlympusStakingv2, provider);
    const oldStakingContract = new ethers.Contract(addresses[networkID].OLD_STAKING_ADDRESS, OlympusStaking, provider);
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, ierc20Abi, provider);
    const sohmMainContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, sOHMv2, provider);
    const sohmOldContract = new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS, sOHM, provider);
    const bondCalculator = new ethers.Contract(addresses[networkID].BONDS.OHM_DAI_CALC, BondOhmDaiCalcContract, provider);

    // Calculate TVL
    let token = contractForReserve({ bond: BONDS.dai, networkID, provider });
    let daiAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);

    token = contractForReserve({ bond: BONDS.ohm_dai, networkID, provider });
    let ohmDaiAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    let ohmDaiUSD    = await bondCalculator.valuation(addresses[networkID].RESERVES.OHM_DAI, ohmDaiAmount);

    token = contractForReserve({ bond: BONDS.ohm_frax, networkID, provider });
    let ohmFraxAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    let ohmFraxUSD    = await bondCalculator.valuation(addresses[networkID].RESERVES.OHM_FRAX, ohmFraxAmount);

    const stakingTVL    = daiAmount / Math.pow(10, 18) + ohmDaiUSD / Math.pow(10, 9) + ohmFraxUSD / Math.pow(10, 9);


    // Calculate TVL
    let token = contractForReserve({ bond: BONDS.dai, networkID, provider });
    let daiAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);

    token = contractForReserve({ bond: BONDS.ohm_dai, networkID, provider });
    let ohmDaiAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);

    token = contractForReserve({ bond: BONDS.ohm_frax, networkID, provider });
    let ohmFraxAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);

    // TODO: We need to convert OHM-FRAX and OHM-DAI into USD value. The TreasuryContract does have valueOf function
    // that can help with that: https://etherscan.io/address/0x31f8cc382c9898b273eff4e0b7626a6987c846e8
    const stakingTVL    = daiAmount / Math.pow(10, 18) + ohmDaiAmount / Math.pow(10, 18) + ohmFraxAmount / Math.pow(10, 18);



    // Calculating staking
    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute;
    const circSupply = await sohmMainContract.circulatingSupply();

    const stakingRebase = stakingReward / circSupply;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

    // TODO: remove this legacy shit
    // Do the same for old sOhm.
    const oldStakingReward = await oldStakingContract.ohmToDistributeNextEpoch();
    const oldCircSupply = await sohmOldContract.circulatingSupply();
    console.log(oldStakingReward, oldCircSupply);

    const oldStakingRebase = oldStakingReward / oldCircSupply;
    const oldStakingAPY = Math.pow(1 + oldStakingRebase, 365 * 3) - 1;

    // Calculate index
    // const currentIndex = await sohmContract.balanceOf("0xA62Bee23497C920B94305FF68FA7b1Cd1e9FAdb2");

    const currentIndex = await stakingContract.index();

    return dispatch(
      fetchAppSuccess({
        currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
        currentBlock,
        fiveDayRate,
        stakingAPY,
        stakingTVL,
        oldStakingAPY,
        stakingRebase,
        currentBlock,
      }),
    );
  };

export const getFraxData = () =>
  async dispatch => {
    const resp = await axios.get('https://api.frax.finance/combineddata/');
    return dispatch({
      type: Actions.FETCH_FRAX_SUCCESS,
      payload: resp.data && resp.data.liq_staking && resp.data.liq_staking["Uniswap FRAX/OHM"]
    })
  };


export const getMarketPrice =
  ({ networkID, provider }) =>
  async dispatch => {
    const pairContract = new ethers.Contract(addresses[networkID].LP_ADDRESS, PairContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[1] / reserves[0];

    return dispatch(fetchAppSuccess({ marketPrice: marketPrice / Math.pow(10, 9) }));
  };

export const getTokenSupply =
  ({ networkID, provider }) =>
  async dispatch => {
    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS, ierc20Abi, provider);

    const circulatingSupplyContract = new ethers.Contract(
      addresses[networkID].CIRCULATING_SUPPLY_ADDRESS,
      CirculatingSupplyContract,
      provider,
    );

    const ohmCircSupply = await circulatingSupplyContract.OHMCirculatingSupply();
    const ohmTotalSupply = await ohmContract.totalSupply();

    return dispatch(
      fetchAppSuccess({
        circulating: ohmCircSupply,
        total: ohmTotalSupply,
      }),
    );
  };
