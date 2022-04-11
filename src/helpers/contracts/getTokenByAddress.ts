import * as _tokens from "src/constants/tokens";

const tokens = Object.values(_tokens);

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
