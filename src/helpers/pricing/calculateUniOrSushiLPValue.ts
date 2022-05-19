import { BigNumber } from "ethers";
import { NetworkId } from "src/networkDetails";
import { PairContract__factory } from "src/typechain";

import { Token } from "../contracts/Token";
import { DecimalBigNumber } from "../DecimalBigNumber/DecimalBigNumber";

export const calculateUniOrSushiLPValue = async ({
  lpToken,
  networkId,
  poolTokens,
}: {
  networkId: NetworkId;
  poolTokens: [Token, Token];
  lpToken: Token<typeof PairContract__factory>;
}) => {
  const contract = lpToken.getEthersContract(networkId);

  const [tokenBalances, lpSupply, ...tokenPrices] = await Promise.all([
    contract.getReserves().then(balances =>
      balances
        // We filter out blockTimestampLast from the balances
        .filter(balance => balance instanceof BigNumber)
        .map((balance, i) => new DecimalBigNumber(balance as BigNumber, poolTokens[i].decimals)),
    ),
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
