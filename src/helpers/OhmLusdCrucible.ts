import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { NetworkID } from "src/lib/Bond";
import { ohm_lusd } from "../helpers/AllBonds";
import { abi as OhmLusdCrucible } from "src/abi/OhmLusdCrucible.json";
import { abi as UniswapIERC20 } from "src/abi/UniswapIERC20.json";
import { BigNumber, ethers } from "ethers";
import { addresses } from "src/constants";
import { getTokenPrice } from "../helpers";

export const calcAludelAPY = async (networkID: NetworkID, provider: StaticJsonRpcProvider) => {
  const crucibleAddress = addresses[networkID].CRUCIBLE_OHM_LUSD;
  const aludelContract = new ethers.Contract(crucibleAddress as string, OhmLusdCrucible, provider);
  const aludelData = await aludelContract.getAludelData();
  console.log("aludelData", aludelData);
  // TODO (appleseed): need USD Values
  // usdValues[bonusTokenAddress]  * 2' // lqty price, mist price
  // usdValues[aludelData.rewardToken]
  // usdValues[aludelData.stakingToken];
  let ohmPrice = await getTokenPrice("olympus");
  let ohmContractAddress = addresses[networkID].OHM_ADDRESS;
  let lusdPrice = await getTokenPrice("liquity-usd");
  let ohmLusdPrice = await ohm_lusd.getBondReservePrice(networkID, provider);
  let ohmLusdContractAddress = ohm_lusd.getAddressForReserve(networkID);
  let lqtyPrice = await getTokenPrice("liquity");
  let lqtyContractAddress = addresses[networkID].LQTY;
  let mistPrice = await getTokenPrice("alchemist");
  let mistContractAddress = addresses[networkID].MIST;

  let usdValues: { [key: string]: number } = {};
  usdValues[ohmContractAddress] = ohmPrice;
  usdValues[ohmLusdContractAddress] = ohmLusdPrice;
  usdValues[lqtyContractAddress] = lqtyPrice;
  usdValues[mistContractAddress] = mistPrice;
  console.log("usdValues", usdValues);

  let totalRemainingRewards = 0;
  let remainingDurations: number[] = [];
  let pastDurations: number[] = [];
  let dt_now = Date.now() / 1000;

  aludelData.rewardSchedules.map((rs: { start: string | number; duration: string | number; shares: number }) => {
    let rewardStart: number = parseFloat(rs.start.toString());
    let rewardDuration: number = parseFloat(rs.duration.toString());
    if (rewardStart + rewardDuration > parseFloat(dt_now.toString())) {
      totalRemainingRewards += rs.shares * (1 - (dt_now - rewardStart) / rewardDuration);
      remainingDurations.push(parseFloat(dt_now.toString()) - rewardStart + rewardDuration);
      pastDurations.push(parseFloat(dt_now.toString()) - rewardStart);
    } else {
      pastDurations.push(parseFloat(dt_now.toString()) - rewardStart + rewardDuration);
    }
  });
  let avgRemainingDuration = remainingDurations.reduce((a, b) => a + b, 0) / remainingDurations.length;

  let oldestDepositDate = Math.max.apply(null, pastDurations);

  // rewardToken is OHM for this Crucible
  const rewardTokenContract = new ethers.Contract(aludelData.rewardToken as string, UniswapIERC20, provider);
  // const rewardTokenContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, UniswapIERC20, provider);

  let rewardTokenDecimals = await rewardTokenContract.decimals();
  // let rewardTokenDecimals = 9;

  let rewardTokenQuantity = (await rewardTokenContract.balanceOf(aludelData.rewardPool)) / 10 ** rewardTokenDecimals;

  const bonusTokensLength = (await aludelContract.getBonusTokenSetLength()) as BigNumber;
  const bonusTokensLengthNumber = bonusTokensLength.toNumber();

  let bonusTokenUsdValues: number[] = [];

  await Promise.all(
    Array.from(Array(bonusTokensLengthNumber)).map(async (_, idx) => {
      const bonusTokenAddress = await aludelContract.getBonusTokenAtIndex(idx);
      const bonusTokenContract = new ethers.Contract(bonusTokenAddress, UniswapIERC20, provider);

      const bonusTokenDecimals = await bonusTokenContract.decimals();
      const balanceOfBonusToken = await bonusTokenContract.balanceOf(aludelData.rewardPool);
      const valueOfBonusToken = usdValues[bonusTokenAddress];
      const usdValueOfBonusToken = (balanceOfBonusToken / 10 ** bonusTokenDecimals) * valueOfBonusToken;
      bonusTokenUsdValues.push(usdValueOfBonusToken);
    }),
  );

  let totalUsdValueOfBonusTokens = bonusTokenUsdValues.reduce((a, b) => a + b, 0);

  let rewardsRemainingValue = totalRemainingRewards / 10 ** 24;

  let rewardsRemainingValueUsd = rewardsRemainingValue * usdValues[aludelData.rewardToken];

  let rewardsPreviouslyReleased = rewardTokenQuantity - rewardsRemainingValue;

  let rewardsReleasedPercentage = rewardsPreviouslyReleased / rewardTokenQuantity;

  let rewardTokenUsdValue = usdValues[aludelData.rewardToken];

  let rewardsPreviouslyReleasedUsdValue = rewardsPreviouslyReleased * rewardTokenUsdValue;

  let stakingTokenContract = new ethers.Contract(aludelData.stakingToken, UniswapIERC20, provider);
  let stakingTokenDecimals = await stakingTokenContract.decimals();

  let totalStakedTokens = aludelData.totalStake / 10 ** stakingTokenDecimals;
  let totalStakedTokensUsd = totalStakedTokens * usdValues[aludelData.stakingToken];

  let secs_in_year = 365 * 24 * 60 * 60;
  let remainingTime = secs_in_year / avgRemainingDuration || 0;

  let pastTime = secs_in_year / oldestDepositDate || 1;

  let averageApy =
    (rewardsPreviouslyReleasedUsdValue * pastTime +
      totalUsdValueOfBonusTokens * rewardsReleasedPercentage * pastTime +
      rewardsRemainingValueUsd * remainingTime +
      totalUsdValueOfBonusTokens * (1 - rewardsReleasedPercentage) * remainingTime) /
    totalStakedTokensUsd;

  return averageApy;
};
