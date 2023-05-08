import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetLPStats = () => {
  const defillamaAPI = "https://yields.llama.fi/pools";
  const { data, isFetched, isLoading } = useQuery(["GetLPStats"], async () => {
    return await axios.get<defillamaAPI>(defillamaAPI).then(res => {
      return res.data.data
        .filter(
          pool =>
            pool.symbol.split("-")[0] === "OHM" ||
            pool.symbol.split("-")[0] === "GOHM" ||
            pool.symbol.split("-")[1] === "GOHM" ||
            pool.symbol.split("-")[1] === "OHM" ||
            pool.symbol.split("-")[0] === "OHMFRAXBP",
        )
        .filter(pool => pool.apy !== 0 && pool.exposure !== "single")
        .map(pool => {
          return { ...pool, project: { ...mapProjectToName(pool.project) } };
        });
    });
  });

  return { data, isFetched, isLoading };
};

const mapProjectToName = (project: string) => {
  switch (project) {
    case "balancer-v2":
      return { name: "Balancer", icon: "balancer", link: "https://app.balancer.fi/" };
    case "curve":
      return { name: "Curve", icon: "curve", link: "https://curve.fi/#/ethereum/pools" };
    case "aura":
      return { name: "Aura", icon: "aura", link: "https://app.aura.finance/" };
    case "convex-finance":
      return { name: "Convex", icon: "convex", link: "https://www.convexfinance.com/stake" };
    case "uniswap-v3":
      return { name: "Uniswap V3", icon: "uniswap", link: "https://app.uniswap.org/#/pool" };
    case "uniswap-v2":
      return { name: "Uniswap V2", icon: "uniswap", link: "https://app.uniswap.org/#/pool" };
    case "sushiswap":
      return { name: "Sushiswap", icon: "sushiswap", link: "https://app.sushi.com/pool" };
    case "stakedao":
      return { name: "StakeDAO", icon: "stakedao", link: "https://lockers.stakedao.org/" };
    case "trader-joe-dex":
      return { name: "Trader Joe", icon: "traderjoe", link: "https://traderjoexyz.com/avalanche/pool" };
    case "pickle":
      return { name: "Pickle", icon: "pickle", link: "https://app.pickle.finance/farms" };
    case "beefy":
      return { name: "Beefy", icon: "beefy", link: "https://app.beefy.finance/" };
    case "frax":
      return { name: "Frax", icon: "frax", link: "https://app.frax.finance/staking/overview" };
    case "beethoven-x":
      return { name: "Beethoven X", icon: "beethovenx", link: "https://beets.fi/pools" };
    case "yearn-finance":
      return { name: "Yearn", icon: "yearn", link: "https://yearn.finance/vaults" };
  }
};

export interface defillamaAPI {
  data: {
    apy?: number;
    apyBase?: number;
    apyBase7d?: number;
    apyBaseInception?: number;
    apyMean30d?: number;
    apyPct1D?: number;
    apyPct7D?: number;
    apyPct30D?: number;
    apyReward?: number;
    chain: string;
    count?: number;
    exposure?: string;
    il7d?: number;
    ilRisk?: string;
    mu?: number;
    outlier?: boolean;
    pool: string;
    poolMeta?: string;
    predictions?: {
      predictedClass: string;
      predictedProbability: number;
      binnedConfidence: number;
    };
    project: string;
    rewardTokens?: string[];
    sigma?: number;
    stablecoin?: boolean;
    symbol: string;
    tvlUsd?: number;
    underlyingTokens: string[];
    volumeUsd1d?: number;
    volumeUsd7d?: number;
  }[];
}
