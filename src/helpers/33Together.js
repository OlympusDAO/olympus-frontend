import { ethers } from "ethers";
import { addresses } from "../constants";
import { addEthersEventListener, removeEthersEventListener } from "./ethersEventListener";
import { abi as PrizePool } from "../abi/33-together/PrizePoolAbi2.json";
import { abi as AwardPool } from "../abi/33-together/AwardAbi2.json";

/**
 * Calculates user's odds of winning based on their pool balance
 * @param {*} usersPoolBalance the user's total balance of pool tokens
 * @param {*} totalPoolDeposits the pool's total balance of deposits. Does not include totalSponsorship deposits since those can't win
 * @param {*} winners the pool's winners quantity per award period
 * PoolTogether's implementation: https://github.com/pooltogether/pooltogether-community-ui/blob/2d4749e2e64c4f2ae259ac073edc0a49ca5857e2/lib/utils/calculateOdds.js#L3
 */
export const calculateOdds = (usersPoolBalance, totalPoolDeposits, winners) => {
  let userOdds;
  if (usersPoolBalance === undefined || usersPoolBalance === 0 || parseFloat(usersPoolBalance) === 0) {
    userOdds = "ngmi";
  } else {
    userOdds = 1 / (1 - Math.pow((totalPoolDeposits - usersPoolBalance) / totalPoolDeposits, winners));
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
export const getCreditMaturationDaysAndLimitPercentage = (ticketCreditRateMantissa, ticketCreditLimitMantissa) => {
  const creditLimitMantissa = ethers.utils.formatEther(ticketCreditLimitMantissa);
  const creditLimitPercentage = fractionToPercentage(creditLimitMantissa);
  const creditMaturationInSeconds = ticketCreditRateMantissa.gt(0)
    ? ticketCreditLimitMantissa.div(ticketCreditRateMantissa)
    : 0;
  const creditMaturationInDays = secondsToDaysForInput(creditMaturationInSeconds);
  return [creditMaturationInDays, creditLimitPercentage];
};

/**
 * Convert a fraction to a whole number
 */
export const fractionToPercentage = fraction => {
  return Math.round(fraction * 100);
};

/**
 * Convert a number of days to seconds.
 * Rounding to 4 significant digits (minimum value is ~8 seconds).
 * @param {*} seconds
 */
export const secondsToDaysForInput = seconds => {
  return Math.round((seconds / 60 / 60 / 24) * 10000) / 10000;
};

/**
 * TODO: add the mainnet urls
 * return helper urls for the Pool Together UI.
 * @param {*} chainID
 * @returns {Array} [PrizePoolURI, PoolDetailsURI]
 */
export const poolTogetherUILinks = chainID => {
  const contractAddress = addresses[chainID].POOL_TOGETHER.PRIZE_POOL_ADDRESS;

  if (chainID === 4) {
    return [
      `https://community.pooltogether.com/pools/rinkeby/${contractAddress}/home`,
      `https://community.pooltogether.com/pools/rinkeby/${contractAddress}/manage#stats`,
    ];
  } else {
    // TODO (appleseed-33t): these are the rinkeby urls again
    return [
      `https://community.pooltogether.com/pools/rinkeby/${contractAddress}/home`,
      `https://community.pooltogether.com/pools/rinkeby/${contractAddress}/manage#stats`,
    ];
  }
};

/**
 * listen for the RNG Complete Event.
 * Should set this listener AFTER Pool Award Started
 * Listener will fire When Award Completed.
 * @param {*} provider
 * @param {*} networkID
 */
export const listenAndHandleRNGCompleteEvent = (provider, networkID, eventHandler) => {
  // const contractAddress = "0xeeb552c4d5e155e50ee3f7402ed379bf72e36f23";
  const contractAddress = addresses[networkID].POOL_TOGETHER.PRIZE_STRATEGY_ADDRESS;
  // "RngRequestFailed"
  // const topicString = "RandomNumberCompleted(uint32,uint256)";
  const topicString = "RandomNumberCompleted";

  const handlerFunc = () => {
    removeEthersEventListener(provider, topicString, contractAddress);
    eventHandler();
    setTimeout(() => window.location.reload(), 15000);
  };

  const poolReader = new ethers.Contract(contractAddress, AwardPool, provider);

  addEthersEventListener(poolReader, topicString, contractAddress, handlerFunc);
};

// NOTE(appleseed-33t): just using this func to debug events
export const listenAndHandleDepositEvent = async (provider, networkID, eventHandler) => {
  const contractAddress = addresses[networkID].POOL_TOGETHER.PRIZE_STRATEGY_ADDRESS;
  // const topicString = "Deposited(operator, to, controlledToken, amount, referrer)";
  // Deposited(operator, to, controlledToken, amount, referrer);
  // const topicString = "CreditMinted(address,address,uint256)";

  const poolReader = new ethers.Contract(contractAddress, AwardPool, provider);

  const filter = poolReader.filters.PrizePoolAwardStarted(null, null, null, null);
  // const filter = "CreditMinted";

  // const handlerFunc = () => {
  //   removeEthersEventListener(poolReader, filter, contractAddress);
  //   eventHandler();
  //   setTimeout(() => window.location.reload(), 15000);
  // };

  // addEthersEventListener(poolReader, filter, contractAddress, handlerFunc);
  console.log("filter", filter);
  let response = await poolReader.queryFilter(filter, 9345000, "latest").then(resp => {
    console.log("awaited", resp);
  });
  console.log("response", response);
};

/**
 * listen for the RNG Start Event.
 * Should set this listener When Pool Timer === 0
 * Listener will fire When Award Started.
 * @param {*} provider
 * @param {*} networkID
 * @param {*} timeRemaining time left on PoolTogether timer
 * @param {*} secondsLeft our countdown to 0 (starts at 0 on init)
 */
export const listenAndHandleRNGStartEvent = (provider, networkID, secondsLeft, eventHandler) => {
  // const contractAddress = "0xeeb552c4d5e155e50ee3f7402ed379bf72e36f23";
  const contractAddress = addresses[networkID].POOL_TOGETHER.PRIZE_STRATEGY_ADDRESS;
  // const topicString = "RandomNumberRequested(uint32,address)";
  const topicString = "RandomNumberRequested";
  if (secondsLeft <= 0) {
    console.log("start listener");
    const handlerFunc = () => {
      removeEthersEventListener(provider, topicString, contractAddress);
      eventHandler();
      setTimeout(() => window.location.reload(), 15000);
    };

    const poolReader = new ethers.Contract(contractAddress, AwardPool, provider);

    addEthersEventListener(poolReader, topicString, contractAddress, handlerFunc);
  } else {
    console.log("end listener");
    removeEthersEventListener(poolReader, topicString, contractAddress);
  }
};
