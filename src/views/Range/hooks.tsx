import { t } from "@lingui/macro";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BigNumber, ContractReceipt, ethers } from "ethers";
import { gql, request } from "graphql-request";
import toast from "react-hot-toast";
import { DAO_TREASURY_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import {
  BOND_AGGREGATOR_CONTRACT,
  RANGE_CONTRACT,
  RANGE_OPERATOR_CONTRACT,
  RANGE_PRICE_CONTRACT,
} from "src/constants/contracts";
import { OHM_TOKEN } from "src/constants/tokens";
import { parseBigNumber } from "src/helpers";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { getTokenByAddress } from "src/helpers/contracts/getTokenByAddress";
// import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { isValidAddress } from "src/helpers/misc/isValidAddress";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { assert } from "src/helpers/types/assert";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { BondFixedTermSDA__factory, BondTeller__factory, IERC20__factory } from "src/typechain";
import { OlympusRange } from "src/typechain/Range";
import { useNetwork, useSigner } from "wagmi";

/**Chainlink Price Feed. Retrieves OHMETH and ETH/{RESERVE} feed **/
export const OHMPriceHistory = (assetPair = "OHMv2/ETH") => {
  const graphURL = "https://api.thegraph.com/subgraphs/name/openpredict/chainlink-prices-subgraph";
  const {
    data = [],
    isFetched,
    isLoading,
  } = useQuery(["getOHMPriceHistory", assetPair], async () => {
    const data = await request(
      graphURL,
      gql`
        {
          prices(where: { assetPair: "${assetPair}" }, orderBy: timestamp, first: 8, orderDirection: desc) {
            price
            timestamp
          }
        }
      `,
    );
    return data.prices;
  });

  return { data, isFetched, isLoading };
};

export const ReservePriceHistory = (reserveToken: string) => {
  const graphURL = "https://api.thegraph.com/subgraphs/name/openpredict/chainlink-prices-subgraph";
  const {
    data = [],
    isFetched,
    isLoading,
  } = useQuery(["getReservePriceHistory", reserveToken], async () => {
    const data = await request(
      graphURL,
      gql`
          {
            prices(where: { assetPair: "${reserveToken}/ETH" }, orderBy: timestamp, first: 8, orderDirection: desc) {
              price
              timestamp
            }
          }
        `,
    );
    return data.prices;
  });

  return { data, isFetched, isLoading };
};

/**
 * Returns the price of OHM per Reserve Asset
 * @param reserveToken Reserve Asset
 * */
export const PriceHistory = (reserveToken: string) => {
  const { data: ohmPriceData } = OHMPriceHistory();
  const { data: reservePriceData } = ReservePriceHistory(reserveToken);
  const {
    data = [],
    isFetched,
    isLoading,
  } = useQuery(
    ["getPriceHistory", ohmPriceData, reservePriceData],
    () => {
      const prices = ohmPriceData.map((ohmPrice: { price: number; timestamp: number }, index: any) => {
        return {
          price: ohmPrice.price / 1e18 / (reservePriceData[index].price / 1e18),
          timestamp: new Date(ohmPrice.timestamp * 1000).toLocaleString(),
        };
      });
      return prices;
    },
    { enabled: ohmPriceData.length > 0 && reservePriceData.length > 0 },
  );
  return { data, isFetched, isLoading };
};

/**
 * Returns the current price of the Operator at the given address
 */
export const OperatorPrice = () => {
  const { chain = { id: 1 } } = useNetwork();

  const contract = RANGE_PRICE_CONTRACT.getEthersContract(chain.id);
  const { data, isFetched, isLoading } = useQuery(["getOperatorPrice", chain], async () => {
    return parseBigNumber(await contract.getCurrentPrice(), 18);
  });
  return { data, isFetched, isLoading };
};

/**
 * Returns the current price of the Operator at the given address
 */
export const OperatorMovingAverage = () => {
  const { chain = { id: 1 } } = useNetwork();

  const contract = RANGE_PRICE_CONTRACT.getEthersContract(chain.id);
  const {
    data = { movingAverage: 0, days: 30 },
    isFetched,
    isLoading,
  } = useQuery(["getOperatorMovingAverage", chain], async () => {
    const movingAverage = parseBigNumber(await contract.getMovingAverage(), 18);
    const movingAverageSeconds = await contract.movingAverageDuration();
    const days = movingAverageSeconds / 60 / 60 / 24; //seconds to days;
    return { movingAverage, days };
  });
  return { data, isFetched, isLoading };
};

/**
 * Returns the reserve contract address on the Operator
 */
export const OperatorReserveSymbol = () => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = RANGE_CONTRACT.getEthersContract(chain.id);
  const {
    data = { symbol: "", reserveAddress: "" },
    isFetched,
    isLoading,
  } = useQuery(["getOperatorReserveSymbol", chain], async () => {
    const provider = Providers.getStaticProvider(chain.id);
    const reserveAddress = await contract.reserve();
    const TokenContract = IERC20__factory.connect(reserveAddress, provider);
    const symbol = await TokenContract.symbol();
    return { reserveAddress, symbol };
  });
  return { data, isFetched, isLoading };
};

