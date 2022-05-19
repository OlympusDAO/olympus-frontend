import { NetworkId } from "src/networkDetails";
import { PairContract__factory } from "src/typechain";

import { calculateUniOrSushiLPValue } from "../pricing/calculateUniOrSushiLPValue";
import { Providers } from "../providers/Providers/Providers";
import { assert } from "../types/assert";
import { getTokenByAddress } from "./getTokenByAddress";
import { Token } from "./Token";

/**
 * Returns a `Token` given the address of a UniswapV2 or Sushi token contract
 *
 * Relevant contracts:
 * - 0x69b81152c5A8d35A67B32A4D3772795d96CaE4da (OHM/wETH Sushi)
 * - 0xfd0a40bc83c5fae4203dec7e5929b446b07d1c76 (FRAX/ETH Uniswap V2)
 */
export const getUniOrSushiLPToken = async ({ address, networkId }: { address: string; networkId: NetworkId }) => {
  if (networkId !== NetworkId.MAINNET && networkId !== NetworkId.TESTNET_RINKEBY) throw new Error("Not implemented");

  try {
    const provider = Providers.getStaticProvider(NetworkId.MAINNET);
    const contract = PairContract__factory.connect(address, provider);

    const [name, decimals, ...[tokenZero, tokenOne]] = await Promise.all([
      contract.name(),
      contract.decimals(),
      contract.token0().then(address => getTokenByAddress({ address, networkId })),
      contract.token1().then(address => getTokenByAddress({ address, networkId })),
    ]);

    assert(tokenZero, `Unknown first token in Sushi/Uni pool. Pool address: ${address}`);
    assert(tokenOne, `Unknown second token in Sushi/Uni pool. Pool address: ${address}`);

    const zeroAddress = tokenZero.addresses[NetworkId.MAINNET];
    const oneAddress = tokenOne.addresses[NetworkId.MAINNET];

    const lpToken = new Token({
      decimals,
      factory: PairContract__factory,
      addresses: { [NetworkId.MAINNET]: address },
      name: `${tokenZero.name}-${tokenOne.name} LP`,
      icons: [...tokenZero.icons, ...tokenOne.icons],
      purchaseUrl: name.includes("Uniswap")
        ? `https://app.uniswap.org/#/add/v2/${zeroAddress}/${oneAddress}?chain=mainnet`
        : `https://app.sushi.com/add/${zeroAddress}/${oneAddress}`,
    });

    lpToken.customPricingFunc = networkId =>
      calculateUniOrSushiLPValue({ lpToken, poolTokens: [tokenZero, tokenOne], networkId });

    return lpToken;
  } catch (error) {
    return null;
  }
};
