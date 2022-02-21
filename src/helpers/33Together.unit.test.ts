import { BigNumber } from "ethers";
import * as fc from "fast-check";
import { Arbitrary } from "fast-check";
import { NetworkId } from "src/networkDetails";

import { calculateOdds, getCreditMaturationDaysAndLimitPercentage, poolTogetherUILinks, trimOdds } from "./33Together";

/**
 * PoolTogether's reference implementation: https://github.com/pooltogether/pooltogether-community-ui/blob/2d4749e2e64c4f2ae259ac073edc0a49ca5857e2/lib/utils/calculateOdds.js#L3
 */
test("calculateOdds for positive input numbers always returns a positive number", async () => {
  fc.assert(
    fc.property(
      fc
        .tuple(fc.float({ min: 0.1 }), fc.float({ min: 0.1 }), fc.nat())
        .map(([userBalanceGenerated, otherUsersBalancesGenerated, winnersGenerated]) => [
          userBalanceGenerated,
          userBalanceGenerated + otherUsersBalancesGenerated,
          winnersGenerated + 1, // make sure winners is always >= 1
        ]),
      ([usersPoolBalance, totalPoolDeposits, winners]) => {
        const strUserPoolBalance = usersPoolBalance.toString();
        const userWinningOdds = calculateOdds(strUserPoolBalance, totalPoolDeposits, winners);
        expect(userWinningOdds).toBeGreaterThan(0);
      },
    ),
  );
});

test("calculateOdds is monotonously decreasing in respect to user balance", async () => {
  fc.assert(
    fc.property(
      fc
        .tuple(fc.float({ min: 0.1 }), fc.float({ min: 0.1 }), fc.nat())
        .map(([userBalanceGenerated, otherUsersBalancesGenerated, winnersGenerated]) => [
          userBalanceGenerated,
          userBalanceGenerated * 2,
          userBalanceGenerated * 2 + otherUsersBalancesGenerated,
          winnersGenerated + 1, // make sure winners is always >= 1
        ]),
      ([usersPoolBalance, usersPoolBalanceGreater, totalPoolDeposits, winners]) => {
        expect(usersPoolBalance).toBeLessThan(usersPoolBalanceGreater);
        const strUserPoolBalance = usersPoolBalance.toString();
        const strUserPoolBalanceBigger = usersPoolBalanceGreater.toString();
        const userWinningOdds = calculateOdds(strUserPoolBalance, totalPoolDeposits, winners);
        const userWinningOddsBigger = calculateOdds(strUserPoolBalanceBigger, totalPoolDeposits, winners);
        // since the function returns the inverse of user's winning odds
        // e.g. returns 2 when user has 1 in 2 odds, rather than 0.5
        // the result for greater userPool should be a smaller number
        // or equal if the odds are too close to fit in a JS number precision range.
        expect(userWinningOddsBigger).toBeLessThanOrEqual(Number(userWinningOdds));
      },
    ),
  );
});

test("calculateOdds uses correct formula: input set 1", async () => {
  const usersPoolBalance = "10";
  const totalPoolDeposits = 200;
  const winners = 3;
  const expectedOdds = 1 / (1 - Math.pow((totalPoolDeposits - Number(usersPoolBalance)) / totalPoolDeposits, winners));
  const userWinningOdds = calculateOdds(usersPoolBalance, totalPoolDeposits, winners);
  expect(expectedOdds).toEqual(userWinningOdds);
});

test("calculateOdds uses correct formula: input set 2", async () => {
  const usersPoolBalance = "5";
  const totalPoolDeposits = 60;
  const winners = 2;
  const expectedOdds = 1 / (1 - Math.pow((totalPoolDeposits - Number(usersPoolBalance)) / totalPoolDeposits, winners));
  const userWinningOdds = calculateOdds(usersPoolBalance, totalPoolDeposits, winners);
  expect(expectedOdds).toEqual(userWinningOdds);
});

test("calculateOdds returns ngmi when userPool has no balance", async () => {
  const usersPoolBalance = "0";
  const totalPoolDeposits = 120;
  const winners = 1;
  const expectedOdds = "ngmi";
  const userWinningOdds = calculateOdds(usersPoolBalance, totalPoolDeposits, winners);
  expect(expectedOdds).toEqual(userWinningOdds);
});

test("calculateOdds for negative usersPoolBalance should throw an error", async () => {
  const usersPoolBalance = "-10";
  const totalPoolDeposits = 120;
  const winners = 1;
  expect(() => calculateOdds(usersPoolBalance, totalPoolDeposits, winners)).toThrow("Invalid parameter values");
});

