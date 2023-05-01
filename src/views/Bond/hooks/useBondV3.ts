import { useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { NetworkId } from "src/constants";
import { BOND_AGGREGATOR_CONTRACT, BOND_FIXED_EXPIRY_TELLER } from "src/constants/contracts";
import { OHM_TOKEN } from "src/constants/tokens";
import { getTokenByAddress } from "src/helpers/contracts/getTokenByAddress";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { assert } from "src/helpers/types/assert";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import {
  BondFixedExpirySDA__factory,
  BondFixedExpiryTeller__factory,
  BondFixedTermSDA__factory,
} from "src/typechain/factories";
import { calculateCapacity, UseBondOptions } from "src/views/Bond/hooks/useBond";

export const bondV3QueryKey = (options: UseBondOptions) => ["useBondV3", options] as const;

export const useBondV3 = ({ id, isInverseBond = false }: Omit<UseBondOptions, "networkId">) => {
  const networks = useTestableNetworks();
  const args = { id, networkId: networks.MAINNET, isInverseBond };
  return useQuery([bondV3QueryKey(args)], () => fetchBondV3(args), {
    enabled: BigNumber.from(args.id).gt("-1") && BigNumber.from(args.id).lt(ethers.constants.MaxUint256),
  });
};

export const fetchBondV3 = async ({ id, isInverseBond, networkId }: UseBondOptions) => {
  const aggregatorContract = BOND_AGGREGATOR_CONTRACT.getEthersContract(networkId);
  const auctioneerAddress = await aggregatorContract.getAuctioneer(id);
  const tellerAddress = await aggregatorContract.getTeller(id);
  const isLive = await aggregatorContract.isLive(id);
  const tellerContract = BondFixedExpiryTeller__factory.connect(tellerAddress, aggregatorContract.provider);

  /*
  bondTokenImplementation method only exists on the fixed expiry teller. 
  If call fails, then we know it's a fixed term bond.
  */
  let fixedTerm = false;
  try {
    fixedTerm = (await tellerContract.bondTokenImplementation()) ? false : true;
  } catch {
    fixedTerm = true;
  }
  const auctioneerContract = fixedTerm
    ? BondFixedTermSDA__factory.connect(auctioneerAddress, aggregatorContract.provider)
    : BondFixedExpirySDA__factory.connect(auctioneerAddress, aggregatorContract.provider);

  const market = await auctioneerContract.markets(id);
  const baseToken = isInverseBond ? await getTokenByAddress({ address: market.payoutToken, networkId }) : OHM_TOKEN;
  assert(baseToken, `Unknown base token address: ${market.payoutToken}`);

  const quoteToken = isInverseBond ? OHM_TOKEN : await getTokenByAddress({ address: market.quoteToken, networkId });
  assert(quoteToken, `Unknown quote token address: ${market.quoteToken}`);

  //we shouldnt return an OHM bond as an inverse bond
  if (baseToken === quoteToken && isInverseBond) return null;

  const terms = await auctioneerContract.terms(id);

  const [baseTokenPerUsd, quoteTokenPerUsd, bondMarketPrice] = await Promise.all([
    baseToken.getPrice(NetworkId.MAINNET),
    quoteToken.getPrice(NetworkId.MAINNET),
    auctioneerContract.marketPrice(id).then(price => price),
  ]);

  /**
   * The price decimal scaling for a market is split between
   * the price value and the scale value to be able to support a broader range of inputs.
   * Specifically, half of it is in the scale and half in the price.
   * To normalize the price value for display, we can add the half that is in the scale factor back to it.
   */
  const scale = await aggregatorContract.marketScale(id);
  const baseScale = BigNumber.from("10").pow(BigNumber.from("36").add(baseToken.decimals).sub(quoteToken.decimals));
  const shift = baseScale.div(scale);

  const quoteTokenPerBaseToken = new DecimalBigNumber(bondMarketPrice.mul(shift), 36);
  const bondTeller = BOND_FIXED_EXPIRY_TELLER.getEthersContract(networkId);
  let bondToken = "";
  try {
    bondToken = await bondTeller.getBondTokenForMarket(id);
  } catch (e) {
    console.log("not an ohm bond");
  }
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
  const duration = fixedTerm ? terms.vesting : terms.vesting - Date.now() / 1000;

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
    isFixedTerm: fixedTerm,
    price: {
      inUsd: priceInUsd,
      inBaseToken: quoteTokenPerBaseToken,
    },
    capacity: {
      inBaseToken: capacityData.capacityInBaseToken.mul(new DecimalBigNumber("0.99")), //reduce capacity by 1%
      inQuoteToken: capacityData.capacityInQuoteToken.mul(new DecimalBigNumber("0.99")), //reduce capacity by 1%
    },
    maxPayout: {
      inBaseToken: maxPayoutInBaseToken.mul(new DecimalBigNumber("0.99")), //reduce payout by 1%
      inQuoteToken: maxPayoutInQuoteToken.mul(new DecimalBigNumber("0.99")), //reduce payout by 1%
    },
    isV3Bond: true,
    bondToken,
    isLive,
  };
};
