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
import { parseBigNumber } from "src/helpers";
import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { isValidAddress } from "src/helpers/misc/isValidAddress";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { useOhmPrice } from "src/hooks/usePrices";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { BondFixedTermSDA__factory, BondTeller__factory, IERC20__factory } from "src/typechain";
import { RANGEv1 as OlympusRange } from "src/typechain/Range";
import { useBondV3 } from "src/views/Bond/hooks/useBondV3";
import { useSigner } from "wagmi";

/**Chainlink Price Feed. Retrieves OHMETH and ETH/{RESERVE} feed **/
export const PriceHistory = ({ assetPair = "OHMv2/ETH", reserveSymbol = "" }) => {
  const graphURL = "https://api.thegraph.com/subgraphs/name/openpredict/chainlink-prices-subgraph";
  const {
    data = [],
    isFetched,
    isLoading,
  } = useQuery(["getPriceHistory", assetPair, reserveSymbol], async () => {
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

    const prices = await Promise.all(
      data.prices.flatMap(async (ohmData: { price: number; timestamp: number }) => {
        const reservePrice = await request(
          graphURL,
          gql`
            {
              prices(where: { assetPair: "${reserveSymbol}/ETH" timestamp_lte: ${ohmData.timestamp}}, orderBy: timestamp, first: 1, orderDirection: desc) {
                price
                timestamp
              }
            }
          `,
        );

        return {
          price: ohmData.price / 1e18 / (reservePrice.prices[0].price / 1e18),
          timestamp: new Date(ohmData.timestamp * 1000).toLocaleString(),
        };
      }),
    );
    return prices;
  });

  return { data, isFetched, isLoading };
};

/**
 * Returns the current price of the Operator at the given address
 */
export const OperatorPrice = () => {
  const networks = useTestableNetworks();

  const contract = RANGE_PRICE_CONTRACT.getEthersContract(networks.MAINNET);
  const { data, isFetched, isLoading } = useQuery(["getOperatorPrice", networks.MAINNET], async () => {
    return parseBigNumber(await contract.getCurrentPrice(), 18);
  });
  return { data, isFetched, isLoading };
};

/**
 * Returns the Target price of the Operator at the given address
 */
export const OperatorTargetPrice = () => {
  const networks = useTestableNetworks();

  const contract = RANGE_PRICE_CONTRACT.getEthersContract(networks.MAINNET);
  const {
    data = 0,
    isFetched,
    isLoading,
  } = useQuery(["getOperatorTargetPrice", networks.MAINNET], async () => {
    const targetPrice = parseBigNumber(await contract.getTargetPrice(), 18);

    return targetPrice;
  });
  return { data, isFetched, isLoading };
};

/**
 * Returns the Target price of the Operator at the given address
 */
