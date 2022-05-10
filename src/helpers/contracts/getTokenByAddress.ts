import * as _tokens from "src/constants/tokens";
import { NetworkId } from "src/networkDetails";

import { getLPTokenByAddress } from "./getLPTokenByAddress";
import { Token } from "./Token";

const tokens = Object.values(_tokens);

export const getTokenByAddress = async ({
  address,
  networkId,
}: {
  address: string;
  networkId: NetworkId;
}): Promise<Token | null> => {
  const normalizedAddress = address.toLowerCase();

  // First, we attempt to find the token from our hardcoded list
  const hardcoded = tokens.find(token =>
    Object.entries(token.addresses)
      .filter(([_networkId]) => networkId === Number(_networkId))
      .find(([, _address]) => normalizedAddress === _address.toLowerCase()),
  );

  if (hardcoded) return hardcoded;

  // LP tokens aren't hardcoded, we attempt to get them dynamically
  return getLPTokenByAddress({ address, networkId });
};
