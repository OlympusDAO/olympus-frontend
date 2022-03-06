import { BigNumber } from "ethers";
import * as fc from "fast-check";

import {
  convertAmountInBondUnitToBaseTokenUnit,
  convertAmountInBondUnitToQuoteTokenUnit,
  getBondCapacities,
  getBondDuration,
  IBondV2Core,
  IBondV2Terms,
} from "./BondSliceV2";

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

function generateTestBondTerms(fixedTerm: boolean): IBondV2Terms {
  return {
    fixedTerm: fixedTerm,
    controlVariable: BigNumber.from(100),
    vesting: 100,
    conclusion: new Date().getTime() / 1000 + 100,
    maxDebt: BigNumber.from(10000),
  };
}

describe("BondSliceV2", () => {
  const quoteDecimals = 9;
  const bondPriceBigNumber = BigNumber.from(100);

  test("getBondCapacities for bond with capacity in quote returns capacities", () => {
    const bondWithCapacityInQuote = generateTestBond(true);

    const { capacityInBaseToken, capacityInQuoteToken } = getBondCapacities(
      bondWithCapacityInQuote,
      quoteDecimals,
      bondPriceBigNumber,
    );

    expect(capacityInBaseToken).toStartWith("100.0");
    expect(capacityInQuoteToken).toStartWith("0.0");
  });

  test("getBondCapacities for bond with capacity not in quote returns capacities", () => {
    const bondWithCapacityNotInQuote = generateTestBond(false);

    const { capacityInBaseToken, capacityInQuoteToken } = getBondCapacities(
      bondWithCapacityNotInQuote,
      quoteDecimals,
      bondPriceBigNumber,
    );

    expect(capacityInBaseToken).toStartWith("0.0000");
    expect(capacityInQuoteToken).toStartWith("0.0");
  });

  test("getBondDuration with fixed terms", () => {
    const terms = generateTestBondTerms(true);
    const duration = getBondDuration(terms);

    expect(duration).toBe("1 min");
  });

  test("getBondDuration without fixed terms", () => {
    const terms = generateTestBondTerms(false);
    const duration = getBondDuration(terms);

    expect(duration).toBe("1 min");
  });

  test("convertAmountInBondUnitToQuoteTokenUnit always returns a positive result", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10 ** 9, max: 10 ** 15 }),
        fc.integer({ min: 1, max: 100000 }),
        fc.integer({ min: 9, max: 18 }),
        (bondUnit, price, decimals) => {
          const bondUnitBigNumber = BigNumber.from(bondUnit);
          const priceBigNumber = BigNumber.from(price);

          const amountInQuoteToken = convertAmountInBondUnitToQuoteTokenUnit(
            bondUnitBigNumber,
            priceBigNumber,
            decimals,
          );

          return amountInQuoteToken.gt(BigNumber.from(0));
        },
      ),
    );
  });

  test("convertAmountInBondUnitToBaseTokenUnit always returns a positive result", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10 ** 9, max: 10 ** 15 }),
        fc.integer({ min: 1, max: 100000 }),
        fc.integer({ min: 9, max: 18 }),
        (bondUnit, price, decimals) => {
          const bondUnitBigNumber = BigNumber.from(bondUnit);
          const priceBigNumber = BigNumber.from(price);

          const amountInBaseToken = convertAmountInBondUnitToBaseTokenUnit(bondUnitBigNumber, decimals, priceBigNumber);

          return amountInBaseToken.gt(BigNumber.from(0));
        },
      ),
    );
  });
});
