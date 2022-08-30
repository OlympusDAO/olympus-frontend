import { getTokenByAddress } from "src/helpers/contracts/getTokenByAddress";
import { Token } from "src/helpers/contracts/Token";
import { calculateCurveLPValue } from "src/helpers/pricing/calculateCurveLPValue";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { nonNullable } from "src/helpers/types/nonNullable";
import { NetworkId } from "src/networkDetails";
import { CurveFactory__factory, CurvePool__factory } from "src/typechain";
import { CurveToken__factory } from "src/typechain/factories/CurveToken__factory";

/**
 * Returns a `Token` given the address of a Curve token contract
 *
 * Relevant contracts:
 * - 0x3660bd168494d61ffdac21e403d0f6356cf90fd7 (OHM/ETH token contract)
 * - 0x6ec38b3228251a0C5D491Faf66858e2E23d7728B (OHM/ETH pool contract)
 */
export const getCurveLPToken = async ({ address, networkId }: { address: string; networkId: NetworkId }) => {
  if (networkId !== NetworkId.MAINNET && networkId !== NetworkId.TESTNET_GOERLI) throw new Error("Not implemented");

  try {
    const provider = Providers.getStaticProvider(NetworkId.MAINNET);
    const tokenContract = CurveToken__factory.connect(address, provider);

    const [decimals, poolAddress] = await Promise.all([
      tokenContract.decimals(),
      tokenContract.minter(), // Will throw an error if it doesn't exist
    ]);

    const poolContract = CurvePool__factory.connect(poolAddress, provider);
    const factoryAddress = await poolContract.factory();
    const factoryContract = CurveFactory__factory.connect(factoryAddress, provider);

    const tokenAddresses = await factoryContract.get_coins(poolAddress);

    const _poolTokens = await Promise.all(tokenAddresses.map(address => getTokenByAddress({ address, networkId })));
    const poolTokens = _poolTokens.filter(nonNullable);
    if (poolTokens.length !== _poolTokens.length)
      throw new Error(`Unknown token in Curve pool. Token address ${address}`);

    const lpToken = new Token({
      decimals,
      factory: CurveToken__factory,
      addresses: { [NetworkId.MAINNET]: address },
      icons: poolTokens.map(token => token.icons).flat(),
      name: poolTokens.map(token => token.name).join("-") + ` LP`,
      purchaseUrl: `https://curve.fi/factory-crypto/21`, // Don't think it's possible to make this dynamic.
    });

    lpToken.customPricingFunc = networkId => calculateCurveLPValue({ lpToken, poolTokens, networkId });

    return lpToken;
  } catch (e) {
    return null;
  }
};
