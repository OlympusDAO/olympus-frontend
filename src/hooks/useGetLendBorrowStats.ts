import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DefiLlamaPool, getOhmPools } from "src/hooks/useGetLPStats";

type LendAndBorrow = {
  apyBaseBorrow: number;
  apyRewardBorrow: number;
  borrowFactor: number | null;
  debtCeilingUsd: number | null;
  ltv: number;
  mintedCoin: string | null;
  pool: string;
  rewardTokens: string[];
  totalBorrowUsd: number;
  totalSupplyUsd: number;
  underlyingTokens: string[];
};
export const useGetLendAndBorrowStats = () => {
  const defillamaAPI = "https://yields.llama.fi/lendBorrow";
  const { data, isFetched, isLoading } = useQuery(["GetLendBorrowStats"], async () => {
    const ohmPools = await getOhmPools();
    console.log(ohmPools, "ohmPools");
    const lendAndBorrowPools = await axios.get<LendAndBorrow[]>(defillamaAPI).then(res => {
      return res.data;
    });
    const ohmLendAndBorrowPools = ohmPools.filter(pool =>
      lendAndBorrowPools.some(lendAndBorrowPool => lendAndBorrowPool.pool === pool.id),
    );
    const poolsAndLendBorrowStats = ohmLendAndBorrowPools.map(pool => {
      const lendBorrowPool = lendAndBorrowPools.find(lendAndBorrowPool => lendAndBorrowPool.pool === pool.id);
      return { ...pool, lendAndBorrow: lendBorrowPool };
    });
    return poolsAndLendBorrowStats;
  });

  return { data, isFetched, isLoading };
};

export interface LendAndBorrowPool extends DefiLlamaPool {
  lendAndBorrow: LendAndBorrow;
}
