import { useQuery } from "react-query";
import { getTokenPrice, parseBigNumber } from "src/helpers";
import { createDependentQuery } from "src/helpers/react-query/createDependentQuery";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";
import {
  useStaticBeethovenChefContract,
  useStaticChefContract,
  useStaticChefRewarderContract,
  useStaticGaugeContract,
  useStaticJoeChefContract,
  useStaticJoeRewarderContract,
  useStaticJonesContract,
  useStaticZipRewarderContract,
  useStaticZipSecondaryRewardercontract,
} from "src/hooks/useContract";
import { useGohmPrice } from "src/hooks/usePrices";
import { ExternalPool } from "src/lib/ExternalPool";

import { BalancerPoolTVL, useStakePoolTVL } from "./useStakePoolTVL";

export const stakePoolAPYQueryKey = (pool: ExternalPool) => ["StakePoolAPY", pool].filter(nonNullable);

export const SushiPoolAPY = (pool: ExternalPool) => {
  const { data: tvl = 0 } = useStakePoolTVL(pool);
  const masterchef = useStaticChefContract(pool.masterchef, pool.networkID);
  const rewarder = useStaticChefRewarderContract(pool.rewarder, pool.networkID);

  const { data, isFetched, isLoading } = useQuery(["StakePoolAPY", pool], async () => {
    const rewardsPerWeek = parseBigNumber(await masterchef.sushiPerSecond(), 18) * 604800;
    const rewarderRewardsPerSecond = parseBigNumber(await rewarder.rewardPerSecond(), 18);
    const poolInfo = await masterchef.poolInfo(pool.poolId);
    const totalAllocPoint = parseBigNumber(await masterchef.totalAllocPoint(), 18);
    const poolRewardsPerWeek = (parseBigNumber(poolInfo.allocPoint, 18) / totalAllocPoint) * rewardsPerWeek;
    return { poolRewardsPerWeek, rewarderRewardsPerSecond };
  });
  const { data: apy = 0 } = APY(pool, tvl, data);
  return { apy, isFetched, isLoading };
};

export const JoePoolAPY = (pool: ExternalPool) => {
  const { data: tvl = 0 } = useStakePoolTVL(pool);
  const joechef = useStaticJoeChefContract(pool.masterchef, pool.networkID);
  const rewarder = useStaticJoeRewarderContract(pool.rewarder, pool.networkID);

  const { data, isFetched, isLoading } = useQuery(["StakePoolAPY", pool], async () => {
    const rewardsPerWeek = parseBigNumber(await joechef.joePerSec(), 18) * 604800;
    const rewarderRewardsPerSecond = parseBigNumber(await rewarder.tokenPerSec(), 18);

    const poolInfo = await joechef.poolInfo(pool.poolId);
    const totalAllocPoint = parseBigNumber(await joechef.totalAllocPoint(), 18);
    const poolRewardsPerWeek = (parseBigNumber(poolInfo.allocPoint, 18) / totalAllocPoint) * rewardsPerWeek;

    return { poolRewardsPerWeek, rewarderRewardsPerSecond };
  });
  const { data: apy = 0 } = APY(pool, tvl, data);
  return { apy, isFetched, isLoading };
};

export const SpiritPoolAPY = (pool: ExternalPool) => {
  const { data: tvl = 0 } = useStakePoolTVL(pool);
  //Spirit uses a Masterchef, Guage, and rewarder contract. Rewarder Not currently used for our FP.
  const gauge = useStaticGaugeContract(pool.masterchef, pool.networkID);
  const { data, isFetched, isLoading } = useQuery(["StakePoolAPY", pool], async () => {
    //Contract returns rewards per week. No additional calc required
    const poolRewardsPerWeek = parseBigNumber(await gauge.getRewardForDuration(), 18);
    return { poolRewardsPerWeek, rewarderRewardsPerSecond: 0 };
  });
  const { data: apy = 0 } = APY(pool, tvl, data);
  return { apy, isFetched, isLoading };
};

