import { BigNumber } from "ethers";

import { getBondCapacities, IBondV2Core } from "./BondSliceV2";

function generateTestBond(capacityInQuote: boolean): IBondV2Core {
  return {
    quoteToken: "DAI",
    capacityInQuote: capacityInQuote,
    capacity: BigNumber.from(10000),
    totalDebt: BigNumber.from(100),
    maxPayout: BigNumber.from(100),
    purchased: BigNumber.from(42),
    sold: BigNumber.from(23),
  };
}

describe("BondSliceV2", () => {
  const bondWithCapacityInQuote = generateTestBond(true);
  const bondWithCapacityNotInQuote = generateTestBond(false);
  const quoteDecimals = 9;
  const bondPriceBigNumber = BigNumber.from(100);

  test("getBondCapacities for bond with capacity in quote returns capacities", () => {
    const { capacityInBaseToken, capacityInQuoteToken } = getBondCapacities(
      bondWithCapacityInQuote,
      quoteDecimals,
      bondPriceBigNumber,
    );

    expect(capacityInBaseToken).toStartWith("100.0");
    expect(capacityInQuoteToken).toStartWith("0.0");
  });

  test("getBondCapacities for bond with capacity not in quote returns capacities", () => {
    const { capacityInBaseToken, capacityInQuoteToken } = getBondCapacities(
      bondWithCapacityNotInQuote,
      quoteDecimals,
      bondPriceBigNumber,
    );

    expect(capacityInBaseToken).toStartWith("0.0000");
    expect(capacityInQuoteToken).toStartWith("0.0");
  });
});
