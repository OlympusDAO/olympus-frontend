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
      return { projectName: "Balancer", projectLink: "https://app.balancer.fi/" };
    case "curve-dex":
    case "curve":
      return { projectName: "Curve", projectLink: "https://curve.fi/#/ethereum/pools" };
    case "aura":
      return { projectName: "Aura", projectLink: "https://app.aura.finance/" };
    case "convex-finance":
      return { projectName: "Convex", projectLink: "https://www.convexfinance.com/stake" };
    case "uniswap-v3":
      return { projectName: "Uniswap V3", projectLink: "https://app.uniswap.org/#/pool" };
    case "uniswap-v2":
      return { projectName: "Uniswap V2", projectLink: "https://app.uniswap.org/#/pool" };
    case "sushiswap":
      return { projectName: "Sushiswap", projectLink: "https://app.sushi.com/pool" };
    case "stakedao":
      return { projectName: "StakeDAO", projectLink: "https://lockers.stakedao.org/" };
    case "joe-v2.1":
    case "trader-joe-dex":
      return { projectName: "Trader Joe", projectLink: "https://traderjoexyz.com/" };
    case "pickle":
      return { projectName: "Pickle", projectLink: "https://app.pickle.finance/farms" };
    case "beefy":
      return { projectName: "Beefy", projectLink: "https://app.beefy.finance/" };
    case "frax":
      return { projectName: "Frax", projectLink: "https://app.frax.finance/staking/overview" };
    case "beethoven-x":
      return { projectName: "Beethoven X", projectLink: "https://beets.fi/pools" };
    case "yearn-finance":
      return { projectName: "Yearn", projectLink: "https://yearn.finance/vaults" };
    case "olympus-dao":
      return {
        projectName: "Olympus",
        projectLink: "https://app.olympusdao.finance/#/liquidity/vaults",
      };
    case "gamma":
      return { projectName: "Gamma", projectLink: "https://app.gamma.xyz/" };
    case "ramses-v1":
      return { projectName: "Ramses", projectLink: "https://app.ramses.exchange/liquidity" };
    case "chronos":
      return { projectName: "Chronos", projectLink: "https://app.chronos.exchange/liquidity" };
    case "sentiment":
      return { projectName: "Sentiment", projectLink: "https://arbitrum.sentiment.xyz/borrow/OHM?symbol=USDC.e" };
    case "midas-capital":
      return { projectName: "Midas Capital", projectLink: "https://app.midascapital.xyz/42161/pool/1" };
    case "silo-finance":
      return { projectName: "Silo Finance", projectLink: "https://app.silo.finance/" };
    case "inverse-finance-firm":
      return { projectName: "Inverse Finance", projectLink: "https://www.inverse.finance/firm" };
    case "fraxlend":
      return {
        projectName: "Frax",
        projectLink: "https://app.frax.finance/fraxlend/pair?address=0x66bf36dBa79d4606039f04b32946A260BCd3FF52",
      };
    default:
      return { projectName: project, projectLink: "" };
  }
};

export interface defillamaAPI {
  data: DefiLlamaPool[];
}

export interface DefiLlamaPool {
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
  projectLink: string;
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
