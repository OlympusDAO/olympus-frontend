import { renderHook } from "@testing-library/react-hooks";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "react-query";
import { useTokenHolders } from "src/hooks/useTokenHolders";
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

// API documentation: https://www.covalenthq.com/docs/api/#/0/Get%20token%20holders%20as%20of%20any%20block%20height/USD/1

describe("useTokenHolders", () => {
  beforeEach(() => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);
  });

  it("should handle a single page", async () => {
    // Set up mock
    axios.get = jest.fn().mockResolvedValueOnce({
      data: {
        data: {
          items: [
            {
              contract_decimals: 18,
              address: "0x1",
              balance: "10001421266245461544545",
            },
          ],
          pagination: {
            has_more: false,
            page_number: 0,
            page_size: 100,
            total_count: 1,
          },
        },
      },
      status: 200,
    });

    const { result, waitFor } = renderHook(() => useTokenHolders(tokenAddress), { wrapper: createWrapper() });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(1);
  });

  it("should ignore null address", async () => {
    // Set up mock
    axios.get = jest.fn().mockResolvedValueOnce({
      data: {
        data: {
          items: [
            {
              contract_decimals: 18,
              address: "0x0000000000000000000000000000000000000000",
              balance: "136303095987931691536658",
            },
            {
              contract_decimals: 18,
              address: "0x1",
              balance: "10001421266245461544545",
            },
          ],
          pagination: {
            has_more: false,
            page_number: 0,
            page_size: 100,
            total_count: 1,
          },
        },
      },
      status: 200,
    });

    const { result, waitFor } = renderHook(() => useTokenHolders(tokenAddress), { wrapper: createWrapper() });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(1);
  });

  it("should handle paging", async () => {
    // Set up mock
    axios.get = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          data: {
            items: [
              {
                contract_decimals: 18,
                address: "0x0000000000000000000000000000000000000000",
                balance: "136303095987931691536658",
              },
              {
                contract_decimals: 18,
                address: "0x1",
                balance: "10001421266245461544545",
              },
            ],
            pagination: {
              has_more: true,
              page_number: 0,
              page_size: 2,
              total_count: 2,
            },
          },
        },
        status: 200,
      })
      .mockResolvedValueOnce({
        data: {
          data: {
            items: [
              {
                contract_decimals: 18,
                address: "0x2",
                balance: "136303095987931691536658",
              },
              {
                contract_decimals: 18,
                address: "0x3",
                balance: "10001421266245461544545",
              },
            ],
            pagination: {
              has_more: false,
              page_number: 1,
              page_size: 2,
              total_count: 2,
            },
          },
        },
        status: 200,
      });

    const { result, waitFor } = renderHook(() => useTokenHolders(tokenAddress), { wrapper: createWrapper() });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(3);
  });
});