/**
 * Returns Range Data from range contract
 */

export const RangeData = () => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = RANGE_CONTRACT.getEthersContract(chain.id);

  const {
    data = {
      high: sideStruct,
      low: sideStruct,
      wall: band,
      cushion: band,
    } as OlympusRange.RangeStructOutput,
    isFetched,
    isLoading,
  } = useQuery(["getRangeData", chain.id], async () => {
    const range = await contract.range();
    return range;
  });
  return { data, isFetched, isLoading };
};

const sideStruct: OlympusRange.SideStruct = {
  active: false,
  lastActive: 0,
  capacity: BigNumber.from(0),
  threshold: BigNumber.from(0),
  market: BigNumber.from(-1),
};
const line: OlympusRange.LineStruct = {
  price: BigNumber.from(0),
};

const band: OlympusRange.BandStruct = {
  high: line,
  low: line,
  spread: BigNumber.from(0),
};

/**
 * Returns the market price for the given bond market
 * @param id Bond Market ID
 */
export const RangeBondPrice = (id: BigNumber, side: "low" | "high") => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = BOND_AGGREGATOR_CONTRACT.getEthersContract(chain.id);
  const { data, isFetched, isLoading } = useQuery(
    ["getRangeBondPrice", id, chain, side],
    async () => {
      const bondPrice = await contract.marketPrice(id);
      const auctioneerAddress = await contract.getAuctioneer(id);
      const auctioneerContract = BondFixedTermSDA__factory.connect(auctioneerAddress, contract.provider);
      const market = await auctioneerContract.markets(id);
      const inverse =
        market.payoutToken.toLowerCase() !== OHM_ADDRESSES[chain.id as keyof typeof OHM_ADDRESSES].toLowerCase();
      const baseToken = inverse
        ? await getTokenByAddress({ address: market.payoutToken, networkId: chain.id })
        : OHM_TOKEN;
      assert(baseToken, `Unknown base token address: ${market.payoutToken}`);
      const quoteToken = inverse
        ? OHM_TOKEN
        : await getTokenByAddress({ address: market.quoteToken, networkId: chain.id });
      assert(quoteToken, `Unknown quote token address: ${market.quoteToken}`);

      const scale = await contract.marketScale(id);
      const baseScale = BigNumber.from("10").pow(BigNumber.from("36").add(baseToken.decimals).sub(quoteToken.decimals));
      const shift = Number(baseScale) / Number(scale);

      if (side === "low") {
        return 1 / parseBigNumber(bondPrice.mul(shift), 36);
      }
      return parseBigNumber(bondPrice.mul(shift), 36);
    },
    {
      enabled: id.gt(-1) && id.lt(ethers.constants.MaxUint256),
    }, //Disable this query for negative markets (default value) or Max Integer (market not active from range call)
  );
  return { data, isFetched, isLoading };
};

