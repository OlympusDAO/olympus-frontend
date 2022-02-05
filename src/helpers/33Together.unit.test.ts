import * as fc from "fast-check";

import { calculateOdds } from "./33Together";

/**
 * PoolTogether's reference implementation: https://github.com/pooltogether/pooltogether-community-ui/blob/2d4749e2e64c4f2ae259ac073edc0a49ca5857e2/lib/utils/calculateOdds.js#L3
 */
test("calculateOdds for positive input numbers always returns a number >= 0", async () => {
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

test.only("calculateOdds is monotonously decreasing in respect to user balance", async () => {
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