export const BeetsPoolAPY = (pool: ExternalPool) => {
  const { data: tvl = 0 } = BalancerPoolTVL(pool);
  const beethovenChef = useStaticBeethovenChefContract(pool.masterchef, pool.networkID);
  const beetsrewarder = useStaticChefRewarderContract(pool.rewarder, pool.networkID);
  const { data, isFetched, isLoading } = useQuery(["StakePoolAPY", pool], async () => {
    const rewardsPerWeek = parseBigNumber(await beethovenChef.beetsPerBlock(), 18) * 604800;
    const rewarderRewardsPerSecond = parseBigNumber(await beetsrewarder.rewardPerSecond(), 18);
    const poolInfo = await beethovenChef.poolInfo(pool.poolId);
    const totalAllocPoint = parseBigNumber(await beethovenChef.totalAllocPoint(), 18);
    const poolRewardsPerWeek = (parseBigNumber(poolInfo.allocPoint, 18) / totalAllocPoint) * rewardsPerWeek;
    return { poolRewardsPerWeek, rewarderRewardsPerSecond };
  });
  const { data: apy = 0 } = APY(pool, tvl, data);
  return { apy, isFetched, isLoading };
};

export const ZipPoolAPY = (pool: ExternalPool) => {
  const { data: tvl = 0 } = useStakePoolTVL(pool);
  const zipRewarderContract = useStaticZipRewarderContract(pool.masterchef, pool.networkID);
  const ZipSecondaryRewarderContract = useStaticZipSecondaryRewardercontract(pool.rewarder, pool.networkID);
  const { data, isFetched, isLoading } = useQuery(["StakePoolAPY", pool], async () => {
    const rewardsPerWeek = parseBigNumber(await zipRewarderContract.zipPerSecond(), 18) * 604800;
    const rewarderRewardsPerSecond = parseBigNumber(await ZipSecondaryRewarderContract.zipPerSecond(), 18);
    const poolInfo = await zipRewarderContract.poolInfo(pool.poolId);
    const totalAllocPoint = parseBigNumber(await zipRewarderContract.totalAllocPoint(), 18);
    const poolRewardsPerWeek = (parseBigNumber(poolInfo.allocPoint, 18) / totalAllocPoint) * rewardsPerWeek;
    return { poolRewardsPerWeek, rewarderRewardsPerSecond };
  });
  const { data: apy = 0 } = APY(pool, tvl, data);
  return { apy, isFetched, isLoading };
};
export const JonesPoolAPY = (pool: ExternalPool) => {
  const { data: tvl = 0 } = useStakePoolTVL(pool);
  //Spirit uses a Masterchef, Guage, and rewarder contract. Rewarder Not currently used for our FP.
  const jonesChef = useStaticJonesContract(pool.masterchef, pool.networkID);
  const { data, isFetched, isLoading } = useQuery(["StakePoolAPY", pool], async () => {
    const periodFinish = await jonesChef.periodFinish();
    const rewardRate = await jonesChef.rewardRateJONES();
    const boost = await jonesChef.boost();
    const boostedFinish = await jonesChef.boostedFinish();
    const poolRewardsPerWeek =
      Date.now() / 1000 > parseBigNumber(periodFinish, 0)
        ? 0
        : ((Date.now() / 1000 > parseBigNumber(boostedFinish, 0)
            ? parseBigNumber(rewardRate, 0)
            : parseBigNumber(rewardRate) * parseBigNumber(boost)) /
            1e18) *
          604800;
    return { poolRewardsPerWeek, rewarderRewardsPerSecond: 0 };
  });

  const { data: apy = 0 } = APY(pool, tvl, data);
  return { apy, isFetched, isLoading };
};

const APY = (
  pool: ExternalPool,
  tvl: number,
  data?: { poolRewardsPerWeek: number; rewarderRewardsPerSecond: number },
) => {
  const useDependentQuery = createDependentQuery(stakePoolAPYQueryKey(pool));
  const { data: gohmPrice } = useGohmPrice();
  const rewardPrice = useDependentQuery("rewardPrice", () => getTokenPrice(pool.rewardGecko));
  return useQuery<number, Error>(
    ["APY", pool],
    () => {
      queryAssertion(gohmPrice && rewardPrice && tvl && data);
      const rewarderRewardsPerWeek = data.rewarderRewardsPerSecond * 604800;
      const baseRewardAPY = ((data.poolRewardsPerWeek * rewardPrice) / tvl) * 52;
      const bonusRewardsAPY = ((rewarderRewardsPerWeek * gohmPrice) / tvl) * 52;
      return baseRewardAPY + bonusRewardsAPY;
    },
    { enabled: !!tvl && !!gohmPrice && !!rewardPrice && !!data },
  );
};
