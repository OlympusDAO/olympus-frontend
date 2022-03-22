import { OHMTokenStackProps } from "@olympusdao/component-library";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { BigNumber, ethers } from "ethers";
import { useQuery } from "react-query";
import { addresses, NetworkId, UnknownDetails, V2BondDetails, V2BondParser } from "src/constants";
import { BOND_DEPOSITORY_ADDRESSES } from "src/constants/addresses";
import { BONDS } from "src/constants/bonds";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { createDependentQuery } from "src/helpers/react-query/createDependentQuery";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { prettifySecondsInDays } from "src/helpers/timeUtil";
import { useStaticBondContract } from "src/hooks/useContract";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { useTokenPrice } from "src/hooks/useTokenPrice";
import { findOrLoadMarketPrice } from "src/slices/AppSlice";
import { BondDepository__factory } from "src/typechain";

const BASE_TOKEN_DECIMALS = 9;

export const liveBondDataQueryKey = (id: string) => ["useBond", id];

export const useLiveBondData = (id: string) => {
  const networks = useTestableNetworks();
  const contract = useStaticBondContract(BOND_DEPOSITORY_ADDRESSES[networks.MAINNET], networks.MAINNET);

  const bond = BONDS[id];

  // Dependent data
  const key = liveBondDataQueryKey(id);
  const useDependentQuery = createDependentQuery(key);
  const terms = useDependentQuery("terms", () => contract.terms(id));
  const baseTokenPerUsd = useTokenPrice(NetworkId.MAINNET, bond.baseToken).data;
  const quoteTokenPerUsd = useTokenPrice(NetworkId.MAINNET, bond.quoteToken).data;
  const quoteTokenPerBaseToken = useDependentQuery("marketPrice", () => contract.marketPrice(id));

  return useQuery(
    key,
    async () => {
      queryAssertion(baseTokenPerUsd && quoteTokenPerUsd && terms && quoteTokenPerBaseToken, key);

      const price = quoteTokenPerUsd.mul(new DecimalBigNumber(quoteTokenPerBaseToken, 9), 9);

      const discount = baseTokenPerUsd.sub(price).div(baseTokenPerUsd, 9);

      const duration = terms.fixedTerm ? terms.vesting : terms.conclusion - Date.now() / 1000;

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
         * The duration of the bond in seconds
         */
        duration,
      };
    },
    { enabled: !!baseTokenPerUsd && !!quoteTokenPerUsd && !!terms && !!quoteTokenPerBaseToken },
  );
};

async function processBond(
  bond: IBondV2Core,
  metadata: IBondV2Meta,
  terms: IBondV2Terms,
  index: number,
  provider: ethers.providers.JsonRpcProvider,
  networkID: NetworkId,
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
): Promise<IBondV2> {
  const depositoryContract = BondDepository__factory.connect(addresses[networkID].BOND_DEPOSITORY, provider);
  const bondParser = new V2BondParser(bond.quoteToken.toLowerCase(), networkID, provider);
  let v2BondDetail: V2BondDetails = await bondParser.details();

  if (!v2BondDetail) {
    v2BondDetail = UnknownDetails;
    console.error(`Add details for bond index=${index}`);
  }
  const quoteTokenPrice = await v2BondDetail.pricingFunction();
  const bondPriceBigNumber = await depositoryContract.marketPrice(index);
  const bondPrice = +bondPriceBigNumber / Math.pow(10, BASE_TOKEN_DECIMALS);
  const bondPriceUSD = quoteTokenPrice * +bondPrice;
  const ohmPrice = (await dispatch(findOrLoadMarketPrice({ provider, networkID })).unwrap())?.marketPrice;
  const bondDiscount = (ohmPrice - bondPriceUSD) / ohmPrice;
  const { capacityInBaseToken, capacityInQuoteToken } = getBondCapacities(
    bond,
    metadata.quoteDecimals,
    bondPriceBigNumber,
  );
  const maxPayoutInBaseToken: string = ethers.utils.formatUnits(bond.maxPayout, BASE_TOKEN_DECIMALS);
  const maxPayoutInQuoteToken: string = ethers.utils.formatUnits(
    convertAmountInBondUnitToQuoteTokenUnit(bond.maxPayout, bondPriceBigNumber, metadata.quoteDecimals),
    metadata.quoteDecimals,
  );
  const duration = getBondDuration(terms);

  const soldOut = +capacityInBaseToken < 1 || +maxPayoutInBaseToken < 1;

  const maxPayoutOrCapacityInQuote =
    +capacityInQuoteToken > +maxPayoutInQuoteToken ? maxPayoutInQuoteToken : capacityInQuoteToken;
  const maxPayoutOrCapacityInBase =
    +capacityInBaseToken > +maxPayoutInBaseToken ? maxPayoutInBaseToken : capacityInBaseToken;

  return {
    ...bond,
    ...metadata,
    ...terms,
    index: index,
    displayName: `${v2BondDetail.name}`,
    payoutName: `OHM`,
    priceUSD: bondPriceUSD,
    priceToken: bondPrice,
    priceTokenBigNumber: bondPriceBigNumber,
    discount: bondDiscount,
    expiration: new Date(terms.vesting * 1000).toDateString(),
    duration,
    isLP: v2BondDetail.isLP,
    lpUrl: v2BondDetail.isLP ? v2BondDetail.lpUrl : "",
    marketPrice: ohmPrice,
    quoteToken: bond.quoteToken.toLowerCase(),
    baseToken: "OHM",
    baseDecimals: BASE_TOKEN_DECIMALS,
    maxPayoutInQuoteToken,
    maxPayoutInBaseToken,
    capacityInQuoteToken,
    capacityInBaseToken,
    soldOut,
    maxPayoutOrCapacityInQuote,
    maxPayoutOrCapacityInBase,
    bondIconSvg: v2BondDetail.bondIconSvg,
    payoutIconSvg: ["OHM"],
  };
}

