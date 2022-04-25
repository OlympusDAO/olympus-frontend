import { renderHook } from "@testing-library/react-hooks";
import axios from "axios";
import { when } from "jest-when";
import { QueryClient, QueryClientProvider } from "react-query";
import { NetworkId } from "src/constants";
import {
  GOHM_ADDRESSES,
  OHM_ADDRESSES,
  SOHM_ADDRESSES,
  V1_OHM_ADDRESSES,
  V1_SOHM_ADDRESSES,
} from "src/constants/addresses";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useAllTokenHolders, useTokenHolders } from "src/hooks/useTokenHolders";
import * as useWeb3Context from "src/hooks/web3Context";
import { mockWeb3Context } from "src/testHelpers";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  //@ts-expect-error for children with type any
  return ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

const tokenAddress = "0xC0b491daBf3709Ee5Eb79E603D73289Ca6060932";
const COVALENT_API_KEY = "abc";

// API documentation: https://www.covalenthq.com/docs/api/#/0/Get%20token%20holders%20as%20of%20any%20block%20height/USD/1

const queryUrl = (address: string, apiKey: string) =>
  `https://api.covalenthq.com/v1/1/tokens/${address}/token_holders/?quote-currency=USD&format=JSON&key=${apiKey}&page-size=99999`;

type CovalentItem = {
  contract_decimals: number;
  address: string;
  balance: string;
};

const covalentItem = (tokenAddress: string, balance = "100000000000000000"): CovalentItem => {
  return {
    contract_decimals: 18,
    address: tokenAddress,
    balance: balance,
  };
};

const covalentResponse = (
  items: CovalentItem[],
  page_number = 0,
  has_more = false,
  page_size = 100,
  total_count = 1,
  status = 200,
) => {
  return {
    data: {
      data: {
        items: items,
        pagination: {
          has_more: has_more,
          page_number: page_number,
          page_size: page_size,
          total_count: total_count,
        },
      },
    },
    status: status,
  };
};

describe("useTokenHolders", () => {
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);

    Environment.getCovalentApiKey = jest.fn().mockReturnValue(COVALENT_API_KEY);
  });

  it("should handle a single page", async () => {
    // Set up mock
    axios.get = jest.fn().mockResolvedValueOnce(covalentResponse([covalentItem("0x1")]));

    const { result, waitFor } = renderHook(() => useTokenHolders(tokenAddress), { wrapper: createWrapper() });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(1);
  });

  it("should ignore null address", async () => {
    // Set up mock
    axios.get = jest
      .fn()
      .mockResolvedValueOnce(
        covalentResponse([covalentItem("0x0000000000000000000000000000000000000000"), covalentItem("0x1")]),
      );

    const { result, waitFor } = renderHook(() => useTokenHolders(tokenAddress), { wrapper: createWrapper() });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(1);
  });

  it("should handle paging", async () => {
    // Set up mock
    axios.get = jest
      .fn()
      .mockResolvedValueOnce(
        covalentResponse(
          [covalentItem("0x0000000000000000000000000000000000000000"), covalentItem("0x1")],
          0,
          true,
          2,
          2,
        ),
      )
      .mockResolvedValueOnce(covalentResponse([covalentItem("0x2"), covalentItem("0x3")], 1, false, 2, 2));

    const { result, waitFor } = renderHook(() => useTokenHolders(tokenAddress), { wrapper: createWrapper() });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(3);
  });

  it("should fetch all tokens", async () => {
    // Set up mock
    axios.get = jest.fn();
    // We expect useTokenHolders to check the number of holders of OHM, sOHM and gOHM, OHM v1 and OHM v2
    when(axios.get)
      .calledWith(queryUrl(V1_OHM_ADDRESSES[NetworkId.MAINNET], COVALENT_API_KEY))
      .mockResolvedValue(covalentResponse([covalentItem("0x1")]));
    when(axios.get)
      .calledWith(queryUrl(V1_SOHM_ADDRESSES[NetworkId.MAINNET], COVALENT_API_KEY))
      .mockResolvedValue(covalentResponse([covalentItem("0x2")]));
    when(axios.get)
      .calledWith(queryUrl(OHM_ADDRESSES[NetworkId.MAINNET], COVALENT_API_KEY))
      .mockResolvedValue(covalentResponse([covalentItem("0x3")]));
    when(axios.get)
      .calledWith(queryUrl(SOHM_ADDRESSES[NetworkId.MAINNET], COVALENT_API_KEY))
      .mockResolvedValue(covalentResponse([covalentItem("0x4")]));
    when(axios.get)
      .calledWith(queryUrl(GOHM_ADDRESSES[NetworkId.MAINNET], COVALENT_API_KEY))
      .mockResolvedValue(covalentResponse([covalentItem("0x5")]));

    const { result, waitFor } = renderHook(() => useAllTokenHolders(), { wrapper: createWrapper() });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(5); // 1 each
  });

  it("should count wallets once when fetching all tokens", async () => {
    // Set up mock
    axios.get = jest.fn();
    // We expect useTokenHolders to check the number of holders of OHM, sOHM and gOHM, OHM v1 and OHM v2
    when(axios.get)
      .calledWith(queryUrl(V1_OHM_ADDRESSES[NetworkId.MAINNET], COVALENT_API_KEY))
      .mockResolvedValue(covalentResponse([covalentItem("0x1")]));
    when(axios.get)
      .calledWith(queryUrl(V1_SOHM_ADDRESSES[NetworkId.MAINNET], COVALENT_API_KEY))
      .mockResolvedValue(covalentResponse([covalentItem("0x2")]));
    when(axios.get)
      .calledWith(queryUrl(OHM_ADDRESSES[NetworkId.MAINNET], COVALENT_API_KEY))
      .mockResolvedValue(covalentResponse([covalentItem("0x3")]));
    when(axios.get)
      .calledWith(queryUrl(SOHM_ADDRESSES[NetworkId.MAINNET], COVALENT_API_KEY))
      .mockResolvedValue(covalentResponse([covalentItem("0x4")]));
    when(axios.get)
      .calledWith(queryUrl(GOHM_ADDRESSES[NetworkId.MAINNET], COVALENT_API_KEY))
      .mockResolvedValue(covalentResponse([covalentItem("0x4")])); // Counted as duplicate

    const { result, waitFor } = renderHook(() => useAllTokenHolders(), { wrapper: createWrapper() });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(4);
  });
});
