import { NetworkId } from "src/constants";
import { ExternalPool } from "src/lib/ExternalPool";

export const balancer_ohm_dai_weth = new ExternalPool({
  poolName: "OHM-DAI-wETH",
  icons: ["OHM", "DAI", "wETH"],
  stakeOn: "Balancer",
  pairGecko: "ethereum",
  rewardGecko: "gOHM",
  href: "https://app.balancer.fi/#/pool/0xc45d42f801105e861e86658648e3678ad7aa70f900010000000000000000011e",
  address: "0xc45D42f801105e861e86658648e3678aD7aa70f9",
  masterchef: "0xc45D42f801105e861e86658648e3678aD7aa70f9", //not currenly incentivized
  rewarder: "", //not currenly incentivized
  vault: "0xba12222222228d8ba445958a75a0704d566bf2c8",
  poolId: "0xc45d42f801105e861e86658648e3678ad7aa70f900010000000000000000011e",
  networkID: NetworkId.MAINNET,
});

export const curve_ohm_eth = new ExternalPool({
  poolName: "OHM-ETH",
  icons: ["OHM", "ETH"],
  stakeOn: "Curve",
  pairGecko: "ethereum",
  rewardGecko: "curve-dao-token",
  href: "https://curve.fi/factory-crypto/21/deposit",
  address: "0x6ec38b3228251a0C5D491Faf66858e2E23d7728B", //Pool
  masterchef: "0x2F50D538606Fa9EDD2B11E2446BEb18C9D5846bB", //Gauge Controller
  rewarder: "0x8dF6FdAe05C9405853dd4cF2809D5dc2b5E77b0C", //Gauge Deposit
  poolId: 21,
  networkID: NetworkId.MAINNET,
});

export const convex_ohm_eth = new ExternalPool({
  poolName: "OHM-ETH",
  icons: ["OHM", "ETH"],
  stakeOn: "Convex",
  pairGecko: "ethereum",
  rewardGecko: "curve-dao-token",
  href: "https://www.convexfinance.com/stake",
  address: "0x3660BD168494d61ffDac21E403d0F6356cF90fD7", //LP
  masterchef: "0xF403C135812408BFbE8713b5A23a04b3D48AAE31", //deposit
  rewarder: "0xd683C7051a28fA150EB3F4BD92263865D4a67778",
  poolId: 92,
  networkID: NetworkId.MAINNET,
});

export const frax_ohm_frax = new ExternalPool({
  poolName: "OHM-FRAX",
  icons: ["OHM", "FRAX"],
  stakeOn: "Fraxswap",
  pairGecko: "frax",
  rewardGecko: "frax",
  href: "https://app.frax.finance/staking/fraxswap-v2-frax-ohm",
  address: "0x5769071665eb8Db80e7e9226F92336Bb2897DCFA", //LP
  masterchef: "", //deposit
  rewarder: "",
  poolId: 0,
  networkID: NetworkId.MAINNET,
  mintAndSync: true,
});

export const balancerPools = [balancer_ohm_dai_weth];
export const curvePools = [curve_ohm_eth];
export const convexPools = [convex_ohm_eth];
export const fraxPools = [frax_ohm_frax];
