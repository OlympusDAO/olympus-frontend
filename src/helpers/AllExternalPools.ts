import { ExternalPool } from "src/lib/ExternalPool";
import { ReactComponent as avaxImage } from "src/assets/tokens/AVAX.svg";
import { ReactComponent as gOhmImage } from "src/assets/tokens/token_wsOHM.svg";
import { ReactComponent as wEthImage } from "src/assets/tokens/wETH.svg";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { NetworkId } from "src/constants";

export const tj_gohm_wavax = new ExternalPool({
  poolName: "gOHM-AVAX",
  icons: [gOhmImage, avaxImage],
  stakeOn: "Trader Joe",
  apy: "11.08%",
  href: "https://traderjoexyz.com/#/farm/0xB674f93952F02F2538214D4572Aa47F262e990Ff-0x188bED1968b795d5c9022F6a0bb5931Ac4c18F00",
  address: "0xb674f93952f02f2538214d4572aa47f262e990ff",
  networkID: NetworkId.AVALANCHE,
});

export const pango_gohm_wavax = new ExternalPool({
  poolName: "gOHM-AVAX",
  icons: [gOhmImage, avaxImage],
  stakeOn: "Pangolin",
  apy: "11.08%",
  href: "https://app.pangolin.exchange/#/png/0x321E7092a180BB43555132ec53AaA65a5bF84251/AVAX/2",
  address: "0xb68f4e8261a4276336698f5b11dc46396cf07a22",
  networkID: NetworkId.AVALANCHE,
});

export const sushi_arb_gohm_weth = new ExternalPool({
  poolName: "gOHM-wETH",
  icons: [gOhmImage, wEthImage],
  stakeOn: "Sushi (Arbitrum)",
  apy: "11.08%",
  href: "https://app.sushi.com/farm?filter=2x",
  address: "0xaa5bD49f2162ffdC15634c87A77AC67bD51C6a6D",
  networkID: NetworkId.ARBITRUM,
});

export const sushi_poly_gohm_weth = new ExternalPool({
  poolName: "gOHM-wETH",
  icons: [gOhmImage, wEthImage],
  stakeOn: "Sushi (Polygon)",
  apy: "11.08%",
  href: "https://app.sushi.com/farm?filter=2x",
  address: "0x1549e0e8127d380080aab448b82d280433ce4030",
  networkID: NetworkId.POLYGON,
});

export const allPools = [tj_gohm_wavax, pango_gohm_wavax, sushi_arb_gohm_weth, sushi_poly_gohm_weth];

export default allPools;
