import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as OlympusStaking } from "../abi/OlympusStaking.json";
import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as sOHM } from "../abi/sOHM.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as PairContract } from "../abi/PairContract.json";
import { abi as CirculatingSupplyContract } from "../abi/CirculatingSupplyContract.json";

const parseEther = ethers.utils.parseEther;

export const fetchAppSuccess = payload => ({
  type: Actions.FETCH_APP_SUCCESS,
  payload,
});

async function calculateAPY(sohmContract, stakingReward) {
  const circSupply = await sohmContract.circulatingSupply();

  const stakingRebase = stakingReward / circSupply;
  const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3);

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

    // Calculating staking
    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute;
    const circSupply = await sohmMainContract.circulatingSupply();

    const stakingRebase = stakingReward / circSupply;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

    // console.log("New: ", stakingReward.toString(), circSupply.toString());

    // TODO: remove this legacy shit
    // Do the same for old sOhm.
    const oldStakingReward = await oldStakingContract.ohmToDistributeNextEpoch();
    const oldCircSupply = await sohmOldContract.circulatingSupply();

    const oldStakingRebase = oldStakingReward / oldCircSupply;
    const oldStakingAPY = Math.pow(1 + oldStakingRebase, 365 * 3) - 1;
    // console.log("old: ", oldStakingReward.toString(), oldCircSupply.toString());

    // Calculate index
    // const currentIndex = await sohmContract.balanceOf("0xA62Bee23497C920B94305FF68FA7b1Cd1e9FAdb2");

    const currentIndex = await stakingContract.index();

    return dispatch(
      fetchAppSuccess({
        currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
        currentBlock,
        fiveDayRate,
        stakingAPY,
        oldStakingAPY,
        stakingRebase,
        currentBlock,
      }),
    );
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
