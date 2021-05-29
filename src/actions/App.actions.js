import { ethers } from "ethers";
import { addresses, Actions } from "../constants";
import { abi as ierc20Abi } from '../abi/IERC20.json';
import { abi as OHMPreSale } from '../abi/OHMPreSale.json';
import { abi as OlympusStaking } from '../abi/OlympusStaking.json';
import { abi as MigrateToOHM } from '../abi/MigrateToOHM.json';
import { abi as sOHM } from '../abi/sOHM.json';
import { abi as LPStaking } from '../abi/LPStaking.json';
import { abi as DistributorContract } from '../abi/DistributorContract.json';
import { abi as BondContract } from '../abi/BondContract.json';
import { abi as DaiBondContract } from '../abi/DaiBondContract.json';


const parseEther = ethers.utils.parseEther;

export const fetchAppSuccess = payload => ({
  type: Actions.FETCH_APP_SUCCESS,
  payload,
});

export const loadAppDetails = ({ networkID, provider }) => async dispatch => {
  const currentBlock = await provider.getBlockNumber();

  const ohmContract       = new ethers.Contract(addresses[networkID].OHM_ADDRESS, ierc20Abi, provider);
  const stakingContract   = new ethers.Contract(addresses[networkID].STAKING_ADDRESS, OlympusStaking, provider);
  const sohmContract      = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, ierc20Abi, provider);
  const sohmMainContract  = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, sOHM, provider);

  // Calculating staking
  const stakingReward = await stakingContract.ohmToDistributeNextEpoch();
  const circSupply    = await sohmMainContract.circulatingSupply();

  const stakingRebase = stakingReward / circSupply;
  const fiveDayRate   = Math.pow(1 + stakingRebase, 5 * 3) - 1;
  const stakingAPY    = Math.pow(1 + stakingRebase, 365 * 3);

  // Calculate index
  const currentIndex = await sohmContract.balanceOf('0xA62Bee23497C920B94305FF68FA7b1Cd1e9FAdb2');

  return dispatch(fetchAppSuccess({
    currentIndex: ethers.utils.formatUnits(currentIndex, 'gwei'),
    currentBlock,
    fiveDayRate,
    stakingAPY,
    stakingRebase,
    currentBlock,
  }))


};