export const RangeBondMaxPayout = (id: BigNumber) => {
  const { chain = { id: 1 } } = useNetwork();
  const aggregatorContract = BOND_AGGREGATOR_CONTRACT.getEthersContract(chain.id);

  const { data, isFetched, isLoading } = useQuery(
    ["getRangeBondMaxPayout", id, chain],
    async () => {
      const auctioneerAddress = await aggregatorContract.getAuctioneer(id);
      const contract = BondFixedTermSDA__factory.connect(auctioneerAddress, aggregatorContract.provider);
      const { maxPayout } = await contract.getMarketInfoForPurchase(id);
      return maxPayout;
    },
    {
      enabled: id.gt(-1) && id.lt(ethers.constants.MaxUint256),
    }, //Disable this query for negative markets (default value) or Max Integer (market not active from range call)
  );
  return { data, isFetched, isLoading };
};

export const BondTellerAddress = (id: BigNumber) => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = BOND_AGGREGATOR_CONTRACT.getEthersContract(chain.id);
  const { data, isFetched, isLoading } = useQuery(
    ["getRangeBondTeller", id, chain],
    async () => {
      const tellerAddress = await contract.getTeller(id);
      return tellerAddress;
    },
    {
      enabled: id.gt(-1) && id.lt(ethers.constants.MaxUint256),
    }, //Disable this query for negative markets (default value) or Max Integer (market not active from range call)
  );
  return { data, isFetched, isLoading };
};

/**
 *
 * @param bidOrAsk Return bid or ask side
 * @returns Price and Type of Contract (Bond or Swap)
 * @info
 * Buy Tab:
 * If market price is in cushion, ask price should check if bond market is active.
 * Anywhere else, ask price is wall high
 * Sell Tab:
 * in cushion, bid price = bond price if market is active
 * anywhere else, bid price is wall low.
 **/

export const DetermineRangePrice = (bidOrAsk: "bid" | "ask") => {
  const { data: rangeData } = RangeData();
  const { data: upperBondMarket = 0 } = RangeBondPrice(rangeData.high.market, "high");
  const { data: lowerBondMarket = 0 } = RangeBondPrice(rangeData.low.market, "low");
  const {
    data = { price: 0, contract: "swap" },
    isFetched,
    isLoading,
  } = useQuery(
    ["getDetermineRangePrice", bidOrAsk, rangeData, upperBondMarket, lowerBondMarket],
    async () => {
      const sideActive = bidOrAsk === "ask" ? rangeData.high.active : rangeData.low.active;
      const market = bidOrAsk === "ask" ? rangeData.high.market : rangeData.low.market;
      const activeBondMarket = market.gt(-1) && market.lt(ethers.constants.MaxUint256); //>=0 <=MAXUint256
      if (sideActive && activeBondMarket) {
        return {
          price: bidOrAsk === "ask" ? upperBondMarket : lowerBondMarket,
          contract: "bond" as RangeContracts,
        };
      } else {
        return {
          price:
            bidOrAsk === "ask"
              ? parseBigNumber(rangeData.wall.high.price, 18)
              : parseBigNumber(rangeData.wall.low.price, 18),
          contract: "swap" as RangeContracts,
        };
      }
    },
    { enabled: !!rangeData },
  );

  return { data, isFetched, isLoading };
};