export const OperatorMovingAverage = () => {
  const networks = useTestableNetworks();
  const contract = RANGE_PRICE_CONTRACT.getEthersContract(networks.MAINNET);
  const {
    data = { movingAverage: 0, days: 30 },
    isFetched,
    isLoading,
  } = useQuery(["getOperatorMovingAverage", networks.MAINNET], async () => {
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
  const networks = useTestableNetworks();
  const contract = RANGE_CONTRACT.getEthersContract(networks.MAINNET);
  const {
    data = { symbol: "", reserveAddress: "" },
    isFetched,
    isLoading,
  } = useQuery(["getOperatorReserveSymbol", networks.MAINNET], async () => {
    const provider = Providers.getStaticProvider(networks.MAINNET);
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
  const networks = useTestableNetworks();
  const contract = RANGE_CONTRACT.getEthersContract(networks.MAINNET);

  const {
    data = {
      high: sideStruct,
      low: sideStruct,
      wall: band,
      cushion: band,
    } as OlympusRange.RangeStructOutput,
    isFetched,
    isLoading,
  } = useQuery(["getRangeData", networks.MAINNET], async () => {
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

export const RangeBondMaxPayout = (id: BigNumber) => {
  const networks = useTestableNetworks();
  const aggregatorContract = BOND_AGGREGATOR_CONTRACT.getEthersContract(networks.MAINNET);

  const { data, isFetched, isLoading } = useQuery(
    ["getRangeBondMaxPayout", id, networks.MAINNET],
    async () => {
      const auctioneerAddress = await aggregatorContract.getAuctioneer(id);
      const contract = BondFixedTermSDA__factory.connect(auctioneerAddress, aggregatorContract.provider);
      const { maxPayout } = await contract.getMarketInfoForPurchase(id);
      const capacity = await contract.currentCapacity(id);
      const maxAmount = maxPayout.lt(capacity) ? maxPayout : capacity;
      return maxAmount;
    },
    {
      enabled: id.gt(-1) && id.lt(ethers.constants.MaxUint256),
    }, //Disable this query for negative markets (default value) or Max Integer (market not active from range call)
  );
  return { data, isFetched, isLoading };
};

export const BondTellerAddress = (id: BigNumber) => {
  const networks = useTestableNetworks();
  const contract = BOND_AGGREGATOR_CONTRACT.getEthersContract(networks.MAINNET);
  const { data, isFetched, isLoading } = useQuery(
    ["getRangeBondTeller", id, networks.MAINNET],
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
  const { data: upperBondMarket } = useBondV3({ id: rangeData.high.market.toString() });
  const { data: lowerBondMarket } = useBondV3({ id: rangeData.low.market.toString(), isInverseBond: true });
  const {
    data = { price: 0, contract: "swap" },
    isFetched,
    isLoading,
  } = useQuery(
    ["getDetermineRangePrice", bidOrAsk, rangeData, upperBondMarket, lowerBondMarket],
    async () => {
      const liveOnBondAggregator = (bidOrAsk === "ask" ? upperBondMarket?.isLive : lowerBondMarket?.isLive) || false;
      const sideActive = bidOrAsk === "ask" ? rangeData.high.active : rangeData.low.active;
      const market = bidOrAsk === "ask" ? rangeData.high.market : rangeData.low.market;
      const activeBondMarket = market.gt(-1) && market.lt(ethers.constants.MaxUint256) && liveOnBondAggregator; //>=0 <=MAXUint256
      const bondOutsideWall =
        bidOrAsk === "ask"
          ? upperBondMarket?.price.inBaseToken.gt(new DecimalBigNumber(rangeData.wall.high.price, 18))
          : lowerBondMarket
          ? new DecimalBigNumber("1")
              .div(lowerBondMarket?.price.inBaseToken)
              .lt(new DecimalBigNumber(rangeData.wall.low.price, 18))
          : false;
      if (sideActive && activeBondMarket && !bondOutsideWall) {
        return {
          price:
            bidOrAsk === "ask"
              ? upperBondMarket
                ? Number(upperBondMarket?.price.inBaseToken.toString())
                : 0
              : lowerBondMarket
              ? 1 / Number(lowerBondMarket?.price.inBaseToken.toString())
              : 0,
          contract: "bond" as RangeContracts,
          discount:
            bidOrAsk === "ask"
              ? Number(upperBondMarket?.discount.toString())
              : Number(lowerBondMarket?.discount.toString()),
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
  const { data: currentOhmPrice } = useOhmPrice();
  const { data: reserveSymbol } = OperatorReserveSymbol();
  const { data: rangeData } = RangeData();
  const { data: bidOrAskPrice } = DetermineRangePrice(bidOrAsk);
  const {
    data = { discount: 0, quoteToken: "" },
    isFetched,
    isLoading,
  } = useQuery(
    ["getDetermineRangeDiscount", currentOhmPrice, bidOrAskPrice, reserveSymbol, bidOrAsk],
    () => {
      queryAssertion(currentOhmPrice);
      const bondDiscount = bidOrAskPrice.discount ? bidOrAskPrice.discount : undefined;
      const sellActive = bidOrAsk === "bid";
      const swapWithOperator = sellActive
        ? bidOrAskPrice.price < parseBigNumber(rangeData.wall.low.price, 18)
        : bidOrAskPrice.price > parseBigNumber(rangeData.wall.high.price, 18);

      const swapPrice = swapWithOperator
        ? sellActive
          ? parseBigNumber(rangeData.wall.low.price, 18)
          : parseBigNumber(rangeData.wall.high.price, 18)
        : sellActive
        ? bidOrAskPrice.price
        : bidOrAskPrice.price;
      const discount =
        bondDiscount && !swapWithOperator
          ? bondDiscount
          : (currentOhmPrice - swapPrice) / (sellActive ? -currentOhmPrice : currentOhmPrice);

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
      const decimals = tokenAddress === OHM_ADDRESSES[networks.MAINNET as keyof typeof OHM_ADDRESSES] ? 9 : 18;
      const receiveDecimals = tokenAddress === OHM_ADDRESSES[networks.MAINNET as keyof typeof OHM_ADDRESSES] ? 18 : 9; //opposite of send
      if (!signer) throw new Error(`Please connect a wallet to Range Swap`);

      if (!isValidAddress(recipientAddress) || recipientAddress === "") throw new Error(`Invalid address`);

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
        if (tx.transactionHash) {
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
            address: tx.from.slice(2), // the signer, not necessarily the receipient
            txHash: tx.transactionHash.slice(2),
          });
        }

        toast(`Range Swap Successful`);
      },
    },
  );
};
