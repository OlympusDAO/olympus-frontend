import axios from "axios";
import { BigNumber } from "ethers";
import { gql, request } from "graphql-request";
import { useInfiniteQuery, useQuery } from "react-query";
const snapshotUrl = "https://hub.snapshot.org/graphql";
const mediumUrl = "https://api.rss2json.com/v1/api.json?rss_url=https://olympusdao.medium.com/feed";
import { FUSE_POOL_18_ADDRESSES } from "src/constants/addresses";
import { shorten } from "src/helpers";
import { Token } from "src/helpers/contracts/Token";
import { interpretTransaction, Transaction } from "src/helpers/covalent/interpretTransaction";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { assert } from "src/helpers/types/assert";
import { useWeb3Context } from "src/hooks";
import { useStaticFuseContract } from "src/hooks/useContract";
import { covalent } from "src/lib/covalent";
import { CovalentResponse, CovalentTransaction, CovalentTransfer } from "src/lib/covalent.types";
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

interface UseTransactionHistoryOptions {
  address?: string;
  networkId?: NetworkId;
}

export const transactionHistoryQueryKey = (options: UseTransactionHistoryOptions) =>
  ["useTransactionHistory", options] as const;

export const useTransactionHistory = () => {
  const { address, networkId } = useWeb3Context();

  return useInfiniteQuery<CovalentResponse<CovalentTransaction[]>, Error, Transaction[]>(
    transactionHistoryQueryKey({ address, networkId }),
    ({ pageParam = 0 }) => {
      return covalent.transactions.listAll({
        address,
        networkId,
        pageSize: 300,
        pageNumber: pageParam,
      });
    },
    {
      enabled: !!address && !!networkId,
      select: ({ pages, pageParams }) => ({
        pageParams,
        pages: pages.map(page => interpretTransaction(page.items, address)),
      }),
      getNextPageParam: lastPage => {
        if (!lastPage.pagination.has_more) return;
        return lastPage.pagination.page_number + 1;
      },
    },
  );
};

interface UseTransferHistoryOptions {
  address?: string;
  networkId?: NetworkId;
  contractAddress?: string;
}

export const transferHistoryQueryKey = (options: UseTransferHistoryOptions) => ["useTransferHistory", options] as const;

export const useTransferHistory = <TToken extends Token>(token: TToken) => {
  const { address, networkId } = useWeb3Context();
  const contractAddress = token.getAddress(networkId);

  return useInfiniteQuery<CovalentResponse<CovalentTransfer[]>, Error, Transaction[]>(
    transferHistoryQueryKey({ address, networkId, contractAddress }),
    async ({ pageParam = 0 }) => {
      return covalent.transfers.listAll({
        address,
        networkId,
        pageSize: 300,
        contractAddress,
        pageNumber: pageParam,
      });
    },
    {
      enabled: !!address && !!networkId && !!contractAddress,
      select: ({ pages, pageParams }) => ({
        pageParams,
        pages: pages.map(page =>
          page.items.map(transaction => {
            const [transfer] = transaction.transfers || [];
            assert(transfer, "There should always be atleast 1 transfer");

            const _transaction: Transaction = {
              token,
              transaction,
              type: "transfer",
              details:
                transfer.transfer_type === "OUT"
                  ? `Transfer to ${shorten(transfer.to_address)}`
                  : `Deposit from ${shorten(transfer.to_address)}`,
              value: new DecimalBigNumber(BigNumber.from(transfer.delta), token.decimals),
            };

            return _transaction;
          }),
        ),
      }),
      getNextPageParam: lastPage => {
        if (!lastPage.pagination.has_more) return;
        return lastPage.pagination.page_number + 1;
      },
    },
  );
};
