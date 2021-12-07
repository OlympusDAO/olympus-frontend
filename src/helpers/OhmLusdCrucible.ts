import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { NetworkID } from "src/lib/Bond";
import { ohm_lusd, lusd } from "../helpers/AllBonds";
import { abi as OhmLusdCrucibleABI } from "src/abi/OhmLusdCrucible.json";
import { abi as UniswapIERC20ABI } from "src/abi/UniswapIERC20.json";
import { BigNumber, ethers } from "ethers";
import { addresses } from "src/constants";
import { getTokenPrice } from "../helpers";
import { OhmLusdCrucible, UniswapIERC20 } from "src/typechain";

export const calcAludelDetes = async (networkID: NetworkID, provider: StaticJsonRpcProvider) => {
  const crucibleAddress = addresses[networkID].CRUCIBLE_OHM_LUSD;
  const aludelContract = new ethers.Contract(
    crucibleAddress as string,
    OhmLusdCrucibleABI,
    provider,
  ) as OhmLusdCrucible;
  const aludelData = await aludelContract.getAludelData();
  // getting contractAddresses & Pricing for calculations below
  let ohmPrice = await getTokenPrice("olympus");
  let ohmContractAddress = addresses[networkID].OHM_ADDRESS.toLowerCase();

  let lusdPrice = await getTokenPrice("liquity-usd");
  let lusdContractAddress = lusd.getAddressForReserve(networkID)?.toLowerCase();

  let ohmLusdPrice = await ohm_lusd.getBondReservePrice(networkID, provider);
  let ohmLusdContractAddress = ohm_lusd.getAddressForReserve(networkID)?.toLowerCase();

  // If this is unavailable on the current network
  if (!lusdContractAddress || !ohmLusdContractAddress) return;

  let lqtyPrice = await getTokenPrice("liquity");
  let lqtyContractAddress = addresses[networkID].LQTY.toLowerCase();

  let mistPrice = await getTokenPrice("alchemist");
  let mistContractAddress = addresses[networkID].MIST.toLowerCase();

  // set addresses & pricing in dictionary
  let usdValues: { [key: string]: number } = {};
  usdValues[ohmContractAddress] = ohmPrice;
  usdValues[ohmLusdContractAddress] = Number(ohmLusdPrice.toString());
  usdValues[lqtyContractAddress] = lqtyPrice;
  usdValues[mistContractAddress] = mistPrice;

  // console.log("usdValues", usdValues);
  let totalRemainingRewards = 0;
  let remainingDurations: number[] = [];
  let pastDurations: number[] = [];
  let dt_now = Date.now() / 1000;

  // console.log("aludelData", aludelData);
  // map through all fund() calls
  aludelData.rewardSchedules.map((rs: { start: BigNumber; duration: BigNumber; shares: BigNumber }) => {
    let rewardStart: number = parseFloat(rs.start.toString());
    let rewardDuration: number = parseFloat(rs.duration.toString());

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
  let avgRemainingDuration = remainingDurations.reduce((a, b) => a + b, 0) / remainingDurations.length;

  // furthest start date for past funds
  let oldestDepositDate = Math.max.apply(null, pastDurations);

  // rewardToken is OHM for this Crucible
  const rewardTokenContract = new ethers.Contract(
    aludelData.rewardToken as string,
    UniswapIERC20ABI,
    provider,
  ) as UniswapIERC20;

  let rewardTokenDecimals = await rewardTokenContract.decimals();
  // let rewardTokenDecimals = 9;

  let rewardPoolBalance = await rewardTokenContract.balanceOf(aludelData.rewardPool);
  // balance of rewardToken in pool
  let rewardTokenQuantity = Number(rewardPoolBalance.toString()) / 10 ** rewardTokenDecimals;

  // amount of bonus tokens in program
  const bonusTokensLength = (await aludelContract.getBonusTokenSetLength()) as BigNumber;
  const bonusTokensLengthNumber = Number(bonusTokensLength.toString());

  let bonusTokenUsdValues: number[] = [];

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
  let totalUsdValueOfBonusTokens = bonusTokenUsdValues.reduce((a, b) => a + b, 0);

  // scale shares to token decimals + base share (10 ** 6)
  let rewardsRemainingValue = totalRemainingRewards / 10 ** (rewardTokenDecimals + 6);

  // usd value of rewardToken
  let rewardTokenUsdValue = usdValues[aludelData.rewardToken.toLowerCase()];

  // usd value of rewardToken to be released
  let rewardsRemainingValueUsd = rewardsRemainingValue * rewardTokenUsdValue;

  // amount of rewardToken that are released
  let rewardsPreviouslyReleased = rewardTokenQuantity - rewardsRemainingValue;

  // percentage of rewardToken that are released
  let rewardsReleasedPercentage = rewardsPreviouslyReleased / rewardTokenQuantity;

  // usd value of rewardToken that are released
  let rewardsPreviouslyReleasedUsdValue = rewardsPreviouslyReleased * rewardTokenUsdValue;

  let lusdContract = new ethers.Contract(lusdContractAddress, UniswapIERC20ABI, provider) as UniswapIERC20;

  let stakedOhm =
    Number((await rewardTokenContract.balanceOf(aludelData.stakingToken)).toString()) / 10 ** rewardTokenDecimals;
  // 18 decimals for LUSD
  let stakedLusd = Number((await lusdContract.balanceOf(aludelData.stakingToken)).toString()) / 10 ** 18;

  let totalStakedTokensUsd = stakedOhm * ohmPrice + stakedLusd * lusdPrice;

  let stakingTokenContract = new ethers.Contract(aludelData.stakingToken, UniswapIERC20ABI, provider) as UniswapIERC20;
  let sushiTokenSupply = Number((await stakingTokenContract.totalSupply()).toString()) / 10 ** 18;
  // total stake of stakingToken with 18 decimals
  let aludelTotalStakedTokens = Number(aludelData.totalStake.toString()) / 10 ** 18;
  // total usd value of staked stakingToken is the percent of aludel-staked over sushi-staked times sushi staked USD
  let aludelTotalStakedTokensUsd = (aludelTotalStakedTokens / sushiTokenSupply) * totalStakedTokensUsd;

  let secs_in_year = 365 * 24 * 60 * 60;

  // future rewards multiplier based on avg future rewards duration
  let remainingTime = secs_in_year / avgRemainingDuration || 0;

  // past rewards multiplier based on ealiest rewardShedule start date
  let pastTime = secs_in_year / oldestDepositDate || 1;

  let numerator =
    // calculate apy from released rewardToken
    rewardsPreviouslyReleasedUsdValue * pastTime +
    // calculate apy from released bonus tokens based on rewardToken released percentage
    totalUsdValueOfBonusTokens * rewardsReleasedPercentage * pastTime +
    // calculate apy from future released rewardToken
    rewardsRemainingValueUsd * remainingTime +
    // calculate apy from future released bonus tokens based on rewardToken released percentage
    totalUsdValueOfBonusTokens * (1 - rewardsReleasedPercentage) * remainingTime;

  // divide apy based on value of staked stakingToken
  let averageApy = (numerator / aludelTotalStakedTokensUsd) * 100;

  return {
    averageApy: averageApy,
    tvlUsd: aludelTotalStakedTokensUsd,
  };
};
