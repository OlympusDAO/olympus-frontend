import { OHM_DAI_LP_BOND, OHM_LUSD_LP_BOND } from "src/constants/bonds";

import { Bond } from "./Bond/Bond";

const bonds: Record<string, Bond> = {
  "25": OHM_DAI_LP_BOND,
  "27": OHM_LUSD_LP_BOND,
  "28": OHM_DAI_LP_BOND,
};

export const getBondById = (id: string) => bonds[id];