interface IBondV2 extends IBondInverseCore, IBondInverseMeta, IBondV2Terms {
  index: number;
  displayName: string;
  payoutName: string;
  priceUSD: number;
  priceToken: number;
  priceTokenBigNumber: BigNumber;
  discount: number;
  duration: string;
  expiration: string;
  isLP: boolean;
  lpUrl: string;
  marketPrice: number;
  soldOut: boolean;
  capacityInBaseToken: string;
  capacityInQuoteToken: string;
  maxPayoutInBaseToken: string;
  maxPayoutInQuoteToken: string;
  maxPayoutOrCapacityInQuote: string;
  maxPayoutOrCapacityInBase: string;
  bondIconSvg: OHMTokenStackProps["tokens"];
  payoutIconSvg: OHMTokenStackProps["tokens"];
}

interface IBondInverseCore extends IBondV2Core {
  // creator: string;
  baseToken: string;
  // call: boolean;
}

interface IBondInverseMeta extends IBondV2Meta {
  baseDecimals: number;
}

interface IBondV2Core {
  quoteToken: string;
  capacityInQuote: boolean;
  capacity: BigNumber;
  totalDebt: BigNumber;
  maxPayout: BigNumber;
  purchased: BigNumber;
  sold: BigNumber;
}

interface IBondV2Meta {
  lastTune: number;
  lastDecay: number;
  length: number;
  depositInterval: number;
  tuneInterval: number;
  quoteDecimals: number;
}

interface IBondV2Terms {
  fixedTerm: boolean;
  controlVariable: ethers.BigNumber;
  vesting: number;
  conclusion: number;
  maxDebt: ethers.BigNumber;
}

function convertAmountInBondUnitToQuoteTokenUnit(
  amountInBondUnit: BigNumber,
  price: BigNumber,
  decimals: number,
): BigNumber {
  return amountInBondUnit.mul(price).div(Math.pow(10, 2 * BASE_TOKEN_DECIMALS - decimals));
}

function convertAmountInBondUnitToBaseTokenUnit(
  amountInBondUnit: BigNumber,
  decimals: number,
  price: BigNumber,
): BigNumber {
  return amountInBondUnit.mul(Math.pow(10, 2 * BASE_TOKEN_DECIMALS - decimals)).div(price);
}

function getBondCapacities(bond: IBondV2Core, quoteDecimals: number, bondPriceBigNumber: BigNumber) {
  let capacityInBaseToken: string, capacityInQuoteToken: string;
  if (bond.capacityInQuote) {
    capacityInBaseToken = ethers.utils.formatUnits(
      convertAmountInBondUnitToBaseTokenUnit(bond.capacity, quoteDecimals, bondPriceBigNumber),
      BASE_TOKEN_DECIMALS,
    );
    capacityInQuoteToken = ethers.utils.formatUnits(bond.capacity, quoteDecimals);
  } else {
    capacityInBaseToken = ethers.utils.formatUnits(bond.capacity, BASE_TOKEN_DECIMALS);
    capacityInQuoteToken = ethers.utils.formatUnits(
      convertAmountInBondUnitToQuoteTokenUnit(bond.capacity, bondPriceBigNumber, quoteDecimals),
      quoteDecimals,
    );
  }
  return { capacityInBaseToken, capacityInQuoteToken };
}

function getBondDuration(terms: IBondV2Terms): string {
  const currentTime = Date.now() / 1000;
  let secondsRemaining = 0;

  if (terms.fixedTerm) {
    secondsRemaining = terms.vesting;
  } else {
    const conclusionTime = terms.conclusion;
    secondsRemaining = conclusionTime - currentTime;
  }

  return prettifySecondsInDays(secondsRemaining);
}