test("calculateOdds for totalPoolDeposits less than usersPoolBalance should throw an error", async () => {
  const usersPoolBalance = "100";
  const totalPoolDeposits = 20;
  const winners = 1;
  expect(() => calculateOdds(usersPoolBalance, totalPoolDeposits, winners)).toThrow("Invalid parameter values");
});

test("calculateOdds for non-positive winners should throw an error", async () => {
  const usersPoolBalance = "10";
  const totalPoolDeposits = 200;
  let winners = 0;
  expect(() => calculateOdds(usersPoolBalance, totalPoolDeposits, winners)).toThrow("Invalid parameter values");
  winners = -20;
  expect(() => calculateOdds(usersPoolBalance, totalPoolDeposits, winners)).toThrow("Invalid parameter values");
});

/**
 * Human readable explanation of exit rate fee here:
 * https://medium.com/pooltogether/3-3-together-is-live-1defedf3dbf6
 */
test("getCreditMaturationDaysAndLimitPercentage returns 0 days for non-positive exit fee (credit) rate", async () => {
  const [creditMaturationInDays, creditLimitPercentage] = getCreditMaturationDaysAndLimitPercentage(
    BigNumber.from(0),
    BigNumber.from(5),
  );
  expect(creditMaturationInDays).toEqual(0);
});

test("getCreditMaturationDaysAndLimitPercentage returns 0 days for non-positive exit fee (credit) rate", async () => {
  const [creditMaturationInDays, creditLimitPercentage] = getCreditMaturationDaysAndLimitPercentage(
    BigNumber.from(-5),
    BigNumber.from(15),
  );
  expect(creditMaturationInDays).toEqual(0);
});

test("getCreditMaturationDaysAndLimitPercentage days is monotonously decreasing in respect to maturation rate", async () => {
  const boundedTuple: Arbitrary<[number, number, number]> = fc
    .nat()
    .chain(exitFee =>
      fc
        .nat({ max: exitFee })
        .chain((ratePerSecond: number) =>
          fc.tuple(
            fc.constant(ratePerSecond + 1),
            fc.integer({ min: ratePerSecond + 1, max: exitFee + 1 }),
            fc.constant(exitFee + 1),
          ),
        ),
    );
  fc.assert(
    fc.property(
      boundedTuple,
      ([ticketCreditRateMantissa, ticketCreditRateMantissaBigger, ticketCreditLimitMantissa]) => {
        const [creditMaturationInDays, creditLimitPercentage] = getCreditMaturationDaysAndLimitPercentage(
          BigNumber.from(ticketCreditRateMantissa), // smaller maturation rate per second
          BigNumber.from(ticketCreditLimitMantissa), // fixed exit fee
        );
        const [creditMaturationInDaysSooner, creditLimitPercentageSame] = getCreditMaturationDaysAndLimitPercentage(
          BigNumber.from(ticketCreditRateMantissaBigger), // bigger maturation rate per second
          BigNumber.from(ticketCreditLimitMantissa), // fixed exit fee
        );
        // exit fee should mature sooner when maturation is faster (maturation rate is bigger)
        // add small correction for rounding errors
        expect(creditMaturationInDays).toBeGreaterThanOrEqual(creditMaturationInDaysSooner);
        expect(creditLimitPercentage).toEqual(creditLimitPercentageSame);
      },
    ),
  );
});

test("poolTogetherUILinks returns rinkeby URLs when NetworkId is Rinkeby", async () => {
  const urls: string[] = poolTogetherUILinks(NetworkId.TESTNET_RINKEBY);
  urls.forEach(url => expect(url).toContain("rinkeby"));
});

test("poolTogetherUILinks returns mainnet URLs when NetworkId is Mainnet", async () => {
  const urls: string[] = poolTogetherUILinks(NetworkId.MAINNET);
  urls.forEach(url => expect(url).toContain("mainnet"));
});

test("trimOdds returns input unchanged when type is string", async () => {
  expect(trimOdds("ngmi")).toEqual("ngmi");
});

test("trimOdds trims decimals when input is a number", async () => {
  expect(trimOdds(1.23, 1)).toEqual((1.2).toString());
});

test("trimOdds always returns a number that is smaller or equal to the input", async () => {
  fc.assert(
    fc.property(fc.float(), fc.nat({ max: 7 }), (num, precision) => {
      // avoid test rounding errors when the number has > 8 digits after decimal point
      // see trim() implementation
      const bounded = Number(num.toFixed(8));
      const trimmed = trimOdds(bounded, precision);
      expect(Number(trimmed)).toBeLessThanOrEqual(bounded);
    }),
  );
});
