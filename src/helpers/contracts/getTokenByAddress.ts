import {
  DAI_TOKEN,
  LUSD_TOKEN,
  OHM_DAI_LP_TOKEN,
  OHM_LUSD_LP_TOKEN,
  OHM_TOKEN,
  OHM_WETH_LP_TOKEN,
  WETH_TOKEN,
} from "src/constants/tokens";

const tokens = [OHM_TOKEN, DAI_TOKEN, LUSD_TOKEN, WETH_TOKEN, OHM_WETH_LP_TOKEN, OHM_LUSD_LP_TOKEN, OHM_DAI_LP_TOKEN];

export const getTokenByAddress = (address: string) => {
  const normalizedAddress = address.toLowerCase();

  const token = tokens.find(token =>
    Object.values(token.addresses).find(_address => {
      const _normalizedAddress = _address.toLowerCase();

      return normalizedAddress === _normalizedAddress;
    }),
  );

  return token || null;
};
