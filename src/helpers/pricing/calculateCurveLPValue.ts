import { NetworkId } from "src/networkDetails";
import { CurveFactory__factory } from "src/typechain";

import { Token } from "../contracts/Token";
import { DecimalBigNumber } from "../DecimalBigNumber/DecimalBigNumber";

/**
 * Calculates the value of a Curve LP token in USD
 *
 * Note that Curve pools are sometimes split up into two separate contracts,
 * a factory and a token contract, and sometimes a single contract that merges
 * the functionality of those two contracts together.
 *
 * This function expects the latter, and the ABI is the one recommended by
 * the Curve's own implementation docs:
 * (https://curve.readthedocs.io/factory-pools.html?highlight=abi#implementation-contracts)
 */
export const calculateCurveLPValue = async ({
  lpToken,
  networkId,
}: {
  networkId: NetworkId;
  lpToken: Token<typeof CurveFactory__factory>;
}) => {
  const contract = lpToken.getEthersContract(networkId);

  return contract.get_virtual_price().then(
    price =>
      new DecimalBigNumber(
        price,
        /**
         * Always expressed with 1e18 precision
         * (https://curve.readthedocs.io/factory-pools.html?highlight=abi#StableSwap.get_virtual_price)
         */
        18,
      ),
  );
};
