import { OHM_DAI_LP_TOKEN, OHM_LUSD_LP_TOKEN, OHM_TOKEN, OHM_WETH_LP_TOKEN } from "src/constants/tokens";

const tokens = [OHM_TOKEN, OHM_WETH_LP_TOKEN, OHM_LUSD_LP_TOKEN, OHM_DAI_LP_TOKEN];

export const getTokenByAddress = (address: string) => {
  return tokens.find(token => Object.values(token.addresses).find(_address => address === _address)) || null;
};
