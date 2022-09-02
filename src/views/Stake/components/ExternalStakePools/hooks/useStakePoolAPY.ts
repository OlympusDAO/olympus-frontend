import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { gql, request } from "graphql-request";
import { getTokenPrice, parseBigNumber } from "src/helpers";
import { createDependentQuery } from "src/helpers/react-query/createDependentQuery";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";
import {
  useStaticBalancerV2PoolContract,
  useStaticBeethovenChefContract,
  useStaticChefContract,
  useStaticChefRewarderContract,
  useStaticCurveGaugeControllerContract,
  useStaticCurveGaugeDepositContract,
  useStaticCurvePoolContract,
  useStaticJoeChefContract,
  useStaticJoeRewarderContract,
} from "src/hooks/useContract";
import { useGohmPrice } from "src/hooks/usePrices";
import { ExternalPool } from "src/lib/ExternalPool";
import { BalancerPoolTVL, useStakePoolTVL } from "src/views/Stake/components/ExternalStakePools/hooks/useStakePoolTVL";
import { useProvider } from "wagmi";

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

//TODO: Add support for Rewarder/Gauge if pool becomes incentivized.
//Currently this only calculates APR based on swap fees since there is no concept of staking.
export const BalancerPoolAPY = (pool: ExternalPool) => {
  const { data: fees } = BalancerSwapFees(pool.address);
  const protocolFees = useStaticBalancerV2PoolContract("0xce88686553686DA562CE7Cea497CE749DA109f9F", pool.networkID);
  const { data, isFetched, isLoading } = useQuery(["BalancerPoolInfo", pool, fees], async () => {
    const protocolFee = await protocolFees.getSwapFeePercentage();
    return ((fees.dailyFees * (1 - parseBigNumber(protocolFee, 18))) / fees.totalLiquidity) * 365;
  });
  return { apy: data, isFetched, isLoading };
};

export const BalancerSwapFees = (address: string) => {
  const blocksPerDay = 6646; //Average 13 blocks per second MAINNET
  const provider = useProvider();
  const balancerURL = "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2";
  const {
    data = { dailyFees: 0, totalLiquidity: 0 },
    isFetched,
    isLoading,
  } = useQuery(["AllSwapFees"], async () => {
    const data = await request(
      balancerURL,
      gql`
        {
          pools(where: { address: "${address}" }) {
            totalSwapFee
            totalLiquidity
          }
        }
      `,
    );
    const latestBlock = await provider.getBlockNumber();
    const historicalBlock = latestBlock - blocksPerDay;
    const histData = await request(
      balancerURL,
      gql`
        {
          pools(where: { address: "${address}" }, block:{number:${historicalBlock}}) {
            totalSwapFee
            totalLiquidity
          }
        }
      `,
    );
    const dailyFees = data.pools[0].totalSwapFee - histData.pools[0].totalSwapFee;
    return { dailyFees, totalLiquidity: data.pools[0].totalLiquidity as number };
  });

  return { data, isFetched, isLoading };
};

export const CurvePoolAPY = (pool: ExternalPool) => {
  const { data: rewardAPY = 0 } = CurvePoolRewardAPY(pool);

  const curveAPI = "https://api.curve.fi/api/getFactoryAPYs?version=crypto";
  const {
    data = { apy: 0 },
    isFetched,
    isLoading,
  } = useQuery(["CurvePoolBaseAPY"], async () => {
    return await axios.get(curveAPI).then(res => {
      const apy = res.data.data.poolDetails.find(
        (pool: { poolAddress: string }) => pool.poolAddress == "0x6ec38b3228251a0C5D491Faf66858e2E23d7728B",
      );
      return apy;
    });
  });
  const apy = data.apy / 100 + rewardAPY;
  return { apy, isFetched, isLoading };
};

export const CurvePoolRewardAPY = (pool: ExternalPool) => {
  const curvePoolContract = useStaticCurvePoolContract(pool.address, pool.networkID);
  const curveGaugeControllerContract = useStaticCurveGaugeControllerContract(pool.masterchef, pool.networkID);
  const curveGaugeDepositContract = useStaticCurveGaugeDepositContract(pool.rewarder, pool.networkID);

  const { data, isFetched, isLoading } = useQuery(["CurvePoolRewardAPY"], async () => {
    const curvePrice = await getTokenPrice(pool.rewardGecko);
    const virtualPrice = parseBigNumber(await curvePoolContract.get_virtual_price(), 18);
    const lpPrice = parseBigNumber(await curvePoolContract.price_oracle(), 18);
    const inflationRate = parseBigNumber(await curveGaugeDepositContract.inflation_rate(), 18);
    const relativeWeight = parseBigNumber(
      await curveGaugeControllerContract["gauge_relative_weight(address)"](pool.rewarder),
      18,
    );
    const workingSupply = parseBigNumber(await curveGaugeDepositContract.totalSupply(), 18);

    //https://github.com/curvefi/brownie-tutorial/tree/main/lesson-19-applications-iii
    const tAPY = (curvePrice * inflationRate * relativeWeight * 12614400) / (workingSupply * virtualPrice * lpPrice);

    //scale down APY to mid range
    return tAPY * 0.75;
  });
  return { data, isFetched, isLoading };
};

