import { ethers } from "ethers";
import { addresses, Actions, BONDS, VESTING_TERM } from "../constants";
import { abi as ierc20Abi } from '../abi/IERC20.json';


import { abi as BondOhmDaiContract } from '../abi/bonds/OhmDaiContract.json';
import { abi as BondDaiContract } from '../abi/bonds/DaiContract.json';
import { abi as BondOhmDaiCalcContract } from '../abi/bonds/OhmDaiCalcContract.json';
import { abi as ReserveOhmDaiContract} from '../abi/reserves/OhmDai.json';

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
  let  balance, bondDiscount, valuation, bondQuote, bondContract;
  if (bond === BONDS.ohm_dai) {
    bondContract     = new ethers.Contract(addresses[networkID].BONDS.OHM_DAI, BondOhmDaiContract, provider);
  } else if (bond === BONDS.dai) {
    bondContract = new ethers.Contract(addresses[networkID].BONDS.DAI, BondDaiContract, provider);
  }

  const marketPrice  = await getMarketPrice({networkID, provider});
  const terms        = await bondContract.terms();
  const maxBondPrice = terms.maxPayout;
  const debtRatio    = await bondContract.debtRatio();
  const bondPrice    = await bondContract.bondPriceInUSD();

  if (bond === BONDS.ohm_dai) {
    const reserveContract  = new ethers.Contract(addresses[networkID].RESERVES.OHM_DAI, ReserveOhmDaiContract, provider);
    balance          = await reserveContract.balanceOf(address);

    const bondCalcContract = new ethers.Contract( addresses[networkID].BONDS.OHM_DAI_CALC, BondOhmDaiCalcContract, provider);
    bondDiscount = (marketPrice * Math.pow(10, 9) - bondPrice) / bondPrice; // 1 - bondPrice / (marketPrice * Math.pow(10, 9));

    valuation    = await bondCalcContract.valuation(addresses[networkID].LP_ADDRESS, amountInWei);
    bondQuote    = await bondContract.payoutFor(valuation);
    bondQuote    = bondQuote / Math.pow(10, 9);
  } else if (bond === BONDS.dai) {
    const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS, ierc20Abi, provider);
    balance     = await daiContract.balanceOf(address);
    balance     = ethers.utils.formatEther(balance);


    // bondDiscount = (marketPrice * Math.pow(10, 9) - bondPrice) / bondPrice; // 1 - bondPrice / (marketPrice * Math.pow(10, 9));

    // TODO: Need to define bondCalcContract
    // valuation    = await bondCalcContract.valuation(addresses[networkID].LP_ADDRESS, amountInWei);
    // bondQuote    = await bondContract.payoutFor(valuation);
    // bondQuote    = bondQuote / Math.pow(10, 18);
  }

  // Display error if user tries to exceed maximum.
  if (!!value && parseFloat(bondQuote) > (maxBondPrice / Math.pow(10,9)) ) {
    alert("You're trying to bond more than the maximum payout availabe! The maximum bond payout is " + (maxBondPrice / Math.pow(10,9)).toFixed(2).toString() + " OHM.")
  }

  return dispatch(fetchBondSuccess({
    bond,
    balance,
    bondDiscount,
    debtRatio,
    bondQuote,
    vestingTerm: terms.vestingTerm,
    maxBondPrice: maxBondPrice / Math.pow(10,9),
    bondPrice: bondPrice / Math.pow(10, 18),
    marketPrice: marketPrice / Math.pow(10, 9)
  }))

};



export const calculateUserBondDetails = ({ address, bond, networkID, provider }) => async dispatch => {
  if (!address) return;

  // Calculate bond details.
  let bondContract
  if (bond === BONDS.ohm_dai) {
    bondContract  = new ethers.Contract(addresses[networkID].BONDS.OHM_DAI, BondOhmDaiContract, provider);
  } else if (bond === BONDS.dai) {
    bondContract  = new ethers.Contract(addresses[networkID].BONDS.DAI, BondDaiContract, provider);
  }

  const bondDetails = await bondContract.bondInfo(address);
  const interestDue = bondDetails[1];
  const bondMaturationBlock = +bondDetails[3] + +bondDetails[2];
  const pendingPayout = await bondContract.pendingPayoutFor(address);

  return dispatch(fetchBondSuccess({
    bond,
    interestDue: ethers.utils.formatUnits(interestDue, 'gwei'),
    bondMaturationBlock,
    pendingPayout: ethers.utils.formatUnits(pendingPayout, 'gwei')
  }))

};


export const bondAsset = ({ value, address, bond, networkID, provider, slippage }) => async dispatch => {
  const depositorAddress = address;
  const acceptedSlippage = slippage / 100 || 0.02; // 2%
  const valueInWei = ethers.utils.parseUnits(value.toString(), 'ether');

  console.log("depositorAddress = ", depositorAddress);
  console.log("acceptedSlippage = ", acceptedSlippage);

  const signer = provider.getSigner();
  let bondContract, balance;
  if (bond === BONDS.ohm_dai) {
    bondContract = new ethers.Contract(addresses[networkID].BONDS.OHM_DAI, BondOhmDaiContract, provider);
  } else if (bond === BONDS.dai) {
    bondContract = new ethers.Contract(addresses[networkID].BONDS.DAI, BondDaiContract, provider);
  }

  // Calculate maxPremium based on premium and slippage.
  // const calculatePremium = await bonding.calculatePremium();
  const calculatePremium = await bondContract.bondPrice();
  const maxPremium       = Math.round(calculatePremium * (1 + acceptedSlippage));

  // Deposit the bond
  try {
    const bondTx = await bondContract.deposit(valueInWei, maxPremium, depositorAddress);
    await bondTx.wait();

    if (bond === BONDS.ohm_dai) {
      const reserveContract  = new ethers.Contract(addresses[networkID].RESERVES.OHM_DAI, ReserveOhmDaiContract, provider);
      balance          = await reserveContract.balanceOf(address);
    } else if (bond === BONDS.dai) {
      const daiContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS, ierc20Abi, provider);
      balance     = await daiContract.balanceOf(address);
      balance     = ethers.utils.formatEther(balance);
    }

    return dispatch(fetchBondSuccess({ bond, balance }))
  } catch (error) {
    if (error.code === -32603 && error.message.indexOf('ds-math-sub-underflow') >= 0) {
      alert(
        'You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow'
      );
    } else
      alert(error.message);
    return;
  }
}


export const redeemBond = ({ address, bond, networkID, provider, autostake }) => async dispatch => {
  if (!provider) {
    alert('Please connect your wallet!');
    return;
  }

  const signer = provider.getSigner();

  let bondContract;
  if (bond === BONDS.ohm_dai) {
    bondContract = await new ethers.Contract(addresses[networkID].BONDS.OHM_DAI, BondOhmDaiContract, signer);
  } else if (bond === BONDS.dai) {
    bondContract = await new ethers.Contract(addresses[networkID].BONDS.DAI, BondDaiContract, signer);
  }

  try {
    const redeemTx = await bondContract.redeem(autostake);
    await redeemTx.wait();
  } catch (error) {
    alert(error.message);
  }
}
