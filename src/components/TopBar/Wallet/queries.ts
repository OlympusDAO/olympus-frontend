import axios from "axios";
import { gql, request } from "graphql-request";
import { useInfiniteQuery, useQuery } from "react-query";
const snapshotUrl = "https://hub.snapshot.org/graphql";
const mediumUrl = "https://api.rss2json.com/v1/api.json?rss_url=https://olympusdao.medium.com/feed";
import { FUSE_POOL_18_ADDRESSES } from "src/constants/addresses";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useWeb3Context } from "src/hooks";
import { useStaticFuseContract } from "src/hooks/useContract";
import { covalent } from "src/lib/covalent";
import { CovalentResponse } from "src/lib/covalent.types";
import { NetworkId } from "src/networkDetails";
export const ActiveProposals = () => {
  const { data, isFetched, isLoading } = useQuery("ActiveProposals", async () => {
    const data = await request(
      snapshotUrl,
      gql`
        query Proposals {
          proposals(
            first: 20
            skip: 0
            where: { space_in: ["olympusdao.eth"] }
            orderBy: "created"
            orderDirection: desc
          ) {
            id
            title
            body
            choices
            start
            end
            snapshot
            state
            author
            link
            scores
          }
        }
      `,
    );
    return data;
  });
  return { data, isFetched, isLoading };
};

export const MediumArticles = () => {
  const { data, isFetched, isLoading } = useQuery("MediumArticles", async () => {
    return await axios.get(mediumUrl).then(res => {
      return res.data;
    });
  });
  return { data, isFetched, isLoading };
};

export const SupplyRatePerBlock = () => {
  const fuse = useStaticFuseContract(FUSE_POOL_18_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);
  const { data, isFetched, isLoading } = useQuery("FuseSupply", async () => {
    return await fuse.supplyRatePerBlock();
  });
  return { data, isFetched, isLoading };
};

export const GetTokenPrice = (tokenId = "olympus") => {
  const { data, isFetched, isLoading } = useQuery(["TokenPrice", tokenId], async () => {
    const cgResp = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true`,
    );
    return cgResp.data[tokenId];
  });
  return { data, isFetched, isLoading };
};

export const GetTransactionHistory = () => {
  const { address, networkId } = useWeb3Context();
  const COVALENT_KEY = Environment.getCovalentApiKey();
  const { data, isFetched, isLoading, isPreviousData, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<CovalentResponse, Error>(
      ["TransactionHistory", networkId],
      async ({ pageParam = 0 }) => {
        if (!covalent.isSupportedNetwork(networkId)) return { error: true };
        const resp = await axios.get(
          `https://api.covalenthq.com/v1/${networkId}/address/${address}/transactions_v2/?page-number=${pageParam}&page-size=300&key=${COVALENT_KEY}`,
        );
        return { ...resp.data, type: "transaction" };
      },
      {
        enabled: !!address && !!networkId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        getNextPageParam: lastPage => {
          if (!lastPage.error) {
            return lastPage.data.pagination?.has_more ? lastPage.data.pagination?.page_number + 1 : false;
          }
          return false;
        },
      },
    );
  return {
    data,
    isFetched,
    isLoading,
    isPreviousData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export const GetTransferHistory = (contractAddress: string) => {
  const { address, networkId } = useWeb3Context();
  const COVALENT_KEY = Environment.getCovalentApiKey();
  const { data, isFetched, isLoading, isPreviousData, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<CovalentResponse>(
      ["TransferHistory", networkId, contractAddress],
      async ({ pageParam = 0 }) => {
        if (!covalent.isSupportedNetwork(networkId) || !contractAddress) return { error: true };
        const resp = await axios.get(
          `https://api.covalenthq.com/v1/${networkId}/address/${address}/transfers_v2/?page-number=${pageParam}&quote-currency=USD&format=JSON&contract-address=${contractAddress}&key=${COVALENT_KEY}`,
        );
        return { ...resp.data, type: "transfer" };
      },
      {
        enabled: !!address && !!networkId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        getNextPageParam: lastPage => {
          if (!lastPage.error) {
            return lastPage.data.pagination?.has_more ? lastPage.data.pagination?.page_number + 1 : false;
          }
          return false;
        },
      },
    );
  return { data, isFetched, isLoading, isPreviousData, fetchNextPage, hasNextPage, isFetchingNextPage };
};
