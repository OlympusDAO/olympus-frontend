import { LiquidityPool } from "src/helpers/contracts/LiquidityPool/LiquidityPool";
import { NetworkId } from "src/networkDetails";

export const OHM_DAI_POOL = new LiquidityPool({
  name: "OHM-DAI Liquidity Pool Contract",
  addresses: {
    [NetworkId.MAINNET]: "0x055475920a8c93CfFb64d039A8205F7AcC7722d3",
  },
});

export const OHM_LUSD_POOL = new LiquidityPool({
  name: "OHM-LUSD Liquidity Pool Contract",
  addresses: {
    [NetworkId.MAINNET]: "0x46E4D8A1322B9448905225E52F914094dBd6dDdF",
  },
});
