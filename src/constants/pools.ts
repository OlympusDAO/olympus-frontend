import { LiquidityPool } from "src/helpers/contracts/LiquidityPool";

import { OHM_DAI_LP_ADDRESSES, OHM_LUSD_LP_ADDRESSES } from "./addresses";

export const OHM_DAI_LP = new LiquidityPool({ name: "OHM-DAI LP", addresses: OHM_DAI_LP_ADDRESSES });
export const OHM_LUSD_LP = new LiquidityPool({ name: "OHM-DAI LP", addresses: OHM_LUSD_LP_ADDRESSES });
