import { ethers } from "ethers";
import { addresses, Actions, BONDS, VESTING_TERM } from "../constants";
import { abi as ierc20Abi } from '../abi/IERC20.json';


import { abi as BondOhmDaiContract } from '../abi/bonds/OhmDaiContract.json';
import { abi as BondOhmDaiCalcContract } from '../abi/bonds/OhmDaiCalcContract.json';
import { abi as BondDaiContract } from '../abi/bonds/DaiContract.json';

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

export const calcBondDetails = ({ address, bond, value, provider, networkID }) => async dispatch => {
  let amountInWei;
  if (!value || value === '') {
    amountInWei = ethers.utils.parseEther('0.0001'); // Use a realistic SLP ownership
  } else {
    amountInWei = ethers.utils.parseEther(value);
  }

  // const vestingTerm = VESTING_TERM; // hardcoded for now
  const marketPrice = await getMarketPrice({networkID, provider});
  let terms, balance, maxBondPrice, totalDebtDo, debtRatio, bondPrice, bondDiscount, valuation, bondQuote;

  if (bond === BONDS.ohm_dai) {
    const bondingContract  = new ethers.Contract(addresses[networkID].BONDS.OHM_DAI, BondOhmDaiContract, provider);
    const bondCalcContract = new ethers.Contract(addresses[networkID].BONDS.OHM_DAI_CALC, BondOhmDaiCalcContract, provider);
    // const reserveContract  = new ethers.Contract(addresses[networkID].RESERVES.OHM_DAI, PairContract, provider);
    // const balance          = await reserveContract.balanceOf(address);

    terms        = await bondingContract.terms();
    maxBondPrice = terms.maxPayout;
    totalDebtDo = await bondingContract.totalDebt();
    debtRatio   = await bondingContract.debtRatio();

    bondPrice    = await bondingContract.bondPriceInUSD();
    bondDiscount = (marketPrice * Math.pow(10, 9) - bondPrice) / bondPrice; // 1 - bondPrice / (marketPrice * Math.pow(10, 9));

    // Bond quote comes from valuing LP contract.
    valuation = await bondCalcContract.valuation(addresses[networkID].LP_ADDRESS, amountInWei);
    bondQuote = await bondingContract.payoutFor(valuation);
    valuation = valuation / Math.pow(10, 18);
    bondQuote = bondQuote / Math.pow(10, 9);
  } else {
    alert("You need to implement this!")
  }

  // Display error if user tries to exceed maximum.
  if (!!value && parseFloat(bondQuote) > (maxBondPrice / Math.pow(10,9)) ) {
    alert("You're trying to bond more than the maximum payout availabe! The maximum bond payout is " + (maxBondPrice / Math.pow(10,9)).toFixed(2).toString() + " OHM.")
  }

  return dispatch(fetchBondSuccess({
    [bond]: {
      // balance,
      bondDiscount,
      debtRatio,
      bondQuote,
      vestingTerm: terms.vestingTerm,
      maxBondPrice: maxBondPrice / Math.pow(10,9),
      bondPrice: bondPrice / Math.pow(10, 18),
      marketPrice: marketPrice / Math.pow(10, 9)
    }
  }))

};



export const calculateUserBondDetails = ({ address, bond, networkID, provider }) => async dispatch => {
  if (!address) return;

  // Calculate bond details.
  let interestDue, bondMaturationBlock, pendingPayout;
  if (bond === BONDS.ohm_dai) {
    const bondingContract  = new ethers.Contract(addresses[networkID].BONDS.OHM_DAI, BondOhmDaiContract, provider);

    const bondDetails = await bondingContract.bondInfo(address);
    interestDue = bondDetails[1];
    bondMaturationBlock = +bondDetails[3] + +bondDetails[2];
    pendingPayout = await bondingContract.pendingPayoutFor(address);
  }

  // commit('set', {
  //   interestDue: ethers.utils.formatUnits(interestDue, 'gwei'),
  //   bondMaturationBlock,
  //   pendingPayout: ethers.utils.formatUnits(pendingPayout, 'gwei')
  // });

  return dispatch(fetchBondSuccess({
    [bond]: {
      interestDue: ethers.utils.formatUnits(interestDue, 'gwei'),
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, 'gwei')
    }
  }))

};
