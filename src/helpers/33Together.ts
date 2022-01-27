import { BigNumber, ethers } from "ethers";
import { trim } from "src/helpers";

import { addresses, NetworkId } from "../constants";

/**
 * Calculates user's odds of winning based on their pool balance
 * @param {*} usersPoolBalance the user's total balance of pool tokens
 * @param {*} totalPoolDeposits the pool's total balance of deposits. Does not include totalSponsorship deposits since those can't win
 * @param {*} winners the pool's winners quantity per award period
 * PoolTogether's implementation: https://github.com/pooltogether/pooltogether-community-ui/blob/2d4749e2e64c4f2ae259ac073edc0a49ca5857e2/lib/utils/calculateOdds.js#L3
 */
export const calculateOdds = (usersPoolBalance: string, totalPoolDeposits: number, winners: number) => {
  let userOdds;
  if (usersPoolBalance === undefined || Number(usersPoolBalance) === 0 || parseFloat(usersPoolBalance) === 0) {
    userOdds = "ngmi";
  } else {
    userOdds = 1 / (1 - Math.pow((totalPoolDeposits - Number(usersPoolBalance)) / totalPoolDeposits, winners));
  }
  return userOdds;
};

/**
 * Calculates exitFeeDecayTime
 * @param {*} ticketCreditRateMantissa from the contract
 * @param {*} ticketCreditLimitMantissa from the contract
 * @returns {Array} [creditMaturationInDays === ExitFeeDecayTime (in days), creditLimitPercentage === ExitFee as %]
 * PoolTogether's implementation: https://github.com/pooltogether/pooltogether-community-ui/blob/93884caf76eb91ec700c4a74c3fc40ecf65c1d47/lib/utils/format.js#L50
 */
export const getCreditMaturationDaysAndLimitPercentage = (
  ticketCreditRateMantissa: BigNumber,
  ticketCreditLimitMantissa: BigNumber,
): Array<number> => {
  const creditLimitMantissa = ethers.utils.formatEther(ticketCreditLimitMantissa);
  const creditLimitPercentage = fractionToPercentage(Number(creditLimitMantissa));
  const creditMaturationInSeconds = ticketCreditRateMantissa.gt(0)
    ? Number(ticketCreditLimitMantissa.div(ticketCreditRateMantissa).toString())
    : 0;
  const creditMaturationInDays = secondsToDaysForInput(creditMaturationInSeconds);
  return [creditMaturationInDays, creditLimitPercentage];
};

/**
 * Convert a fraction to a whole number
 */
export const fractionToPercentage = (fraction: number) => {
  return Math.round(fraction * 100);
};

/**
 * Convert a number of days to seconds.
 * Rounding to 4 significant digits (minimum value is ~8 seconds).
 * @param {*} seconds
 */
export const secondsToDaysForInput = (seconds: number) => {
  return Math.round((seconds / 60 / 60 / 24) * 10000) / 10000;
};

/**
 * TODO: add the mainnet urls
 * return helper urls for the Pool Together UI.
 * @param networkId
 * @returns [PrizePoolURI, PoolDetailsURI]
 */
export const poolTogetherUILinks = (networkId: NetworkId): Array<string> => {
  // if (networkId === -1) networkId = 1;
  const contractAddress = addresses[networkId].PT_PRIZE_POOL_ADDRESS;

  if (networkId === NetworkId.TESTNET_RINKEBY) {
    return [
      `https://community.pooltogether.com/pools/rinkeby/${contractAddress}/home`,
      `https://community.pooltogether.com/pools/rinkeby/${contractAddress}/manage#stats`,
    ];
  } else {
    return [
      `https://app.pooltogether.com/pools/mainnet/sOHM`,
      `https://community.pooltogether.com/pools/mainnet/${contractAddress}/manage#stats`,
    ];
  }
};

/**
 * Utility to simplify trimming odds when there's a chance it'll be a string like ngmi
 *
 * @param odds current odds as number or a string representing 0 odds
 * @param precision the amount of decimal places to display, defaults to 4
 */
export const trimOdds = (odds: number | string, precision = 4) =>
  typeof odds === "string" ? odds : trim(odds, precision);
