import { BALANCER_VAULT } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { BalancerV2Pool__factory } from "src/typechain";

import { calculateBalancerLPValue } from "../pricing/calculateBalancerLPValue";
import { Providers } from "../providers/Providers/Providers";
import { nonNullable } from "../types/nonNullable";
import { getTokenByAddress } from "./getTokenByAddress";
import { Token } from "./Token";

/**
 * Returns a `Token` given the address of a Balancer token contract
 *
 * Relevant contracts:
 * - 0xc45d42f801105e861e86658648e3678ad7aa70f9 (OHM/DAI/wETH)
 */
export const getBalancerLPToken = async ({ address, networkId }: { address: string; networkId: NetworkId }) => {
  if (networkId !== NetworkId.MAINNET && networkId !== NetworkId.TESTNET_RINKEBY) throw new Error("Not implemented");

  try {
    const provider = Providers.getStaticProvider(NetworkId.MAINNET);
    const contract = BalancerV2Pool__factory.connect(address, provider);
    const vault = BALANCER_VAULT.getEthersContract(NetworkId.MAINNET);

    const [decimals, poolId] = await Promise.all([
      contract.decimals(),
      contract.getPoolId(), // Will throw an error if it doesn't exist
    ]);

    const { tokens: addresses } = await vault.getPoolTokens(poolId);

    const tokens = await Promise.all([
      ...addresses.map(address => getTokenByAddress({ address, networkId: NetworkId.MAINNET })),
    ]);

    const poolTokens = tokens.filter(nonNullable);
    if (poolTokens.length !== tokens.length) throw new Error(`Unknown token in Balancer pool. Pool address ${address}`);

    const lpToken = new Token({
      decimals,
      factory: BalancerV2Pool__factory,
      addresses: { [NetworkId.MAINNET]: address },
      icons: poolTokens.map(token => token.icons).flat(),
      purchaseUrl: `https://app.balancer.fi/#/pool/${poolId}`,
      name: poolTokens.map(token => token.name).join("-") + ` LP`,
    });

    lpToken.customPricingFunc = networkId => calculateBalancerLPValue({ lpToken, poolTokens, networkId });

    return lpToken;
  } catch (e) {
    return null;
  }
};
