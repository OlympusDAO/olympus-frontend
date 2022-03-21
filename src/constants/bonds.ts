import { Bond } from "src/helpers/bonds/Bond/Bond";

import { LUSD_OHM_LP_TOKEN, OHM_DAI_LP_TOKEN, OHM_TOKEN } from "./contracts/tokens";

export const OHM_DAI_LP_BOND = new Bond({
  baseToken: OHM_TOKEN,
  quoteToken: OHM_DAI_LP_TOKEN,
});

export const OHM_LUSD_LP_BOND = new Bond({
  baseToken: OHM_TOKEN,
  quoteToken: LUSD_OHM_LP_TOKEN,
});
