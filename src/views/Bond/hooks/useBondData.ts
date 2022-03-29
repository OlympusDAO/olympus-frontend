import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { BOND_DEPOSITORY_CONTRACT } from "src/constants/contracts";
import { Bond } from "src/helpers/bonds/Bond";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

export const allBondDataQueryKey = (id: string) => ["useBondData", id];

export const useBondData = (bond: Bond) => {
  const networks = useTestableNetworks();
  const contract = BOND_DEPOSITORY_CONTRACT.getEthersContract(networks.MAINNET);

  return useQuery(allBondDataQueryKey(bond.id), async () => {
    const [terms, markets, baseTokenPerUsd, quoteTokenPerUsd, quoteTokenPerBaseToken] = await Promise.all([
      contract.terms(bond.id),
      contract.markets(bond.id),
      bond.baseToken.getPrice(NetworkId.MAINNET),
      bond.quoteToken.getPrice(NetworkId.MAINNET),
      contract.marketPrice(bond.id).then(price => new DecimalBigNumber(price, bond.baseToken.decimals)),
    ]);

    const price = quoteTokenPerUsd.mul(quoteTokenPerBaseToken, 9);

    const discount = baseTokenPerUsd.sub(price).div(baseTokenPerUsd, 9);

    /**
     * Bonds mature with a cliff at a set timestamp
     * prior to the expiry timestamp, no payout tokens are accessible to the user
     * after the expiry timestamp, the entire payout can be redeemed
     *
     * there are two types of bonds: fixed-term and fixed-expiration
     *
     * fixed-term bonds mature in a set amount of time from deposit
     * i.e. term = 1 week. when alice deposits on day 1, her bond
     * expires on day 8. when bob deposits on day 2, his bond expires day 9.
     *
     * fixed-expiration bonds mature at a set timestamp
     * i.e. expiration = day 10. when alice deposits on day 1, her term
     * is 9 days. when bob deposits on day 2, his term is 8 days.
     */
    const duration = terms.fixedTerm ? terms.vesting : terms.conclusion - Date.now() / 1000;

    /*
     * each market is initialized with a capacity
     *
     * this is either the number of OHM that the market can sell
     * (if capacity in quote is false),
     *
     * or the number of quote tokens that the market can buy
     * (if capacity in quote is true)
     */
    const capacity = new DecimalBigNumber(
      markets.capacity,
      markets.capacityInQuote ? bond.quoteToken.decimals : bond.baseToken.decimals,
    );

    const capacityInQuoteToken = markets.capacityInQuote
      ? capacity
      : capacity.mul(quoteTokenPerBaseToken, bond.quoteToken.decimals); // Convert to quoteToken if capacity is denominated in baseToken

    const capacityInBaseToken = markets.capacityInQuote
      ? capacity.div(quoteTokenPerBaseToken, bond.baseToken.decimals) // Convert to baseToken if capacity is denominated in quoteToken
      : capacity;

    /*
     * maxPayout is the amount of capacity that should be utilized in a deposit
     * interval. for example, if capacity is 1,000 OHM, there are 10 days to conclusion,
     * and the preferred deposit interval is 1 day, max payout would be 100 OHM.
     */
    const maxPayoutInBaseToken = new DecimalBigNumber(markets.maxPayout, bond.baseToken.decimals);
    const maxPayoutInQuoteToken = maxPayoutInBaseToken.mul(quoteTokenPerBaseToken, bond.quoteToken.decimals);

    /**
     * Bonds are sold out if either there is no capacity left,
     * or the maximum has been paid out for a specific interval.
     */
    const ONE = new DecimalBigNumber("1", 0);
    const isSoldOut = ONE.gt(capacityInBaseToken) || ONE.gt(maxPayoutInBaseToken);

    return {
      /**
       * Price of token the user is buying denominated in USD
       */
      price,
      /**
       * The discount relative to the current market price of the token being sold
       */
      discount,
      /**
       * The duration until the bond matures in seconds
       */
      duration,
      /**
       * Boolean describing whether this bond is
       * either fixed-term, or fixed-expiration
       */
      isFixedTerm: terms.fixedTerm,
      /**
       * A boolean describing whether or not this bond is
       * sold out at the current point in time.
       */
      isSoldOut,
      /*
       * Capacity is the number of tokens
       * left available for purchase
       */
      capacity: {
        inBaseToken: capacityInBaseToken,
        inQuoteToken: capacityInQuoteToken,
      },
      /*
       * Max payout is the number of tokens left available
       * in this specific deposit interval.
       */
      maxPayout: {
        inBaseToken: maxPayoutInBaseToken,
        inQuoteToken: maxPayoutInQuoteToken,
      },
    };
  });
};
