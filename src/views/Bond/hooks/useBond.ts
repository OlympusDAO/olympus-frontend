import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import { EthereumNetwork, NetworkId } from "src/constants";
import { BOND_DEPOSITORY_CONTRACT, OP_BOND_DEPOSITORY_CONTRACT } from "src/constants/contracts";
import { OHM_TOKEN } from "src/constants/tokens";
import { getTokenByAddress } from "src/helpers/contracts/getTokenByAddress";
import { Token } from "src/helpers/contracts/Token";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { assert } from "src/helpers/types/assert";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";

export interface Bond {
  /**
   * Market id of this bond
   */
  id: string;
  /**
   * The token the market buys from the protocol
   */
  baseToken: Token;
  /**
   * The token that the market sells to the protocol
   */
  quoteToken: Token;
  /**
   * The discount relative to the current market price of the token being sold
   */
  discount: DecimalBigNumber;
  /**
   * The duration until the bond matures in seconds
   */
  duration: number;
  /**
   * Boolean describing whether this bond is
   * either fixed-term, or fixed-expiration
   */
  isFixedTerm: boolean;
  /**
   * A boolean describing whether or not this bond is
   * sold out at the current point in time.
   */
  isSoldOut: boolean;
  /**
   * Price of the bond
   */
  price: {
    inUsd: DecimalBigNumber;
    inBaseToken: DecimalBigNumber;
  };
  /*
   * Capacity is the number of tokens
   * left available for purchase
   */
  capacity: {
    inBaseToken: DecimalBigNumber;
    inQuoteToken: DecimalBigNumber;
  };
  /*
   * Max payout is the number of tokens left available
   * in this specific deposit interval.
   */
  maxPayout: {
    inBaseToken: DecimalBigNumber;
    inQuoteToken: DecimalBigNumber;
  };
  isV3Bond?: boolean;
  bondToken?: string;
}

export interface UseBondOptions {
  id: string;
  isInverseBond?: boolean;
  networkId: EthereumNetwork;
}

export const bondQueryKey = (options: UseBondOptions) => ["useBond", options] as const;

export const useBond = ({ id, isInverseBond = false }: Omit<UseBondOptions, "networkId">) => {
  const networks = useTestableNetworks();
  const args = { id, networkId: networks.MAINNET, isInverseBond };
  return useQuery([bondQueryKey(args)], () => fetchBond(args));
};

export const fetchBond = async ({ id, isInverseBond, networkId }: UseBondOptions) => {
  const contract = isInverseBond
    ? OP_BOND_DEPOSITORY_CONTRACT.getEthersContract(networkId)
    : BOND_DEPOSITORY_CONTRACT.getEthersContract(networkId);

  const [terms, market] = await Promise.all([contract.terms(id), contract.markets(id)]);

  const baseToken = isInverseBond
    ? await getTokenByAddress({ address: (market as any).baseToken, networkId })
    : OHM_TOKEN;
  assert(baseToken, `Unknown base token address: ${(market as any).baseToken}`);

  const quoteToken = isInverseBond ? OHM_TOKEN : await getTokenByAddress({ address: market.quoteToken, networkId });
  assert(quoteToken, `Unknown quote token address: ${market.quoteToken}`);

  const [baseTokenPerUsd, quoteTokenPerUsd, quoteTokenPerBaseToken] = await Promise.all([
    baseToken.getPrice(NetworkId.MAINNET),
    quoteToken.getPrice(NetworkId.MAINNET),
    contract.marketPrice(id).then(price => new DecimalBigNumber(price, baseToken.decimals)),
  ]);

  const priceInUsd = quoteTokenPerUsd.mul(quoteTokenPerBaseToken);
  const discount = baseTokenPerUsd.sub(priceInUsd).div(baseTokenPerUsd);

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

  const capacityData = calculateCapacity({
    capacity: market.capacity,
    capacityInQuote: market.capacityInQuote,
    quoteTokenDecimals: quoteToken.decimals,
    baseTokenDecimals: baseToken.decimals,
    quoteTokenPerBaseToken,
  });

  /*
   * maxPayout is the amount of capacity that should be utilized in a deposit
   * interval. for example, if capacity is 1,000 OHM, there are 10 days to conclusion,
   * and the preferred deposit interval is 1 day, max payout would be 100 OHM.
   */
  const maxPayoutInBaseToken = new DecimalBigNumber(market.maxPayout, baseToken.decimals);
  const maxPayoutInQuoteToken = new DecimalBigNumber(
    maxPayoutInBaseToken.mul(quoteTokenPerBaseToken).toString(),
    quoteToken.decimals,
  );

  /**
   * Bonds are sold out if either there is no capacity left,
   * or the maximum has been paid out for a specific interval.
   */

  const isSoldOut = isInverseBond
    ? capacityData.capacityInQuoteToken.lt("1")
    : capacityData.capacityInBaseToken.lt("1") || maxPayoutInBaseToken.lt("1");

  return {
    id,
    baseToken,
    quoteToken,
    discount,
    duration,
    isSoldOut,
    isFixedTerm: terms.fixedTerm,
    price: {
      inUsd: priceInUsd,
      inBaseToken: quoteTokenPerBaseToken,
    },
    capacity: {
      inBaseToken: capacityData.capacityInBaseToken,
      inQuoteToken: capacityData.capacityInQuoteToken,
    },
    maxPayout: {
      inBaseToken: maxPayoutInBaseToken,
      inQuoteToken: maxPayoutInQuoteToken,
    },
  };
};

/*
 * each market is initialized with a capacity
 *
 * this is either the number of OHM that the market can sell
 * (if capacity in quote is false),
 *
 * or the number of quote tokens that the market can buy
 * (if capacity in quote is true)
 */
export const calculateCapacity = ({
  capacity,
  capacityInQuote,
  quoteTokenDecimals,
  baseTokenDecimals,
  quoteTokenPerBaseToken,
}: {
  capacity: BigNumber;
  capacityInQuote: boolean;
  quoteTokenDecimals: number;
  baseTokenDecimals: number;
  quoteTokenPerBaseToken: DecimalBigNumber;
}) => {
  const marketCapacity = new DecimalBigNumber(capacity, capacityInQuote ? quoteTokenDecimals : baseTokenDecimals);

  const capacityInQuoteToken = capacityInQuote
    ? marketCapacity
    : new DecimalBigNumber(marketCapacity.mul(quoteTokenPerBaseToken).toString(), quoteTokenDecimals); // Convert to quoteToken if capacity is denominated in baseToken

  const capacityInBaseToken = capacityInQuote
    ? new DecimalBigNumber(marketCapacity.div(quoteTokenPerBaseToken).toString(), baseTokenDecimals) // Convert to baseToken if capacity is denominated in quoteToken
    : marketCapacity;

  return { marketCapacity, capacityInQuoteToken, capacityInBaseToken };
};