export const DetermineRangeDiscount = (bidOrAsk: "bid" | "ask") => {
  const { data: currentOhmPrice } = OperatorPrice();
  const { data: reserveSymbol } = OperatorReserveSymbol();

  const { data: bidOrAskPrice } = DetermineRangePrice(bidOrAsk);
  const {
    data = { discount: 0, quoteToken: "" },
    isFetched,
    isLoading,
  } = useQuery(
    ["getDetermineRangeDiscount", currentOhmPrice, bidOrAskPrice, reserveSymbol, bidOrAsk],
    () => {
      queryAssertion(currentOhmPrice);

      const discount =
        (currentOhmPrice - bidOrAskPrice.price) / (bidOrAsk == "bid" ? -currentOhmPrice : currentOhmPrice);
      return { discount, quoteToken: bidOrAsk === "ask" ? "OHM" : reserveSymbol.symbol };
    },
    { enabled: !!currentOhmPrice && !!bidOrAskPrice.price && !!reserveSymbol.symbol },
  );

  return { data, isFetched, isLoading };
};

type RangeContracts = "swap" | "bond";
/**
 * Executes Range Swap Transaction and routes it to the appropriate contract.
 * Either Swap on the operator, or purchase on the bond teller.
 */
export const RangeSwap = () => {
  const networks = useTestableNetworks();
  const { data: signer } = useSigner();
  const { chain = { id: 1 } } = useNetwork();
  const referrer = DAO_TREASURY_ADDRESSES[networks.MAINNET];

  return useMutation<
    ContractReceipt,
    Error,
    {
      market: BigNumber;
      tokenAddress: string;
      amount: string;
      swapType: "bond" | "swap";
      receiveAmount: string;
      sellActive: boolean;
      slippage: string;
      recipientAddress: string;
    }
  >(
    async ({ market, tokenAddress, swapType, amount, receiveAmount, sellActive, slippage, recipientAddress }) => {
      const decimals = tokenAddress === OHM_ADDRESSES[chain.id as keyof typeof OHM_ADDRESSES] ? 9 : 18;
      const receiveDecimals = tokenAddress === OHM_ADDRESSES[chain.id as keyof typeof OHM_ADDRESSES] ? 18 : 9; //opposite of send
      if (!signer) throw new Error(t`Please connect a wallet to Range Swap`);

      if (!isValidAddress(recipientAddress) || recipientAddress === "") throw new Error(t`Invalid address`);

      const swapAmount = new DecimalBigNumber(amount, decimals);
      const receiveAmountBN = new DecimalBigNumber(receiveAmount, receiveDecimals);

      //slippage
      const parsedSlippage = new DecimalBigNumber(slippage, decimals);
      const slippageAsPercent = parsedSlippage.div("100");
      const minAmountReceived = receiveAmountBN.mul(new DecimalBigNumber("1").sub(slippageAsPercent));

      if (swapType === "swap") {
        const contract = RANGE_OPERATOR_CONTRACT.getEthersContract(networks.MAINNET).connect(signer);
        const transaction = await contract.swap(
          tokenAddress,
          swapAmount.toBigNumber(decimals),
          minAmountReceived.toBigNumber(receiveDecimals),
        );
        return transaction.wait();
      }

      //first get the bond teller address from the aggregator, then purchase bond on returned address.
      const contract = BOND_AGGREGATOR_CONTRACT.getEthersContract(networks.MAINNET).connect(signer);
      const tellerAddress = await contract.getTeller(market);

      const tellerContract = BondTeller__factory.connect(tellerAddress, signer);

      const transaction = await tellerContract.purchase(
        recipientAddress,
        referrer,
        market,
        swapAmount.toBigNumber(decimals),
        minAmountReceived.toBigNumber(receiveDecimals),
      );
      return transaction.wait();
    },
    {
      onError: error => {
        toast.error(error.message);
      },
      onSuccess: async (tx, { market }) => {
        trackGAEvent({
          category: "Range",
          action: "Swap",
          label: market.toString() ?? "unknown",
          dimension1: tx.transactionHash,
          dimension2: tx.from, // the signer, not necessarily the receipient
        });

        trackGtagEvent("Range", {
          event_category: "Swap",
          event_label: market.toString() ?? "unknown",
          address: tx.from, // the signer, not necessarily the receipient
          txHash: tx.transactionHash,
        });

        toast(t`Range Swap Successful`);
      },
    },
  );
};
