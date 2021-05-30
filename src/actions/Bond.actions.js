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
import { abi as LpBondCalcContract } from '../abi/LpBondCalcContract.json';

import { abi as PairContract } from '../abi/PairContract.json';


import { getTokenSupply, getMarketPrice } from '../helpers';

export const fetchBondSuccess = payload => ({
  type: Actions.FETCH_BOND_SUCCESS,
  payload
});

export const changeApproval = ({ token, provider, address, networkID }) => async dispatch => {
  if (!provider) {
    alert('Please connect your wallet!');
    return;
  }

  alert("WRONG")

  const signer = provider.getSigner();
  const ohmContract = await new ethers.Contract(
    addresses[networkID].OHM_ADDRESS,
    ierc20Abi,
    signer
  );
  const sohmContract = await new ethers.Contract(
    addresses[networkID].SOHM_ADDRESS,
    ierc20Abi,
    signer
  );

  let approveTx;
  try {
    if (token === 'ohm') {
      approveTx = await ohmContract.approve(
        addresses[networkID].STAKING_ADDRESS,
        ethers.utils.parseUnits('1000000000', 'gwei').toString()
      );
    } else if (token === 'sohm') {
      const approveTx = await sohmContract.approve(
        addresses[networkID].STAKING_ADDRESS,
        ethers.utils.parseUnits('1000000000', 'gwei').toString()
      );
    }

    await approveTx.wait();
  } catch (error) {
    alert(error.message);
    return;
  }


  const stakeAllowance   = await ohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
  const unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
  return dispatch(fetchBondSuccess({
    staking: {
      ohmStake: stakeAllowance,
      ohmUnstake: unstakeAllowance,
    },
  }))


};

export const calcBondDetails = ({ value, provider, networkID }) => async dispatch => {
  let amountInWei;
  if (!value || value === '') {
    amountInWei = ethers.utils.parseEther('0.0001'); // Use a realistic SLP ownership
  } else {
    amountInWei = ethers.utils.parseEther(value);
  }
  const pairContract = new ethers.Contract(
    addresses[networkID].LP_ADDRESS,
    PairContract,
    provider
  );
  // If the user hasn't entered anything, let's calculate a fraction of SLP
  const bondingContract = new ethers.Contract(
    addresses[networkID].BOND_ADDRESS,
    BondContract,
    provider
  );
  const lpContract = new ethers.Contract(
    addresses[networkID].LP_ADDRESS,
    ierc20Abi,
    provider
  );
  const bondCalcContract = new ethers.Contract(
    addresses[networkID].LP_BONDINGCALC_ADDRESS,
    LpBondCalcContract,
    provider
  );

  const totalLP     = await lpContract.totalSupply();
  const ohmSupply   = getTokenSupply({networkID, provider});
  const vestingTerm = await bondingContract.vestingTerm();

  const totalDebtDo = await bondingContract.totalDebt();
  const debtRatio   = await bondingContract.debtRatio();
  const marketPrice = getMarketPrice({networkID, provider});

  const maxBondPrice = await bondingContract.maxPayout();
  const bondPrice    = await bondingContract.bondPriceInDAI();
  const bondDiscount = (marketPrice * Math.pow(10, 9) - bondPrice) / bondPrice; // 1 - bondPrice / (marketPrice * Math.pow(10, 9));


  // Bond quote comes from valuing LP contract.
  let valuation = await bondCalcContract.valuation(addresses[networkID].LP_ADDRESS, amountInWei);
  let bondQuote = await bondingContract.payoutFor(valuation);
  valuation = valuation / Math.pow(10, 18);
  bondQuote = bondQuote / Math.pow(10, 9);

  // Display error if user tries to exceed maximum.
  if (!!value && parseFloat(bondQuote) > (maxBondPrice / Math.pow(10,9)) ) {
    alert("You're trying to bond more than the maximum payout availabe! The maximum bond payout is " + (maxBondPrice / Math.pow(10,9)).toFixed(2).toString() + " OHM.")
  }




  return dispatch(fetchBondSuccess({
    value,
    bondDiscount,
    debtRatio,
    bondQuote,
    vestingTerm,
    maxBondPrice: maxBondPrice / Math.pow(10,9),
    bondPrice: bondPrice / Math.pow(10, 18),
    marketPrice: marketPrice / Math.pow(10, 9)
  }))

};



export const calculateUserBondDetails = ({ }) => async dispatch => {
};
