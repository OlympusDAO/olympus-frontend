import { useQuery } from "react-query";
import { GOHM_ADDRESSES } from "src/constants/addresses";
import { createDependentQuery, getTokenPrice, nonNullable, parseBigNumber, queryAssertion } from "src/helpers";
import { useStaticPairContract } from "src/hooks/useContract";
import { useGohmPrice } from "src/hooks/usePrices";
import { ExternalPool } from "src/lib/ExternalPool";

export const stakePoolTVLQueryKey = (poolAddress: string) => ["useStakePoolTVL", poolAddress].filter(nonNullable);

export const useStakePoolTVL = (pool: ExternalPool) => {
  const contract = useStaticPairContract(pool.address, pool.networkID);

  const useDependentQuery = createDependentQuery(stakePoolTVLQueryKey(pool.address));

  // Get dependent data in parallel
  const { data: gohmPrice } = useGohmPrice();
  const reserves = useDependentQuery("reserves", () => contract.getReserves());
  const firstTokenAddress = useDependentQuery("firstTokenAddress", () => contract.token0());
  const poolTokenSupply = useDependentQuery("poolTokenSupply", () => contract.totalSupply());
  const stakedBalance = useDependentQuery("stakedBalance", () => contract.balanceOf(pool.masterchef));
  const nonGohmTokenPrice = useDependentQuery("nonGohmTokenPrice", () => getTokenPrice(pool.pairGecko));

  return useQuery<number, Error>(
    stakePoolTVLQueryKey(pool.address),
    async () => {
      queryAssertion(
        gohmPrice && stakedBalance && poolTokenSupply && reserves && nonGohmTokenPrice && firstTokenAddress,
        stakePoolTVLQueryKey(pool.address),
      );

      const isFirstTokenGohm =
        firstTokenAddress.toLowerCase() ===
        GOHM_ADDRESSES[pool.networkID as keyof typeof GOHM_ADDRESSES]?.toLowerCase();

      const firstTokenPrice = isFirstTokenGohm ? gohmPrice : nonGohmTokenPrice;
      const secondTokenPrice = isFirstTokenGohm ? nonGohmTokenPrice : gohmPrice;

      const totalLpAsUSD =
        parseBigNumber(reserves[0], 18) * firstTokenPrice + parseBigNumber(reserves[1], 18) * secondTokenPrice;

      const totalValueLocked = (totalLpAsUSD * parseBigNumber(stakedBalance, 18)) / parseBigNumber(poolTokenSupply, 18);

      return totalValueLocked;
    },
    {
      enabled:
        !!gohmPrice && !!stakedBalance && !!poolTokenSupply && !!reserves && !!nonGohmTokenPrice && !!firstTokenAddress,
    },
  );
};
