import { NetworkId } from "src/networkDetails";
import { CurveFactory__factory, CurvePool__factory, CurveToken__factory } from "src/typechain";

import { Token } from "../contracts/Token";
import { DecimalBigNumber } from "../DecimalBigNumber/DecimalBigNumber";
import { Providers } from "../providers/Providers/Providers";

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

  const provider = Providers.getStaticProvider(networkId);
  const tokenContract = lpToken.getEthersContract(networkId);

  const [poolAddress, lpSupply, ...tokenPrices] = await Promise.all([
    tokenContract.minter(),
    tokenContract.totalSupply().then(supply => new DecimalBigNumber(supply, lpToken.decimals)),
    ...poolTokens.map(token => token.getPrice(networkId)),
  ]);

  const poolContract = CurvePool__factory.connect(poolAddress, provider);
  const factoryAddress = await poolContract.factory();
  const factoryContract = CurveFactory__factory.connect(factoryAddress, provider);

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
