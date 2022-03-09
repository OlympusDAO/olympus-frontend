import { NetworkId } from "src/constants";
import { ExternalPool } from "src/lib/ExternalPool";

export const tj_gohm_wavax = new ExternalPool({
  poolName: "gOHM-AVAX",
  icons: ["wsOHM", "AVAX"],
  stakeOn: "Trader Joe (Avalanche)",
  pairGecko: "avalanche-2",
  href: "https://traderjoexyz.com/farm/0xB674f93952F02F2538214D4572Aa47F262e990Ff-0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00",
  address: "0xb674f93952f02f2538214d4572aa47f262e990ff",
  masterchef: "0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00",
  networkID: NetworkId.AVALANCHE,
});

export const pango_gohm_wavax = new ExternalPool({
  poolName: "gOHM-AVAX",
  icons: ["wsOHM", "AVAX"],
  stakeOn: "Pangolin",
  pairGecko: "avalanche-2",
  href: "https://app.pangolin.exchange/#/png/0x321E7092a180BB43555132ec53AaA65a5bF84251/AVAX/2",
  address: "0xb68f4e8261a4276336698f5b11dc46396cf07a22",
  masterchef: "0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00",
  networkID: NetworkId.AVALANCHE,
});

export const sushi_arb_gohm_weth = new ExternalPool({
  poolName: "gOHM-wETH",
  icons: ["wsOHM", "wETH"],
  stakeOn: "Sushi (Arbitrum)",
  pairGecko: "ethereum",
  href: "https://app.sushi.com/farm?filter=2x",
  address: "0xaa5bD49f2162ffdC15634c87A77AC67bD51C6a6D",
  masterchef: "0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3",
  networkID: NetworkId.ARBITRUM,
});

export const sushi_poly_gohm_weth = new ExternalPool({
  poolName: "gOHM-wETH",
  icons: ["wsOHM", "wETH"],
  stakeOn: "Sushi (Polygon)",
  pairGecko: "ethereum",
  href: "https://app.sushi.com/farm?filter=2x",
  address: "0x1549e0e8127d380080aab448b82d280433ce4030",
  masterchef: "0x0769fd68dFb93167989C6f7254cd0D766Fb2841F",
  networkID: NetworkId.POLYGON,
});

export const spirit_gohm_ftm = new ExternalPool({
  poolName: "gOHM-FTM",
  icons: ["wsOHM", "FANTOM"],
  stakeOn: "Spirit (Fantom)",
  pairGecko: "fantom",
  href: "https://app.spiritswap.finance/#/farms/allfarms",
  address: "0xae9BBa22E87866e48ccAcFf0689AFaa41eB94995",
  masterchef: "0xb3AfA9CB6c53d061bC2263cE15357A691D0D60d4",
  networkID: NetworkId.FANTOM,
});

// export const allPools = [tj_gohm_wavax, pango_gohm_wavax, sushi_arb_gohm_weth, sushi_poly_gohm_weth];
export const allPools = [tj_gohm_wavax, sushi_arb_gohm_weth, sushi_poly_gohm_weth, spirit_gohm_ftm];

export default allPools;
