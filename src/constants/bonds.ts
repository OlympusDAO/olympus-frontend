import { Bond } from "src/helpers/bonds/Bond";

import { OHM_DAI_LP_TOKEN, OHM_LUSD_LP_TOKEN, OHM_TOKEN, OHM_WETH_LP_TOKEN } from "./tokens";

export const OHM_DAI_LP_BOND = new Bond({ baseToken: OHM_TOKEN, quoteToken: OHM_DAI_LP_TOKEN });
export const OHM_LUSD_LP_BOND = new Bond({ baseToken: OHM_TOKEN, quoteToken: OHM_LUSD_LP_TOKEN });
export const OHM_WETH_LP_BOND = new Bond({ baseToken: OHM_TOKEN, quoteToken: OHM_WETH_LP_TOKEN });

export const BONDS: Record<string, Bond> = {
  "25": OHM_DAI_LP_BOND,
  "27": OHM_LUSD_LP_BOND,
  "28": OHM_DAI_LP_BOND,
  "29": OHM_WETH_LP_BOND,
};
