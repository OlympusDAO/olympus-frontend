import { BigNumber } from "ethers";
import { gql, request } from "graphql-request";
import { useQuery } from "react-query";
// import { RANGE_OPERATOR_CONTRACT } from "src/constants/contracts";
// import { Providers } from "src/helpers/providers/Providers/Providers";
// import { NetworkId } from "src/networkDetails";
// import { IERC20__factory } from "src/typechain";
//RANGE_CONTRACT
import { RANGE_CONTRACT, RANGE_PRICE_CONTRACT } from "src/constants/contracts";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { IERC20__factory } from "src/typechain";
import { useNetwork } from "wagmi";
// import { NetworkId } from "src/networkDetails";

const RangeMock = {
  low: {
    active: true,
    lastActive: "temp",
    capacity: 100000,
    threshold: 100000,
    market: 1,
    lastMarketCapacity: 100000,
  },
  high: {
    active: false,
    lastActive: "temp",
    capacity: 100000,
    threshold: 100000,
    market: 1,
    lastMarketCapacity: 100000,
  },
  cushion: {
    low: { price: 15 },
    high: { price: 20 },
    spread: 5,
  },
  wall: {
    low: { price: 10 },
    high: { price: 25 },
    spread: 5,
  },
};

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
    { enabled: !!ohmPriceData && !!ohmPriceData },
  );
  return { data, isFetched, isLoading };
};

//TODO: PROBABLY REMOVE THIS
/**
 * @param address
 * @returns Returns the current price of the Operator at the given address
 */
export const OperatorPrice = (address: string) => {
  const { activeChain = { id: 1 } } = useNetwork();

  const contract = RANGE_PRICE_CONTRACT.getEthersContract(activeChain.id);
  const {
    data = 0,
    isFetched,
    isLoading,
  } = useQuery(["OperatorPrice", address], async () => {
    return await contract.getCurrentPrice();
  });
  return { data, isFetched, isLoading };
};

/**
 * @param address
 * @returns Returns the reserve contract address on the Operator
 */
export const OperatorReserveSymbol = (address: string) => {
  const { activeChain = { id: 1 } } = useNetwork();
  const contract = RANGE_CONTRACT.getEthersContract(activeChain.id);
  const {
    data = "",
    isFetched,
    isLoading,
  } = useQuery(["OperatorReserve", address], async () => {
    const provider = Providers.getStaticProvider(activeChain.id);
    const TokenContract = IERC20__factory.connect(await contract.reserve(), provider);
    const symbol = await TokenContract.symbol();
    return symbol;
  });
  return { data, isFetched, isLoading };
};

export const RangeData = (address: string) => {
  const { activeChain = { id: 1 } } = useNetwork();
  const contract = RANGE_CONTRACT.getEthersContract(activeChain.id);

  const {
    data = {
      high: { active: false as boolean, market: BigNumber.from(0) },
      low: { active: false as boolean, market: BigNumber.from(0) },
      wall: { low: { price: BigNumber.from(0) }, high: { price: BigNumber.from(0) } },
      cushion: { low: { price: BigNumber.from(0) }, high: { price: BigNumber.from(0) } },
    },
    isFetched,
    isLoading,
  } = useQuery(["RangeData", address], async () => {
    const range = await contract.range();
    return range;
  });
  return { data, isFetched, isLoading };
};
