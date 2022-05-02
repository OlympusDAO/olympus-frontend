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

  // LP tokens aren't hardcoded, we attempt to get them dynamically
  const dynamic = await getLPTokenByAddress({ address, networkId });

  return hardcoded || dynamic || null;
};
