import { DAI_TOKEN, OHM_TOKEN } from "src/constants/tokens";
import { sortByDiscount } from "src/helpers/bonds/sortByDiscount";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { Bond } from "src/views/Bond/hooks/useBond";
import { describe, expect, it } from "vitest";

describe("SortByDiscount", () => {
  // mocking the discounts
  const highestDiscount = new DecimalBigNumber("99", 9);
  const middleDisount = new DecimalBigNumber("10", 9);
  const lowestDiscount = new DecimalBigNumber("1", 9);

  // mocking the superfluous details for this test
  const mockBondDetails = {
    duration: 1,
    isFixedTerm: false,
    isSoldOut: false,
    price: {
      inBaseToken: new DecimalBigNumber("10", 9),
      inUsd: new DecimalBigNumber("10", 9),
    },
    capacity: {
      inBaseToken: new DecimalBigNumber("10", 9),
      inQuoteToken: new DecimalBigNumber("10", 9),
    },
    baseToken: OHM_TOKEN,
    quoteToken: DAI_TOKEN,
    maxPayout: {
      inBaseToken: new DecimalBigNumber("10", 9),
      inQuoteToken: new DecimalBigNumber("10", 9),
    },
  };

  // mocking the full bonds
  const mockBonds: Bond[] = [
    {
      id: middleDisount.toString(),
      discount: middleDisount,
      ...mockBondDetails,
    },
    {
      id: lowestDiscount.toString(),
      discount: lowestDiscount,
      ...mockBondDetails,
    },
    {
      id: highestDiscount.toString(),
      discount: highestDiscount,
      ...mockBondDetails,
    },
  ];

  it("should sort bonds by discount with highest discount first", () => {
    const sorted = sortByDiscount(mockBonds);
    expect(sorted.map(b => b.id)).toEqual([
      highestDiscount.toString(),
      middleDisount.toString(),
      lowestDiscount.toString(),
    ]);
  });
});
