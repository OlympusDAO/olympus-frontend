import { gql, request } from "graphql-request";
import { useQuery } from "react-query";

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
