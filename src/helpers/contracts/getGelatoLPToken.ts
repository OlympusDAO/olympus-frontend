import { NetworkId } from "src/networkDetails";
import { GUniV3Lp__factory } from "src/typechain";

import { calculateGelatoLPValue } from "../pricing/calculateGelatoLPValue";
import { Providers } from "../providers/Providers/Providers";
import { assert } from "../types/assert";
import { getTokenByAddress } from "./getTokenByAddress";
import { Token } from "./Token";

export const getGelatoLPToken = async ({ address, networkId }: { address: string; networkId: NetworkId }) => {
  if (networkId !== NetworkId.MAINNET && networkId !== NetworkId.TESTNET_RINKEBY) throw new Error("Not implemented");

  try {
    const factory = GUniV3Lp__factory;
    const provider = Providers.getStaticProvider(NetworkId.MAINNET);
    const contract = factory.connect(address, provider);

    const [, decimals, ...[tokenZero, tokenOne]] = await Promise.all([
      contract.getUnderlyingBalances(), // Will throw an error if it doesn't exist
      contract.decimals(),
      contract.token0().then(address => getTokenByAddress({ address, networkId: NetworkId.MAINNET })),
      contract.token1().then(address => getTokenByAddress({ address, networkId: NetworkId.MAINNET })),
    ]);

    assert(tokenZero, `Unknown first token in gUni pool. Pool address: ${address}`);
    assert(tokenOne, `Unknown second token in gUni pool. Pool address: ${address}`);

    const poolTokens = [tokenZero, tokenOne] as const;
    const name = `${tokenOne.name}-${tokenZero.name} LP`;
    const icons = poolTokens.map(token => token.icons).flat();
    const purchaseUrl = `https://www.sorbet.finance/#/pools/${address}`;

    const lpToken = new Token({
      decimals,
      name,
      icons,
      factory,
      purchaseUrl,
      addresses: { [NetworkId.MAINNET]: address },
    });

    lpToken.customPricingFunc = networkId => calculateGelatoLPValue({ networkId, lpToken, poolTokens });

    return lpToken;
  } catch (e) {
    return null;
  }
};
