import { AddressZero } from "@ethersproject/constants";
import axios, { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { useWeb3Context } from "src/hooks";

import { Environment } from "../helpers/environment/Environment/Environment";

export const tokenHoldersKey = (tokenAddress: string, networkId: NetworkId) => [
  "useTokenHolders",
  tokenAddress,
  networkId,
];

type CovalentTokenBalanceResponse = {
  data: CovalentTokenBalanceResponseData;
  error: boolean;
  error_code: string | null;
  error_message: string | null;
};

type CovalentTokenBalanceResponseData = {
  updated_at: string;
  items: CovalentTokenBalanceItem[];
  pagination: CovalentTokenBalanceResponsePagination;
};

type CovalentTokenBalanceResponsePagination = {
  has_more: boolean;
  page_number: number;
  page_size: number;
  total_count: number;
};

type CovalentTokenBalanceItem = {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: boolean | null;
  logo_url: string;
  address: string;
  balance: string;
  total_supply: string;
  block_height: number;
};

const getTokenHolders = async (
  tokenAddress: string,
  apiKey: string,
  pageNumber?: number,
  data: CovalentTokenBalanceItem[] = [],
): Promise<CovalentTokenBalanceItem[]> => {
  // NOTE: Covalent API is currently not returning subsequent pages
  const pageSize = 1000;
  const query = `https://api.covalenthq.com/v1/1/tokens/${tokenAddress}/token_holders/?quote-currency=USD&format=JSON&key=${apiKey}&page-size=${pageSize}${
    pageNumber ? `&page-number=${pageNumber}` : ""
  }`;
  const response: AxiosResponse<CovalentTokenBalanceResponse> = await axios.get(query);

  if (response.status != 200)
    throw new Error("Encountered error fetching holder count: " + response.data.error_message);

  // Store the items for later processing
  data.push(...response.data.data.items);

  // If there are additional pages, recurse and fetch more
  if (response.data.data.pagination.has_more)
    return getTokenHolders(tokenAddress, apiKey, response.data.data.pagination.page_number + 1, data);

  return data;
};

const sumTokenHolders = (items: CovalentTokenBalanceItem[]): number => {
  let totalCount = 0;

  items.forEach(item => {
    // Skip zero address
    if (item.address === AddressZero) return;

    totalCount++;
  });

  return totalCount;
};

/**
 * Asynchronously fetches the holders of the specified token and
 * returns the number of token holders.
 *
 * @param tokenAddress the token contract address
 * @returns number representing the number of token holders
 */
export const useTokenHolders = (tokenAddress: string) => {
  const { networkId } = useWeb3Context();
  const key = tokenHoldersKey(tokenAddress, networkId);
  const apiKey = Environment.getCovalentApiKey();

  return useQuery<number, Error>(
    key,
    async () => {
      queryAssertion(apiKey, key);
      const items = await getTokenHolders(tokenAddress, apiKey);
      return sumTokenHolders(items);
    },
    { enabled: !!tokenAddress && !!apiKey },
  );
};
