import { ethers } from "ethers";
import axios from "axios";
import { addresses, Actions, BONDS } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as PairContract } from "../abi/PairContract.json";
import { abi as CirculatingSupplyContract } from "../abi/CirculatingSupplyContract.json";
import { contractForReserve, addressForAsset } from "../helpers";
import { abi as BondOhmDaiCalcContract } from "../abi/bonds/OhmDaiCalcContract.json";

export const fetchAppSuccess = payload => ({
  type: Actions.FETCH_APP_SUCCESS,
  payload,
});

export const loadAppDetails =
  ({ networkID, provider }) =>
  async dispatch => {
    const currentBlock = await provider.getBlockNumber();

    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS, ierc20Abi, provider);
    const stakingContract = new ethers.Contract(addresses[networkID].STAKING_ADDRESS, OlympusStakingv2, provider);
    const oldStakingContract = new ethers.Contract(addresses[networkID].OLD_STAKING_ADDRESS, OlympusStaking, provider);
    const sohmMainContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, sOHMv2, provider);
    const sohmOldContract = new ethers.Contract(addresses[networkID].OLD_SOHM_ADDRESS, sOHM, provider);
    const bondCalculator = new ethers.Contract(
      addresses[networkID].BONDS.OHM_DAI_CALC,
      BondOhmDaiCalcContract,
      provider,
    );

    // Calculate Treasury Balance
    let token = contractForReserve({ bond: BONDS.dai, networkID, provider });
    const daiAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);

    token = contractForReserve({ bond: BONDS.ohm_dai, networkID, provider });
    const ohmDaiAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    let valuation = await bondCalculator.valuation(addressForAsset({ bond: BONDS.ohm_dai, networkID }), ohmDaiAmount);
    let markdown = await bondCalculator.markdown(addressForAsset({ bond: BONDS.ohm_dai, networkID }));
    const ohmDaiUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));

    token = contractForReserve({ bond: BONDS.ohm_frax, networkID, provider });
    const ohmFraxAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    valuation = await bondCalculator.valuation(addressForAsset({ bond: BONDS.ohm_frax, networkID }), ohmFraxAmount);
    markdown = await bondCalculator.markdown(addressForAsset({ bond: BONDS.ohm_frax, networkID }));
    const ohmFraxUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));

    const treasuryBalance = daiAmount / Math.pow(10, 18) + ohmDaiUSD + ohmFraxUSD;

    // Calculate TVL staked
    const ohmInNewStaking = await ohmContract.balanceOf(addresses[networkID].STAKING_ADDRESS);
    const ohmInOldStaking = await ohmContract.balanceOf(addresses[networkID].OLD_STAKING_ADDRESS);
    const ohmInTreasury = ohmInNewStaking / Math.pow(10, 9) + ohmInOldStaking / Math.pow(10, 9);

    // Calculate TVL staked
    // let ohmInTreasury = await ohmContract.balanceOf(addresses[networkID].STAKING_ADDRESS);
    // ohmInTreasury = ohmInTreasury / Math.pow(10, 9);

    // Get market price of OHM
    const pairContract = new ethers.Contract(addresses[networkID].LP_ADDRESS, PairContract, provider);
    const reserves = await pairContract.getReserves();
    const marketPrice = reserves[1] / reserves[0] / Math.pow(10, 9);

    const stakingTVL = marketPrice * ohmInTreasury;

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

    const oldStakingRebase = oldStakingReward / oldCircSupply;
    const oldStakingAPY = Math.pow(1 + oldStakingRebase, 365 * 3) - 1;

    // Calculate index
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
        // currentBlock, -> its already declared on line 111 - double declaration
      }),
    );
  };

export const getFraxData = () => async dispatch => {
  const resp = await axios.get("https://api.frax.finance/combineddata/");
  return dispatch({
    type: Actions.FETCH_FRAX_SUCCESS,
    payload: resp.data && resp.data.liq_staking && resp.data.liq_staking["Uniswap FRAX/OHM"],
  });
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
