import { BALANCER_VAULT } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { BalancerV2Pool__factory } from "src/typechain";

import { Token } from "../contracts/Token";
import { DecimalBigNumber } from "../DecimalBigNumber/DecimalBigNumber";

export const calculateBalancerLPValue = async ({
  lpToken,
  networkId,
  poolTokens,
}: {
  poolTokens: Token[];
  networkId: NetworkId;
  lpToken: Token<typeof BalancerV2Pool__factory>;
}) => {
  const contract = lpToken.getEthersContract(networkId);
  const vault = BALANCER_VAULT.getEthersContract(NetworkId.MAINNET);

  const [poolId, lpSupply, ...tokenPrices] = await Promise.all([
    contract.getPoolId(),
    // Normalize to the correct number of decimal places
    contract.totalSupply().then(supply => new DecimalBigNumber(supply, lpToken.decimals)),
    // Get the prices of an arbitrary amount of tokens
    ...poolTokens.map(token => token.getPrice(networkId)),
  ]);

  const tokenBalances = await vault
    .getPoolTokens(poolId)
    // We take each balance and normalize it to that tokens specific amount of decimals
    .then(({ balances }) => balances.map((balance, i) => new DecimalBigNumber(balance, poolTokens[i].decimals)));

  const totalValueOfLpInUsd = tokenBalances.reduce(
    // For each token, we multiply the amount in the pool by it's USD value
    (sum, balance, i) => sum.add(balance.mul(tokenPrices[i])),
    new DecimalBigNumber("0"),
  );

  return totalValueOfLpInUsd.div(lpSupply);
};
