import { fireEvent } from "@testing-library/dom";
import { act } from "react-dom/test-utils";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import * as useBalance from "src/hooks/useBalance";
import * as usePrices from "src/hooks/usePrices";
import * as useZapTokenBalances from "src/hooks/useZapTokenBalances";
import * as useWeb3Context from "src/hooks/web3Context";
import { NetworkId } from "src/networkDetails";
import { mockWeb3Context } from "src/testHelpers";

import { render, screen } from "../../../testUtils";
import ZapStakeAction from "../ZapStakeAction";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("<ZapStakeAction/> ", () => {
  it("Submit Button Should be disabled with < 2 tokens selected enabled with two selected", async () => {
    const data = jest.spyOn(useWeb3Context, "useWeb3Context");
    data.mockReturnValue(mockWeb3Context);

    // Mock the Zapper API returning the token balances in the given wallet
    const balanceData = jest.spyOn(useZapTokenBalances, "useZapTokenBalances");
    balanceData.mockReturnValue({
      data: {
        balances: {
          dai: {
            address: "0x6b175474e89094c44da98b954eedeac495271d0f",
            decimals: 18,
            hide: false,
            tokenImageUrl:
              "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x6b175474e89094c44da98b954eedeac495271d0f.png",
            symbol: "DAI",
            price: 0.998646,
            network: "ethereum",
            balance: 10000,
            balanceRaw: "10000",
            balanceUSD: 10000.0,
          },
          eth: {
            address: "0x0000000000000000000000000000000000000000",
            decimals: 18,
            hide: false,
            tokenImageUrl:
              "https://storage.googleapis.com/zapper-fi-assets/tokens/ethereum/0x0000000000000000000000000000000000000000.png",
            symbol: "ETH",
            network: "ethereum",
            price: 3397.72,
            balance: 1,
            balanceRaw: "1",
            balanceUSD: 3397.72,
          },
        },
      },
      error: null,
      isError: false,
      isSuccess: true,
      isLoading: false,
      isLoadingError: false,
      isIdle: false,
      isRefetchError: false,
      failureCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetching: false,
      isStale: false,
      status: "success",
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      refetch: () => {
        return new Promise(() => {
          return true;
        });
      },
      remove: () => {
        return new Promise(() => {
          return true;
        });
      },
    });

    // Mock the OHM market price
    const ohmMarketData = jest.spyOn(usePrices, "useOhmPrice");
    ohmMarketData.mockReturnValue({
      data: 30,
      error: null,
      isError: false,
      isSuccess: true,
      isLoading: false,
      isLoadingError: false,
      isIdle: false,
      isRefetchError: false,
      failureCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetching: false,
      isStale: false,
      status: "success",
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      refetch: () => {
        return new Promise(() => {
          return true;
        });
      },
      remove: () => {
        return new Promise(() => {
          return true;
        });
      },
    });

    // Mock the gOHM market price
    const gOhmMarketData = jest.spyOn(usePrices, "useGohmPrice");
    gOhmMarketData.mockReturnValue({
      data: 3000,
      error: null,
      isError: false,
      isSuccess: true,
      isLoading: false,
      isLoadingError: false,
      isIdle: false,
      isRefetchError: false,
      failureCount: 0,
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isPlaceholderData: false,
      isPreviousData: false,
      isRefetching: false,
      isStale: false,
      status: "success",
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      refetch: () => {
        return new Promise(() => {
          return true;
        });
      },
      remove: () => {
        return new Promise(() => {
          return true;
        });
      },
    });

    // Mock the sOHM balance
    const sOhmBalance = jest.spyOn(useBalance, "useSohmBalance");
    sOhmBalance.mockReturnValue({
      [NetworkId.MAINNET]: {
        data: new DecimalBigNumber("0"),
        error: null,
        isError: false,
        isSuccess: true,
        isLoading: false,
        isLoadingError: false,
        isIdle: false,
        isRefetchError: false,
        failureCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isFetching: false,
        isPlaceholderData: false,
        isPreviousData: false,
        isRefetching: false,
        isStale: false,
        status: "success",
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        refetch: () => {
          return new Promise(() => {
            return true;
          });
        },
        remove: () => {
          return new Promise(() => {
            return true;
          });
        },
      },
      [NetworkId.TESTNET_RINKEBY]: {
        data: new DecimalBigNumber("0"),
        error: null,
        isError: false,
        isSuccess: true,
        isLoading: false,
        isLoadingError: false,
        isIdle: false,
        isRefetchError: false,
        failureCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isFetching: false,
        isPlaceholderData: false,
        isPreviousData: false,
        isRefetching: false,
        isStale: false,
        status: "success",
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        refetch: () => {
          return new Promise(() => {
            return true;
          });
        },
        remove: () => {
          return new Promise(() => {
            return true;
          });
        },
      },
    });

    // Mock the gOHM balance
    const gOhmBalance = jest.spyOn(useBalance, "useGohmBalance");
    /**
     * TODO due to the way that `useGohmBalance` is setup, we need to supply
     * values for all of the chains. There has to be a better way...
     */
    gOhmBalance.mockReturnValue({
      [NetworkId.MAINNET]: {
        data: new DecimalBigNumber("0"),
        error: null,
        isError: false,
        isSuccess: true,
        isLoading: false,
        isLoadingError: false,
        isIdle: false,
        isRefetchError: false,
        failureCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isFetching: false,
        isPlaceholderData: false,
        isPreviousData: false,
        isRefetching: false,
        isStale: false,
        status: "success",
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        refetch: () => {
          return new Promise(() => {
            return true;
          });
        },
        remove: () => {
          return new Promise(() => {
            return true;
          });
        },
      },
      [NetworkId.TESTNET_RINKEBY]: {
        data: new DecimalBigNumber("0"),
        error: null,
        isError: false,
        isSuccess: true,
        isLoading: false,
        isLoadingError: false,
        isIdle: false,
        isRefetchError: false,
        failureCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isFetching: false,
        isPlaceholderData: false,
        isPreviousData: false,
        isRefetching: false,
        isStale: false,
        status: "success",
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        refetch: () => {
          return new Promise(() => {
            return true;
          });
        },
        remove: () => {
          return new Promise(() => {
            return true;
          });
        },
      },
      [NetworkId.ARBITRUM]: {
        data: new DecimalBigNumber("0"),
        error: null,
        isError: false,
        isSuccess: true,
        isLoading: false,
        isLoadingError: false,
        isIdle: false,
        isRefetchError: false,
        failureCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isFetching: false,
        isPlaceholderData: false,
        isPreviousData: false,
        isRefetching: false,
        isStale: false,
        status: "success",
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        refetch: () => {
          return new Promise(() => {
            return true;
          });
        },
        remove: () => {
          return new Promise(() => {
            return true;
          });
        },
      },
      [NetworkId.ARBITRUM_TESTNET]: {
        data: new DecimalBigNumber("0"),
        error: null,
        isError: false,
        isSuccess: true,
        isLoading: false,
        isLoadingError: false,
        isIdle: false,
        isRefetchError: false,
        failureCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isFetching: false,
        isPlaceholderData: false,
        isPreviousData: false,
        isRefetching: false,
        isStale: false,
        status: "success",
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        refetch: () => {
          return new Promise(() => {
            return true;
          });
        },
        remove: () => {
          return new Promise(() => {
            return true;
          });
        },
      },
      [NetworkId.ARBITRUM]: {
        data: new DecimalBigNumber("0"),
        error: null,
        isError: false,
        isSuccess: true,
        isLoading: false,
        isLoadingError: false,
        isIdle: false,
        isRefetchError: false,
        failureCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isFetching: false,
        isPlaceholderData: false,
        isPreviousData: false,
        isRefetching: false,
        isStale: false,
        status: "success",
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        refetch: () => {
          return new Promise(() => {
            return true;
          });
        },
        remove: () => {
          return new Promise(() => {
            return true;
          });
        },
      },
      [NetworkId.AVALANCHE]: {
        data: new DecimalBigNumber("0"),
        error: null,
        isError: false,
        isSuccess: true,
        isLoading: false,
        isLoadingError: false,
        isIdle: false,
        isRefetchError: false,
        failureCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isFetching: false,
        isPlaceholderData: false,
        isPreviousData: false,
        isRefetching: false,
        isStale: false,
        status: "success",
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        refetch: () => {
          return new Promise(() => {
            return true;
          });
        },
        remove: () => {
          return new Promise(() => {
            return true;
          });
        },
      },
      [NetworkId.AVALANCHE_TESTNET]: {
        data: new DecimalBigNumber("0"),
        error: null,
        isError: false,
        isSuccess: true,
        isLoading: false,
        isLoadingError: false,
        isIdle: false,
        isRefetchError: false,
        failureCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isFetching: false,
        isPlaceholderData: false,
        isPreviousData: false,
        isRefetching: false,
        isStale: false,
        status: "success",
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        refetch: () => {
          return new Promise(() => {
            return true;
          });
        },
        remove: () => {
          return new Promise(() => {
            return true;
          });
        },
      },
      [NetworkId.POLYGON]: {
        data: new DecimalBigNumber("0"),
        error: null,
        isError: false,
        isSuccess: true,
        isLoading: false,
        isLoadingError: false,
        isIdle: false,
        isRefetchError: false,
        failureCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isFetching: false,
        isPlaceholderData: false,
        isPreviousData: false,
        isRefetching: false,
        isStale: false,
        status: "success",
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        refetch: () => {
          return new Promise(() => {
            return true;
          });
        },
        remove: () => {
          return new Promise(() => {
            return true;
          });
        },
      },
      [NetworkId.FANTOM]: {
        data: new DecimalBigNumber("0"),
        error: null,
        isError: false,
        isSuccess: true,
        isLoading: false,
        isLoadingError: false,
        isIdle: false,
        isRefetchError: false,
        failureCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isFetching: false,
        isPlaceholderData: false,
        isPreviousData: false,
        isRefetching: false,
        isStale: false,
        status: "success",
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        refetch: () => {
          return new Promise(() => {
            return true;
          });
        },
        remove: () => {
          return new Promise(() => {
            return true;
          });
        },
      },
      [NetworkId.OPTIMISM]: {
        data: new DecimalBigNumber("0"),
        error: null,
        isError: false,
        isSuccess: true,
        isLoading: false,
        isLoadingError: false,
        isIdle: false,
        isRefetchError: false,
        failureCount: 0,
        isFetched: true,
        isFetchedAfterMount: true,
        isFetching: false,
        isPlaceholderData: false,
        isPreviousData: false,
        isRefetching: false,
        isStale: false,
        status: "success",
        dataUpdatedAt: 0,
        errorUpdatedAt: 0,
        refetch: () => {
          return new Promise(() => {
            return true;
          });
        },
        remove: () => {
          return new Promise(() => {
            return true;
          });
        },
      },
    });

    let container;
    await act(async () => {
      ({ container } = render(<ZapStakeAction />));
    });

    fireEvent.click(await screen.findByTestId("zap-input"));
    fireEvent.click(await screen.getAllByText("ETH")[0]);
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "1" } });
    // Since there is no output token selected, this is displayed
    expect(await screen.findByText("Enter Amount"));
    fireEvent.click(await screen.findByTestId("zap-output"));
    fireEvent.click(await screen.getByText("gOHM"));
    fireEvent.input(await screen.findByTestId("zap-amount-input"), { target: { value: "1" } });
    // Once the output token has been selected, the zap button will be displayed
    expect(await screen.findByText("Zap-Stake"));
    expect(container).toMatchSnapshot();
  }, 20000);
});
