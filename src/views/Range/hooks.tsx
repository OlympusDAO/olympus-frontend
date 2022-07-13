import { t } from "@lingui/macro";
import { BigNumber, ContractReceipt, ethers } from "ethers";
import { gql, request } from "graphql-request";
import { useMutation, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { DAO_TREASURY_ADDRESSES, OHM_ADDRESSES } from "src/constants/addresses";
import {
  BOND_AGGREGATOR_CONTRACT,
  RANGE_CONTRACT,
  RANGE_OPERATOR_CONTRACT,
  RANGE_PRICE_CONTRACT,
} from "src/constants/contracts";
import { parseBigNumber } from "src/helpers";
// import { trackGAEvent, trackGtagEvent } from "src/helpers/analytics/trackGAEvent";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { isValidAddress } from "src/helpers/misc/isValidAddress";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";
import { BondTeller__factory, IERC20__factory } from "src/typechain";
import { BandStruct, LineStruct, RangeStructOutput, SideStruct } from "src/typechain/Range";
import { useNetwork, useSigner } from "wagmi";

/**Chainlink Price Feed. Retrieves OHMETH and ETH/{RESERVE} feed **/
export const OHMPriceHistory = (assetPair = "OHMv2/ETH") => {
  const graphURL = "https://api.thegraph.com/subgraphs/name/openpredict/chainlink-prices-subgraph";
  const {
    data = [],
    isFetched,
    isLoading,
  } = useQuery(["OHMPriceHistory", assetPair], async () => {
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
  } = useQuery(["ReservePriceHistory", reserveToken], async () => {
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
    ["priceHistory", ohmPriceData, reservePriceData],
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
  const {
    data = 1,
    isFetched,
    isLoading,
  } = useQuery(["OperatorPrice", chain], async () => {
    return parseBigNumber(await contract.getCurrentPrice(), 18);
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
  } = useQuery(["OperatorReserve", chain], async () => {
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
    } as RangeStructOutput,
    isFetched,
    isLoading,
  } = useQuery(["RangeData", chain.id], async () => {
    const range = await contract.range();
    return range;
  });
  return { data, isFetched, isLoading };
};

const sideStruct: SideStruct = {
  active: false,
  lastActive: 0,
  capacity: BigNumber.from(0),
  threshold: BigNumber.from(0),
  market: BigNumber.from(-1),
};
const line: LineStruct = {
  price: BigNumber.from(0),
};

const band: BandStruct = {
  high: line,
  low: line,
  spread: BigNumber.from(0),
};

/**
 * Returns the market price for the given bond market
 * @param id Bond Market ID
 */
export const RangeBondPrice = (id: BigNumber) => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = BOND_AGGREGATOR_CONTRACT.getEthersContract(chain.id);
  const { data, isFetched, isLoading } = useQuery(
    ["RangeBondAggregator", id, chain],
    async () => {
      const bondPrice = await contract.marketPrice(id);

      return parseBigNumber(bondPrice, 18);
    },
    {
      enabled: id.gt(-1) && id.lt(ethers.constants.MaxUint256),
    }, //Disable this query for negative markets (default value) or Max Integer (market not active from range call)
  );
  return { data, isFetched, isLoading };
};

/**
 * Executes Range Swap Transaction and routes it to the appropriate contract.
 * Either Swap on the operator, or purchase on the bond teller.
 */
export const RangeSwap = () => {
  const dispatch = useDispatch();
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
      swapPricePerOhm: string;
      sellActive: boolean;
      slippage: string;
      recipientAddress: string;
    }
  >(
    async ({ market, tokenAddress, swapType, amount, swapPricePerOhm, sellActive, slippage, recipientAddress }) => {
      const decimals = tokenAddress === OHM_ADDRESSES[chain.id as keyof typeof OHM_ADDRESSES] ? 9 : 18;
      if (!signer) throw new Error(t`Please connect a wallet to Range Swap`);

      if (!isValidAddress(recipientAddress) || recipientAddress === "") throw new Error(t`Invalid address`);

      const swapAmount = new DecimalBigNumber(amount, decimals);

      //slippage
      const parsedSlippage = new DecimalBigNumber(slippage, decimals);
      const slippageAsPercent = parsedSlippage.div("100");
      const swapPricePerOhmBN = new DecimalBigNumber(swapPricePerOhm, 18);

      const maxPrice = sellActive
        ? swapAmount.mul(new DecimalBigNumber("1").sub(slippageAsPercent))
        : swapPricePerOhmBN.mul(slippageAsPercent.add("1"));
      if (swapType === "swap") {
        const contract = RANGE_OPERATOR_CONTRACT.getEthersContract(networks.MAINNET).connect(signer);
        const transaction = await contract.swap(tokenAddress, swapAmount.toBigNumber(), maxPrice.toBigNumber());
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
        amount,
        maxPrice.toBigNumber(),
      );
      return transaction.wait();
    },
    {
      onError: error => {
        dispatch(createErrorToast(error.message));
      },
      onSuccess: async (tx, { market }) => {
        // trackGAEvent({
        //   category: "Range",
        //   action: "Swap",
        //   label: market.toString() ?? "unknown",
        //   dimension1: tx.transactionHash,
        //   dimension2: address,
        // });

        // trackGtagEvent("Range", {
        //   event_category: "Swap",
        //   event_label: market.toString() ?? "unknown",
        //   address: address.slice(2),
        //   txHash: tx.transactionHash.slice(2),
        // });

        dispatch(createInfoToast(t`Range Swap Successful`));
      },
    },
  );
};
