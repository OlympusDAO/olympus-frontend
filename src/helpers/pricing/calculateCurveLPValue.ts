import { CURVE_FACTORY } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { CurveToken__factory } from "src/typechain";

import { Token } from "../contracts/Token";
import { DecimalBigNumber } from "../DecimalBigNumber/DecimalBigNumber";

/**
 * Calculates the value of a Curve LP token in USD
 */
export const calculateCurveLPValue = async ({
  lpToken,
  networkId,
  poolTokens,
}: {
  poolTokens: Token[];
  networkId: NetworkId;
  lpToken: Token<typeof CurveToken__factory>;
}) => {
  if (networkId !== NetworkId.MAINNET) throw new Error("Not implemented");

  const tokenContract = lpToken.getEthersContract(networkId);
  const factoryContract = CURVE_FACTORY.getEthersContract(networkId);

  const [poolAddress, lpSupply, ...tokenPrices] = await Promise.all([
    tokenContract.minter(),
    tokenContract.totalSupply().then(supply => new DecimalBigNumber(supply, lpToken.decimals)),
    ...poolTokens.map(token => token.getPrice(networkId)),
  ]);

  const tokenBalances = await factoryContract
    .get_balances(poolAddress)
    .then(balances => balances.map((balance, i) => new DecimalBigNumber(balance, poolTokens[i].decimals)));

  const totalValueOfLpInUsd = tokenBalances.reduce(
    // For each token, we multiply the amount in the pool by it's USD value
    (sum, balance, i) => sum.add(balance.mul(tokenPrices[i])),
    new DecimalBigNumber("0"),
  );

  return totalValueOfLpInUsd.div(lpSupply);
};
