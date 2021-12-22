import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { BigNumber, ethers } from "ethers";
import { abi as OhmLusdCrucibleABI } from "src/abi/OhmLusdCrucible.json";
import { abi as UniswapIERC20ABI } from "src/abi/UniswapIERC20.json";
import { addresses } from "src/constants";
import { NetworkID } from "src/lib/Bond";
import { OhmLusdCrucible, UniswapIERC20 } from "src/typechain";

import { getTokenPrice } from "../helpers";
import { lusd, ohm_lusd } from "../helpers/AllBonds";

export const calcAludelDetes = async (networkID: NetworkID, provider: StaticJsonRpcProvider) => {
  const crucibleAddress = addresses[networkID].CRUCIBLE_OHM_LUSD;
  const aludelContract = new ethers.Contract(
    crucibleAddress as string,
    OhmLusdCrucibleABI,
    provider,
  ) as OhmLusdCrucible;
  const aludelData = await aludelContract.getAludelData();
  // getting contractAddresses & Pricing for calculations below
  const ohmPrice = await getTokenPrice("olympus");
  const ohmContractAddress = addresses[networkID].OHM_ADDRESS.toLowerCase();

  const lusdPrice = await getTokenPrice("liquity-usd");
  const lusdContractAddress = lusd.getAddressForReserve(networkID)?.toLowerCase();

  const ohmLusdPrice = await ohm_lusd.getBondReservePrice(networkID, provider);
  const ohmLusdContractAddress = ohm_lusd.getAddressForReserve(networkID)?.toLowerCase();

  // If this is unavailable on the current network
  if (!lusdContractAddress || !ohmLusdContractAddress) return;

  const lqtyPrice = await getTokenPrice("liquity");
  const lqtyContractAddress = addresses[networkID].LQTY.toLowerCase();

  const mistPrice = await getTokenPrice("alchemist");
  const mistContractAddress = addresses[networkID].MIST.toLowerCase();

  // set addresses & pricing in dictionary
  const usdValues: { [key: string]: number } = {};
  usdValues[ohmContractAddress] = ohmPrice;
  usdValues[ohmLusdContractAddress] = Number(ohmLusdPrice.toString());
  usdValues[lqtyContractAddress] = lqtyPrice;
  usdValues[mistContractAddress] = mistPrice;

  // console.log("usdValues", usdValues);
  let totalRemainingRewards = 0;
  const remainingDurations: number[] = [];
  const pastDurations: number[] = [];
  const dt_now = Date.now() / 1000;

  // console.log("aludelData", aludelData);
  // map through all fund() calls
  aludelData.rewardSchedules.map((rs: { start: BigNumber; duration: BigNumber; shares: BigNumber }) => {
    const rewardStart: number = parseFloat(rs.start.toString());
    const rewardDuration: number = parseFloat(rs.duration.toString());

    // if the reward has already ended, skip it
    if (rewardStart + rewardDuration > parseFloat(dt_now.toString())) {
      // shares remaining for reward schedule
      totalRemainingRewards += Number(rs.shares.toString()) * (1 - (dt_now - rewardStart) / rewardDuration);

      // seconds remaining of reward schedule
      remainingDurations.push(parseFloat(dt_now.toString()) - rewardStart + rewardDuration);

      // seconds past since start of reward schedule
      pastDurations.push(parseFloat(dt_now.toString()) - rewardStart);
    } else {
      // seconds since reward schedule started
      pastDurations.push(parseFloat(dt_now.toString()) - rewardStart + rewardDuration);
    }
  });

  // average duration in seconds for future releases
  const avgRemainingDuration = remainingDurations.reduce((a, b) => a + b, 0) / remainingDurations.length;

  // furthest start date for past funds
  const oldestDepositDate = Math.max.apply(null, pastDurations);

  // rewardToken is OHM for this Crucible
  const rewardTokenContract = new ethers.Contract(
    aludelData.rewardToken as string,
    UniswapIERC20ABI,
    provider,
  ) as UniswapIERC20;

  const rewardTokenDecimals = await rewardTokenContract.decimals();
  // let rewardTokenDecimals = 9;

  const rewardPoolBalance = await rewardTokenContract.balanceOf(aludelData.rewardPool);
  // balance of rewardToken in pool
  const rewardTokenQuantity = Number(rewardPoolBalance.toString()) / 10 ** rewardTokenDecimals;

  // amount of bonus tokens in program
  const bonusTokensLength = (await aludelContract.getBonusTokenSetLength()) as BigNumber;
  const bonusTokensLengthNumber = Number(bonusTokensLength.toString());

  const bonusTokenUsdValues: number[] = [];

  // get bonus tokens and their USD value
  await Promise.all(
    Array.from(Array(bonusTokensLengthNumber)).map(async (_, idx) => {
      const bonusTokenAddress = await aludelContract.getBonusTokenAtIndex(idx);
      const bonusTokenContract = new ethers.Contract(bonusTokenAddress, UniswapIERC20ABI, provider) as UniswapIERC20;

      const bonusTokenDecimals = await bonusTokenContract.decimals();
      const balanceOfBonusToken = await bonusTokenContract.balanceOf(aludelData.rewardPool);
      const valueOfBonusToken = usdValues[bonusTokenAddress.toLowerCase()];

      const usdValueOfBonusToken =
        (Number(balanceOfBonusToken.toString()) / 10 ** bonusTokenDecimals) * valueOfBonusToken;
      bonusTokenUsdValues.push(usdValueOfBonusToken);
    }),
  );

  // calculate total USD value of bonus tokens
  const totalUsdValueOfBonusTokens = bonusTokenUsdValues.reduce((a, b) => a + b, 0);

  // scale shares to token decimals + base share (10 ** 6)
  const rewardsRemainingValue = totalRemainingRewards / 10 ** (rewardTokenDecimals + 6);

  // usd value of rewardToken
  const rewardTokenUsdValue = usdValues[aludelData.rewardToken.toLowerCase()];

  // usd value of rewardToken to be released
  const rewardsRemainingValueUsd = rewardsRemainingValue * rewardTokenUsdValue;

  // amount of rewardToken that are released
  const rewardsPreviouslyReleased = rewardTokenQuantity - rewardsRemainingValue;

  // percentage of rewardToken that are released
  const rewardsReleasedPercentage = rewardsPreviouslyReleased / rewardTokenQuantity;

  // usd value of rewardToken that are released
  const rewardsPreviouslyReleasedUsdValue = rewardsPreviouslyReleased * rewardTokenUsdValue;

  const lusdContract = new ethers.Contract(lusdContractAddress, UniswapIERC20ABI, provider) as UniswapIERC20;

  const stakedOhm =
    Number((await rewardTokenContract.balanceOf(aludelData.stakingToken)).toString()) / 10 ** rewardTokenDecimals;
  // 18 decimals for LUSD
  const stakedLusd = Number((await lusdContract.balanceOf(aludelData.stakingToken)).toString()) / 10 ** 18;

  const totalStakedTokensUsd = stakedOhm * ohmPrice + stakedLusd * lusdPrice;

  const stakingTokenContract = new ethers.Contract(
    aludelData.stakingToken,
    UniswapIERC20ABI,
    provider,
  ) as UniswapIERC20;
  const sushiTokenSupply = Number((await stakingTokenContract.totalSupply()).toString()) / 10 ** 18;
  // total stake of stakingToken with 18 decimals
  const aludelTotalStakedTokens = Number(aludelData.totalStake.toString()) / 10 ** 18;
  // total usd value of staked stakingToken is the percent of aludel-staked over sushi-staked times sushi staked USD
  const aludelTotalStakedTokensUsd = (aludelTotalStakedTokens / sushiTokenSupply) * totalStakedTokensUsd;

  const secs_in_year = 365 * 24 * 60 * 60;

  // future rewards multiplier based on avg future rewards duration
  const remainingTime = secs_in_year / avgRemainingDuration || 0;

  // past rewards multiplier based on ealiest rewardShedule start date
  const pastTime = secs_in_year / oldestDepositDate || 1;

  const numerator =
    // calculate apy from released rewardToken
    rewardsPreviouslyReleasedUsdValue * pastTime +
    // calculate apy from released bonus tokens based on rewardToken released percentage
    totalUsdValueOfBonusTokens * rewardsReleasedPercentage * pastTime +
    // calculate apy from future released rewardToken
    rewardsRemainingValueUsd * remainingTime +
    // calculate apy from future released bonus tokens based on rewardToken released percentage
    totalUsdValueOfBonusTokens * (1 - rewardsReleasedPercentage) * remainingTime;

  // divide apy based on value of staked stakingToken
  const averageApy = (numerator / aludelTotalStakedTokensUsd) * 100;

  return {
    averageApy: averageApy,
    tvlUsd: aludelTotalStakedTokensUsd,
  };
};
