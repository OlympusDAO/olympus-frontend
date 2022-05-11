import { gql, request } from "graphql-request";
import { useQuery } from "react-query";
// import { RANGE_OPERATOR_CONTRACT } from "src/constants/contracts";
// import { Providers } from "src/helpers/providers/Providers/Providers";
// import { NetworkId } from "src/networkDetails";
// import { IERC20__factory } from "src/typechain";
//import { RANGE_CONTRACT, RANGE_PRICE_CONTRACT } from "src/constants/contracts";
// import { NetworkId } from "src/networkDetails";

export const OHMPriceHistory = (address: string) => {
  const graphURL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";
  const {
    data = [],
    isFetched,
    isLoading,
  } = useQuery(["OHMPriceHistory", address], async () => {
    const data = await request(
      graphURL,
      gql`
        {
          tokenDayDatas(
            where: { token: "${address}" }
            orderBy: date
            orderDirection: desc
            first: 7
          ) {
            priceUSD
            date
          }
        }
      `,
    );
    return data.tokenDayDatas;
  });

  return { data, isFetched, isLoading };
};

/**
 *
 * @param address
 * @returns Returns the capacity of the Operator at the given address
 */
export const Capacity = (address: string) => {
  //const contract = RANGE_CONTRACT.getEthersContract(NetworkId.MAINNET);
  const { data, isFetched, isLoading } = useQuery(["Capacity", address], async () => {
    //const capacty = await contract.lastMarketCapacity(false);
    //TODO: REMOVE STUB RESPONSE
    return 10000;
  });
  return { data, isFetched, isLoading };
};

/**
 * @param address
 * @returns Returns the upper and lower range of the Operator at the given address
 */
export const RangeBoundaries = (address: string) => {
  // const contract = RANGE_CONTRACT.getEthersContract(NetworkId.MAINNET);
  const {
    data = { high: 0, low: 0, cushion: 0, wall: 0 },
    isFetched,
    isLoading,
  } = useQuery(["Capacity", address], async () => {
    //TODO: REMOVE STUB RESPONSE
    return { low: 2000, high: 2500, cushion: 1000, wall: 10000 };
  });
  return { data, isFetched, isLoading };
};

/**
 * @param address
 * @returns Returns the current price of the Operator at the given address
 */
export const OperatorPrice = (address: string) => {
  //const contract = RANGE_PRICE_CONTRACT.getEthersContract(NetworkId.MAINNET);
  const {
    data = 0,
    isFetched,
    isLoading,
  } = useQuery(["OperatorPrice", address], async () => {
    //contract.getCurrentPrice();
    //TODO: REMOVE STUB RESPONSE
    return "$15.50";
  });
  return { data, isFetched, isLoading };
};

/**
 * @param address
 * @returns Returns the reserve contract address on the Operator
 */
export const OperatorReserveToken = (address: string) => {
  //const contract = RANGE_OPERATOR_CONTRACT.getEthersContract(NetworkId.MAINNET);
  const {
    data = "",
    isFetched,
    isLoading,
  } = useQuery(["OperatorReserve", address], async () => {
    // const provider = Providers.getStaticProvider(NetworkId.MAINNET);
    // const TokenContract = IERC20__factory.connect(await contract.reserve(), provider);
    // const symbol = await TokenContract.symbol();
    // return symbol;
    //TODO: REMOVE STUB RESPONSE
    return "DAI";
  });
  return { data, isFetched, isLoading };
};
