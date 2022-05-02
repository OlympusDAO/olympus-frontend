import { NetworkId } from "src/networkDetails";
import { GUniV3Lp__factory } from "src/typechain";

import { Token } from "../contracts/Token";
import { DecimalBigNumber } from "../DecimalBigNumber/DecimalBigNumber";

export const calculateGelatoLPValue = async ({
  lpToken,
  networkId,
  poolTokens,
}: {
  networkId: NetworkId;
  poolTokens: readonly [Token, Token];
  lpToken: Token<typeof GUniV3Lp__factory>;
}) => {
  const contract = lpToken.getEthersContract(networkId);

  const [tokenBalances, lpSupply, ...tokenPrices] = await Promise.all([
    contract
      .getUnderlyingBalances()
      .then(balances => [
        new DecimalBigNumber(balances.amount0Current, poolTokens[0].decimals),
        new DecimalBigNumber(balances.amount1Current, poolTokens[1].decimals),
      ]),
    contract.totalSupply().then(supply => new DecimalBigNumber(supply, lpToken.decimals)),
    ...poolTokens.map(token => token.getPrice(networkId as NetworkId)),
  ]);

  const totalValueOfLpInUsd = tokenBalances.reduce(
    // For each token, we multiply the amount in the pool by it's USD value
    (sum, balance, i) => sum.add(balance.mul(tokenPrices[i])),
    new DecimalBigNumber("0"),
  );

  return totalValueOfLpInUsd.div(lpSupply);
};
