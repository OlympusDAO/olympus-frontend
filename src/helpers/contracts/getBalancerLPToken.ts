import { BALANCER_VAULT } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { BalancerV2Pool__factory } from "src/typechain";

import { calculateBalancerLPValue } from "../pricing/calculateBalancerLPValue";
import { Providers } from "../providers/Providers/Providers";
import { nonNullable } from "../types/nonNullable";
import { getTokenByAddress } from "./getTokenByAddress";
import { Token } from "./Token";

export const getBalancerLPToken = async ({ address, networkId }: { address: string; networkId: NetworkId }) => {
  if (networkId !== NetworkId.MAINNET) throw new Error("Not implemented");

  try {
    const factory = BalancerV2Pool__factory;
    const provider = Providers.getStaticProvider(networkId);
    const contract = factory.connect(address, provider);
    const vault = BALANCER_VAULT.getEthersContract(networkId);

    const [decimals, poolId] = await Promise.all([
      contract.decimals(),
      contract.getPoolId(), // Will throw an error if it doesn't exist
    ]);

    const { tokens: addresses } = await vault.getPoolTokens(poolId);

    const tokens = await Promise.all([...addresses.map(address => getTokenByAddress({ address, networkId }))]);

    const poolTokens = tokens.filter(nonNullable);
    if (poolTokens.length !== tokens.length) throw new Error(`Unknown token in Balancer pool. Pool address ${address}`);

    const name = poolTokens.map(token => token.name).join("-") + ` LP`;
    const icons = poolTokens.map(token => token.icons).flat();
    const purchaseUrl = `https://app.balancer.fi/#/pool/${poolId}`;

    const lpToken = new Token({ decimals, name, icons, factory, purchaseUrl, addresses: { [networkId]: address } });
    lpToken.customPricingFunc = networkId => calculateBalancerLPValue({ lpToken, poolTokens, networkId });

    return lpToken;
  } catch (e) {
    return null;
  }
};
