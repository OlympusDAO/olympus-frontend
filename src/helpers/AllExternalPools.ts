import { NetworkId } from "src/constants";
import { ExternalPool } from "src/lib/ExternalPool";

export const tj_gohm_wavax = new ExternalPool({
  poolName: "gOHM-AVAX",
  icons: ["wsOHM", "AVAX"],
  stakeOn: "Trader Joe",
  pairGecko: "avalanche-2",
  rewardGecko: "joe",
  href: "https://traderjoexyz.com/farm/0xB674f93952F02F2538214D4572Aa47F262e990Ff-0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00",
  address: "0xb674f93952f02f2538214d4572aa47f262e990ff",
  masterchef: "0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00",
  rewarder: "0xe65C29f1C40b52cF3a601a60df6ad37c59Af1261",
  poolId: 21,
  networkID: NetworkId.AVALANCHE,
});

export const beets_ftm_gohm_wFTM = new ExternalPool({
  poolName: "gOHM-wFTM",
  icons: ["gOHM", "FANTOM"],
  stakeOn: "Beethoven",
  pairGecko: "fantom",
  rewardGecko: "beethoven-x",
  href: "https://beets.fi/#/pool/0xf7bf0f161d3240488807ffa23894452246049916000200000000000000000198",
  address: "0xf7bf0f161d3240488807ffa23894452246049916",
  masterchef: "0x8166994d9ebBe5829EC86Bd81258149B87faCfd3",
  rewarder: "0xbb7653737917Db58133629C190b9cA2FffB80e71",
  vault: "0x20dd72ed959b6147912c2e529f0a0c651c33c9ce",
  poolId: 40,
  networkID: NetworkId.FANTOM,
});

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

export const sushi_arb_gohm_weth = new ExternalPool({
  poolName: "gOHM-wETH",
  icons: ["wsOHM", "wETH"],
  stakeOn: "Sushi",
  pairGecko: "ethereum",
  rewardGecko: "sushi",
  href: "https://app.sushi.com/farm?filter=2x",
  address: "0xaa5bD49f2162ffdC15634c87A77AC67bD51C6a6D",
  masterchef: "0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3",
  rewarder: "0xAE961A7D116bFD9B2534ad27fE4d178Ed188C87A",
  poolId: 12,
  networkID: NetworkId.ARBITRUM,
});

export const sushi_poly_gohm_weth = new ExternalPool({
  poolName: "gOHM-wETH",
  icons: ["wsOHM", "wETH"],
  stakeOn: "Sushi",
  pairGecko: "ethereum",
  rewardGecko: "sushi",
  href: "https://app.sushi.com/farm?filter=2x",
  address: "0x1549e0e8127d380080aab448b82d280433ce4030",
  masterchef: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
  rewarder: "0x71581bF0ce397f50F87Cc2490146D30A1E686461",
  poolId: 47,
  networkID: NetworkId.POLYGON,
});

export const spirit_gohm_ftm = new ExternalPool({
  poolName: "gOHM-FTM",
  icons: ["wsOHM", "FANTOM"],
  stakeOn: "Spirit",
  pairGecko: "fantom",
  rewardGecko: "spiritswap",
  href: "https://app.spiritswap.finance/#/farms/allfarms",
  address: "0xae9BBa22E87866e48ccAcFf0689AFaa41eB94995",
  masterchef: "0xb3AfA9CB6c53d061bC2263cE15357A691D0D60d4",
  rewarder: "",
  poolId: 0,
  networkID: NetworkId.FANTOM,
});

export const zip_gohm_weth = new ExternalPool({
  poolName: "gOHM-wETH",
  icons: ["gOHM", "wETH"],
  stakeOn: "Zipswap",
  pairGecko: "ethereum",
  rewardGecko: "zipswap",
  href: "https://zipswap.fi/#/farm/0x3f6da9334142477718bE2ecC3577d1A28dceAAe1",
  address: "0x3f6da9334142477718bE2ecC3577d1A28dceAAe1",
  masterchef: "0x1e2F8e5f94f366eF5Dc041233c0738b1c1C2Cb0c",
  rewarder: "0x10400eB8f8A44630cb703cd3A6DF4Ba0aFCB6E60",
  poolId: 5,
  networkID: NetworkId.OPTIMISM,
});

export const jones_gohm_jgohm = new ExternalPool({
  poolName: "jgOHM-gOHM",
  icons: ["jgOHM", "gOHM"],
  stakeOn: "Jones DAO",
  pairGecko: "governance-ohm",
  rewardGecko: "jones-dao",
  href: "https://jonesdao.io/farms",
  address: "0x292d1587a6Bb37E34574c9AD5993F221D8a5616C",
  masterchef: "0x7eCe38dBE9D61D0d9Bf2D804A87A7d21b5937a56",
  rewarder: "",
  poolId: 0,
  networkID: NetworkId.ARBITRUM,
});

export const oolong_gohm_weth = new ExternalPool({
  poolName: "wETH-gOHM",
  icons: ["wETH", "gOHM"],
  stakeOn: "OolongSwap",
  pairGecko: "ethereum",
  rewardGecko: "oolongswap",
  bonusGecko: "boba-network",
  href: "https://oolongswap.com/#/farm/lp",
  address: "0x82d5dce44eddb117f6cca21229ced03965c9e0bb",
  masterchef: "0xd0e6dfA5E5511e138BfCDDaDdF70FDBa2Ab8396C",
  rewarder: "0xfafF71171ED44d3b1E14f15EE7ee2E0fD2bF22Ae",
  poolId: 12,
  networkID: NetworkId.BOBA,
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

export const allPools = [tj_gohm_wavax, sushi_arb_gohm_weth, sushi_poly_gohm_weth, spirit_gohm_ftm];
export const sushiPools = [sushi_arb_gohm_weth, sushi_poly_gohm_weth];
export const spiritPools = [spirit_gohm_ftm];
export const joePools = [tj_gohm_wavax];
export const beetsPools = [beets_ftm_gohm_wFTM];
export const zipPools = [zip_gohm_weth];
export const jonesPools = [jones_gohm_jgohm];
export const balancerPools = [balancer_ohm_dai_weth];
export const bobaPools = [oolong_gohm_weth];
export const curvePools = [curve_ohm_eth];
export const convexPools = [convex_ohm_eth];
export default allPools;
