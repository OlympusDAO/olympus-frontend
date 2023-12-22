import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetLPStats = (exposure?: string) => {
  const { data, isFetched, isLoading } = useQuery(["GetLPStats", exposure], async () => {
    const ohmPools = await getOhmPools();

    const ohmPoolsFilters = ohmPools.filter(pool => pool.exposure === exposure || "multi");
    return ohmPoolsFilters;
  });

  return { data, isFetched, isLoading };
};

export const getOhmPools = async () => {
  const defillamaAPI = "https://yields.llama.fi/pools";
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
      .map(pool => {
        return { ...pool, ...mapProjectToName(pool.project), id: pool.pool };
      });
  });
};

export const mapProjectToName = (project: string) => {
  switch (project) {
    case "balancer-v2":
      return { projectName: "Balancer" };
    case "curve-dex":
    case "curve":
      return { projectName: "Curve" };
    case "aura":
      return { projectName: "Aura" };
    case "convex-finance":
      return { projectName: "Convex" };
    case "uniswap-v3":
      return { projectName: "Uniswap V3" };
    case "uniswap-v2":
      return { projectName: "Uniswap V2" };
    case "sushiswap":
      return { projectName: "Sushiswap" };
    case "stakedao":
      return { projectName: "StakeDAO" };
    case "joe-v2.1":
    case "trader-joe-dex":
      return { projectName: "Trader Joe" };
    case "pickle":
      return { projectName: "Pickle" };
    case "beefy":
      return { projectName: "Beefy" };
    case "frax":
      return { projectName: "Frax" };
    case "beethoven-x":
      return { projectName: "Beethoven X" };
    case "yearn-finance":
      return { projectName: "Yearn" };
    case "olympus-dao":
      return { projectName: "Olympus" };
    case "gamma":
      return { projectName: "Gamma" };
    case "ramses-v1":
      return { projectName: "Ramses" };
    case "chronos":
      return { projectName: "Chronos" };
    case "sentiment":
      return { projectName: "Sentiment" };
    case "midas-capital":
      return { projectName: "Midas Capital" };
    case "silo-finance":
      return { projectName: "Silo Finance" };
    case "inverse-finance-firm":
      return { projectName: "Inverse Finance" };
    case "fraxlend":
      return {
        projectName: "Frax",
      };
    default:
      return { projectName: project };
  }
};

export interface defillamaAPI {
  data: DefiLlamaPool[];
}

export interface DefiLlamaPool {
  id: string;
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
  projectName: string;
  rewardTokens?: string[];
  sigma?: number;
  stablecoin?: boolean;
  symbol: string;
  tvlUsd?: number;
  underlyingTokens: string[];
  volumeUsd1d?: number;
  volumeUsd7d?: number;
  project: string;
}
