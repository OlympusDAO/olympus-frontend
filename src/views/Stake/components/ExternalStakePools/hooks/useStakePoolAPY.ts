import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { gql, request } from "graphql-request";
import { getTokenPrice, parseBigNumber } from "src/helpers";
import { nonNullable } from "src/helpers/types/nonNullable";
import {
  useStaticBalancerV2PoolContract,
  useStaticCurveGaugeControllerContract,
  useStaticCurveGaugeDepositContract,
  useStaticCurvePoolContract,
} from "src/hooks/useContract";
import { ExternalPool } from "src/lib/ExternalPool";
import { useProvider } from "wagmi";

export const stakePoolAPYQueryKey = (pool: ExternalPool) => ["StakePoolAPY", pool].filter(nonNullable);

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
  } = useQuery(["AllSwapFees", address], async () => {
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