//Returns Jones Pool APY and TVL. Response also returns TVL for the pool, unlike other queries.
export const JonesPoolAPY = (pool: ExternalPool) => {
  const jonesAPI = "https://data.jonesdao.io/api/v1/jones/farms/general";
  const {
    data = { apy: 0, liquidity_locked: 0 },
    isFetched,
    isLoading,
  } = useQuery(["JonesPoolAPY", pool.address], async () => {
    const results = await axios.get(jonesAPI).then(res => {
      const poolData = res.data.farms.find((lp: { lpToken: string }) => lp.lpToken == pool.address);
      console.log(poolData, "poolData");
      return poolData;
    });
    return results;
  });
  return { apy: data.apr / 100, tvl: data.totalStakedValue, isFetched, isLoading };
};

//Returns Convex Pool APY and TVL. Response also returns TVL for the pool, unlike other queries.
export const ConvexPoolAPY = (pool: ExternalPool) => {
  const convexAPI = "https://api.thegraph.com/subgraphs/name/convex-community/curve-pools";
  const {
    data = { cvxApr: 0, extraRewardsApr: 0, crvApr: 0, baseApr: 0, tvl: 0 },
    isFetched,
    isLoading,
  } = useQuery(["ConvexPoolAPY"], async () => {
    const data = await request(
      convexAPI,
      gql`
        { 
          pool(id:${pool.poolId}) {
            tvl
            crvApr
            cvxApr
            extraRewardsApr
            baseApr
          }
        }
      `,
    );
    return data.pool;
  });
  const apy = Number(data.cvxApr) + Number(data.extraRewardsApr) + Number(data.crvApr) + Number(data.baseApr);
  const tvl = data.tvl;
  return { apy, tvl, isFetched, isLoading };
};

//TODO: Add support for Rewarder/Gauge if pool becomes incentivized.
//Currently this only calculates APR based on swap fees since there is no concept of staking.
export const FraxPoolAPY = (pool: ExternalPool) => {
  const fraxAPI = "https://api.frax.finance/pools";
  const {
    data = { apy: 0, liquidity_locked: 0 },
    isFetched,
    isLoading,
  } = useQuery(["FraxPoolAPY", pool.address], async () => {
    const results = await axios.get(fraxAPI).then(res => {
      const apy = res.data.find((pool: { identifier: string }) => pool.identifier == "Fraxswap V2 FRAX/OHM");
      return apy;
    });
    return results;
  });
  return { apy: data.apy / 100, tvl: data.liquidity_locked, isFetched, isLoading };
};

const APY = (
  pool: ExternalPool,
  tvl: number,
  data?: { poolRewardsPerWeek: number; rewarderRewardsPerSecond: number },
  nongOHMBonus?: string,
) => {
  const useDependentQuery = createDependentQuery(stakePoolAPYQueryKey(pool));
  const { data: gohmPrice } = useGohmPrice();

  const bonusGecko = useDependentQuery("bonus", () => getTokenPrice(nongOHMBonus));
  const rewardPrice = useDependentQuery("rewardPrice", () => getTokenPrice(pool.rewardGecko));
  const bonusTokenPrice = nongOHMBonus ? bonusGecko : gohmPrice;
  return useQuery<number, Error>(
    ["APY", pool],
    () => {
      queryAssertion(bonusTokenPrice && rewardPrice && tvl && data);
      const rewarderRewardsPerWeek = data.rewarderRewardsPerSecond * 604800;
      const baseRewardAPY = ((data.poolRewardsPerWeek * rewardPrice) / tvl) * 52;
      const bonusRewardsAPY = ((rewarderRewardsPerWeek * bonusTokenPrice) / tvl) * 52;
      return baseRewardAPY + bonusRewardsAPY;
    },
    { enabled: !!tvl && !!gohmPrice && !!rewardPrice && !!data },
  );
};
