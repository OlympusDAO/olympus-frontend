import { useQuery } from "@tanstack/react-query";
import { NetworkId } from "src/constants";
import { BOND_FIXED_TERM_SDA_ADDRESSES } from "src/constants/addresses";
import {
  BOND_AGGREGATOR_CONTRACT,
  BOND_FIXED_EXPIRY_SDA_CONTRACT,
  BOND_FIXED_EXPIRY_TELLER,
  BOND_FIXED_TERM_SDA_CONTRACT,
} from "src/constants/contracts";
import { OHM_TOKEN } from "src/constants/tokens";
import { getTokenByAddress } from "src/helpers/contracts/getTokenByAddress";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { assert } from "src/helpers/types/assert";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { UseBondOptions } from "src/views/Bond/hooks/useBond";

export const bondV3QueryKey = (options: UseBondOptions) => ["useBondV3", options] as const;

export const useBondV3 = ({ id, isInverseBond = false }: Omit<UseBondOptions, "networkId">) => {
  console.log(id, "id");
  const networks = useTestableNetworks();
  const args = { id, networkId: networks.MAINNET, isInverseBond };
  return useQuery([bondV3QueryKey(args)], () => fetchBondV3(args));
};

export const fetchBondV3 = async ({ id, isInverseBond, networkId }: UseBondOptions) => {
  const aggregatorContract = BOND_AGGREGATOR_CONTRACT.getEthersContract(networkId);
  const auctioneerAddress = await aggregatorContract.getAuctioneer(id);
  const fixedTerm = auctioneerAddress === BOND_FIXED_TERM_SDA_ADDRESSES[networkId];
  console.log(fixedTerm, auctioneerAddress, BOND_FIXED_TERM_SDA_ADDRESSES[networkId], "fixedTerm", id);
  const auctioneerContract = fixedTerm
    ? BOND_FIXED_TERM_SDA_CONTRACT.getEthersContract(networkId)
    : BOND_FIXED_EXPIRY_SDA_CONTRACT.getEthersContract(networkId);

  const market = await auctioneerContract.markets(id);

  console.log(id, isInverseBond, market.payoutToken, market.quoteToken, "v3");

  const baseToken = isInverseBond ? await getTokenByAddress({ address: market.payoutToken, networkId }) : OHM_TOKEN;
  assert(baseToken, `Unknown base token address: ${market.payoutToken}`);

  const quoteToken = isInverseBond ? OHM_TOKEN : await getTokenByAddress({ address: market.quoteToken, networkId });
  assert(quoteToken, `Unknown quote token address: ${market.quoteToken}`);

  //we shouldnt return an OHM bond as an inverse bond
  if (baseToken === quoteToken && isInverseBond) return null;
  const terms = await auctioneerContract.terms(id);
  console.log(id, market, terms, "test", isInverseBond);
  console.log(id, baseToken, isInverseBond, "base token", market.payoutToken);

  const [baseTokenPerUsd, quoteTokenPerUsd, quoteTokenPerBaseToken] = await Promise.all([
    baseToken.getPrice(NetworkId.MAINNET),
    quoteToken.getPrice(NetworkId.MAINNET),
    auctioneerContract.marketPrice(id).then(price => new DecimalBigNumber(price, 36)),
  ]);

  console.log(baseTokenPerUsd, quoteTokenPerUsd, quoteTokenPerBaseToken, baseTokenPerUsd, id, "debug");
  const bondTeller = BOND_FIXED_EXPIRY_TELLER.getEthersContract(networkId);
  const bondToken = await bondTeller.getBondTokenForMarket(id);
  const priceInUsd = quoteTokenPerUsd.mul(quoteTokenPerBaseToken);
  const discount = priceInUsd.sub(baseTokenPerUsd).div(priceInUsd);

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
  const duration = fixedTerm ? terms.vesting : terms.vesting - Date.now() / 1000;

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
    market.capacity,
    market.capacityInQuote ? quoteToken.decimals : baseToken.decimals,
  );

  const capacityInQuoteToken = market.capacityInQuote
    ? capacity
    : new DecimalBigNumber(capacity.mul(quoteTokenPerBaseToken).toString(), quoteToken.decimals); // Convert to quoteToken if capacity is denominated in baseToken

  const capacityInBaseToken = market.capacityInQuote
    ? new DecimalBigNumber(capacity.div(quoteTokenPerBaseToken).toString(), baseToken.decimals) // Convert to baseToken if capacity is denominated in quoteToken
    : capacity;

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
    ? capacityInQuoteToken.lt("1")
    : capacityInBaseToken.lt("1") || maxPayoutInBaseToken.lt("1");

  return {
    id,
    baseToken,
    quoteToken,
    discount,
    duration,
    isSoldOut,
    isFixedTerm: fixedTerm,
    price: {
      inUsd: priceInUsd,
      inBaseToken: quoteTokenPerBaseToken,
    },
    capacity: {
      inBaseToken: capacityInBaseToken,
      inQuoteToken: capacityInQuoteToken,
    },
    maxPayout: {
      inBaseToken: maxPayoutInBaseToken,
      inQuoteToken: maxPayoutInQuoteToken,
    },
    isV3Bond: true,
    bondToken,
  };
};
