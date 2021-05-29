import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from '../abi/IERC20.json';
import { abi as OHMPreSale } from '../abi/OHMPreSale.json';
import { abi as OlympusStaking } from '../abi/OlympusStaking.json';
import { abi as MigrateToOHM } from '../abi/MigrateToOHM.json';
import { abi as sOHM } from '../abi/sOHM.json';
import { abi as LPStaking } from '../abi/LPStaking.json';
import { abi as DistributorContract } from '../abi/DistributorContract.json';
import { abi as BondContract } from '../abi/BondContract.json';
import { abi as DaiBondContract } from '../abi/DaiBondContract.json';
import Constants from './constants';

const parseEther = ethers.utils.parseEther;

export const fetchAccountSuccess = payload => ({
  type: Constants.Actions.FETCH_ACCOUNT_SUCCESS,
  payload,
});

export const loadAccountDetails = ({ networkID, provider, address }) => async dispatch => {
  console.log("networkID = ", networkID)
  console.log("addresses = ",addresses)

  let ohmContract, ohmBalance = 0, sohmBalance = 0, stakeAllowance = 0, unstakeAllowance = 0;
  let lpStakingContract, lpStaked = 0, pendingRewards = 0;
  let lpStakeAllowance, distributorContract, lpBondAllowance = 0, daiBondAllowance = 0;
  let migrateContract, aOHMAbleToClaim = 0;



  const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS, ierc20Abi, provider);
  const balance     = await daiContract.balanceOf(address);
  const lpContract  = new ethers.Contract(addresses[networkID].LP_ADDRESS, ierc20Abi,provider);
  const allowance   = await daiContract.allowance(address,addresses[networkID].PRESALE_ADDRESS);
  const lpBalance   = await lpContract.balanceOf(address);

  if (addresses[networkID].OHM_ADDRESS) {
    const ohmContract = new ethers.Contract(
      addresses[networkID].OHM_ADDRESS,
      ierc20Abi,
      provider
    );
    ohmBalance = await ohmContract.balanceOf(address);
    stakeAllowance = await ohmContract.allowance(
      address,
      addresses[networkID].STAKING_ADDRESS
    );
  }

  if (addresses[networkID].SOHM_ADDRESS) {
    const sohmContract = await new ethers.Contract(
      addresses[networkID].SOHM_ADDRESS,
      ierc20Abi,
      provider
    );
    sohmBalance = await sohmContract.balanceOf(address);
    unstakeAllowance = await sohmContract.allowance(
      address,
      addresses[networkID].STAKING_ADDRESS
    );
  }

  console.log("ohmBalance = ", ohmBalance)
  return dispatch(fetchAccountSuccess({
    ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
    sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei'),

  }))

  // commit('set', {
  //   balance: ethers.utils.formatEther(balance),
  //   aOHMBalance,
  //   userDataLoading: false,
  //   loading: false,
  //   ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
  //   sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei'),
  //   lpBalance: ethers.utils.formatUnits(lpBalance, 'ether'),
  //   lpStaked: ethers.utils.formatUnits(lpStaked, 'ether'),
  //   pendingRewards: ethers.utils.formatUnits(pendingRewards, 'gwei'),
  //   aOHMAbleToClaim: ethers.utils.formatUnits(aOHMAbleToClaim, 'gwei'),
  //   allowance,
  //   stakeAllowance,
  //   unstakeAllowance,
  //   lpStakeAllowance,
  //   lpBondAllowance,
  //   daiBondAllowance
  // });

};
