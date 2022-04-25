import { AddressZero } from "@ethersproject/constants";
import axios, { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import {
  GOHM_ADDRESSES,
  OHM_ADDRESSES,
  SOHM_ADDRESSES,
  V1_OHM_ADDRESSES,
  V1_SOHM_ADDRESSES,
} from "src/constants/addresses";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { useWeb3Context } from "src/hooks";

import { Environment } from "../helpers/environment/Environment/Environment";

export const tokenHoldersKey = (tokenAddress: string, networkId: NetworkId) => [
  "useTokenHolders",
  tokenAddress,
  networkId,
];

export const allTokenHoldersKey = (networkId: NetworkId) => ["useAllTokenHolders", networkId];

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

const fetchTokenHolders = async (
  tokenAddress: string,
  apiKey: string,
  pageNumber?: number,
  data: CovalentTokenBalanceItem[] = [],
): Promise<CovalentTokenBalanceItem[]> => {
  // NOTE: Covalent API is currently not returning subsequent pages, so we use the maximum page size
  const pageSize = 99999;
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
    return fetchTokenHolders(tokenAddress, apiKey, response.data.data.pagination.page_number + 1, data);

  return data;
};

const sumTokenHolders = (items: CovalentTokenBalanceItem[], existingWalletAddresses?: Set<string>): number => {
  let totalCount = 0;

  items.forEach(item => {
    // Skip zero address
    if (item.address === AddressZero) return;

    if (existingWalletAddresses) existingWalletAddresses.add(item.address);

    totalCount++;
  });

  return totalCount;
};

/**
 * For a given `tokenAddress`, determines the number of token holders.
 *
 * If `existingWalletAddresses` is supplied, the set will be updated with
 * the unique wallet addresses.
 *
 * @param tokenAddress token to look for
 * @param apiKey Covalent API key
 * @param existingWalletAddresses optional set that will be updated with wallet addresses
 * @returns the number of unique token holders
 */
const getTokenHolderCount = async (
  tokenAddress: string,
  apiKey: string,
  existingWalletAddresses?: Set<string>,
): Promise<number> => {
  const items = await fetchTokenHolders(tokenAddress, apiKey);
  return sumTokenHolders(items, existingWalletAddresses);
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
      return getTokenHolderCount(tokenAddress, apiKey);
    },
    { enabled: !!tokenAddress && !!apiKey },
  );
};

/**
 * Asynchronously fetches the holders of all *OHM tokens and
 * returns the number of unique token holders.
 *
 * @returns number representing the number of unique token holders
 */
export const useAllTokenHolders = () => {
  const { networkId } = useWeb3Context();

  const apiKey = Environment.getCovalentApiKey();
  const key = allTokenHoldersKey(networkId);

  return useQuery<number, Error>(key, async () => {
    queryAssertion(apiKey, key);

    const walletAddresses = new Set<string>();

    /**
     * Note: the cleanest way to approach this seems to be to sequentially fetch the number of holders for each token
     * within the same useQuery call.
     *
     * Caveats:
     * - this won't cache each of the individual token calls, but the entire call (for the networkId) as a result.
     * - it takes a few seconds (~3) to load all of the data.
     *
     * The other way of approaching this (which could be considered in the future) is to have multiple useQuery calls
     * that update the interface as the data is received.
     */
    await getTokenHolderCount(V1_OHM_ADDRESSES[networkId as keyof typeof V1_OHM_ADDRESSES], apiKey, walletAddresses);
    await getTokenHolderCount(V1_SOHM_ADDRESSES[networkId as keyof typeof V1_SOHM_ADDRESSES], apiKey, walletAddresses);
    await getTokenHolderCount(GOHM_ADDRESSES[networkId as keyof typeof GOHM_ADDRESSES], apiKey, walletAddresses);
    await getTokenHolderCount(OHM_ADDRESSES[networkId as keyof typeof OHM_ADDRESSES], apiKey, walletAddresses);
    await getTokenHolderCount(SOHM_ADDRESSES[networkId as keyof typeof SOHM_ADDRESSES], apiKey, walletAddresses);

    return walletAddresses.size;
  });
};
