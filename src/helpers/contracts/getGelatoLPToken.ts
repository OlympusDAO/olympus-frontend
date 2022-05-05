import { NetworkId } from "src/networkDetails";
import { GUniV3Lp__factory } from "src/typechain";

import { calculateGelatoLPValue } from "../pricing/calculateGelatoLPValue";
import { Providers } from "../providers/Providers/Providers";
import { assert } from "../types/assert";
import { getTokenByAddress } from "./getTokenByAddress";
import { Token } from "./Token";

/**
 * Returns a `Token` given the address of a UniswapV2 or Sushi token contract
 *
 * Relevant contracts:
 * - 0x61a0C8d4945A61bF26c13e07c30AF1f1ca67b473 (FRAX/OHM)
 */
export const getGelatoLPToken = async ({ address, networkId }: { address: string; networkId: NetworkId }) => {
  if (networkId !== NetworkId.MAINNET && networkId !== NetworkId.TESTNET_RINKEBY) throw new Error("Not implemented");

  try {
    const provider = Providers.getStaticProvider(NetworkId.MAINNET);
    const contract = GUniV3Lp__factory.connect(address, provider);

    const [, decimals, ...[tokenZero, tokenOne]] = await Promise.all([
      contract.getUnderlyingBalances(), // Will throw an error if it doesn't exist
      contract.decimals(),
      contract.token0().then(address => getTokenByAddress({ address, networkId: NetworkId.MAINNET })),
      contract.token1().then(address => getTokenByAddress({ address, networkId: NetworkId.MAINNET })),
    ]);

    assert(tokenZero, `Unknown first token in gUni pool. Pool address: ${address}`);
    assert(tokenOne, `Unknown second token in gUni pool. Pool address: ${address}`);

    const poolTokens = [tokenZero, tokenOne] as const;

    const lpToken = new Token({
      decimals,
      factory: GUniV3Lp__factory,
      name: `${tokenOne.name}-${tokenZero.name} LP`,
      addresses: { [NetworkId.MAINNET]: address },
      icons: poolTokens.map(token => token.icons).flat(),
      purchaseUrl: `https://www.sorbet.finance/#/pools/${address}`,
    });

    lpToken.customPricingFunc = networkId => calculateGelatoLPValue({ networkId, lpToken, poolTokens });

    return lpToken;
  } catch (e) {
    return null;
  }
};
