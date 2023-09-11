import { UseQueryResult } from "@tanstack/react-query";
import { MockConnector } from "@wagmi/core/connectors/mock";
import mediaQuery from "css-mediaquery";
import { BigNumber, providers } from "ethers";
import { Wallet } from "ethers/lib/ethers";
import { NetworkId } from "src/constants";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { chains as allChains } from "src/hooks/wagmi";
import { vi } from "vitest";
import { Chain, createClient, CreateClientConfig } from "wagmi";
import * as WAGMI from "wagmi";
import { hardhat } from "wagmi/chains";

export const createMatchMedia = (width: string): ((query: string) => MediaQueryList) => {
  return (query: string) => ({
    matches: mediaQuery.match(query, {
      width,
    }),
    media: "",
    onchange: () => {
      return null;
    },
    dispatchEvent: () => {
      return false;
    },
    addListener: () => {
      undefined;
    },
    removeListener: () => {
      undefined;
    },
    addEventListener: () => {
      undefined;
    },
    removeEventListener: () => {
      undefined;
    },
  });
};

export function getNetwork(chain: Chain) {
  return {
    chainId: chain.id,
    ensAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    name: chain.name,
  };
}

class EthersProviderWrapper extends providers.StaticJsonRpcProvider {
  toJSON() {
    return `<Provider network={${this.network.chainId}} />`;
  }
}

export function getProvider({ chainId }: { chainId?: number } = {}) {
  const chain = allChains.find(x => x.id === chainId) ?? hardhat;
  const network = getNetwork(chain);
  const url: string = chain.rpcUrls.default.http[0];
  const provider = new EthersProviderWrapper(url, network);
  provider.pollingInterval = 1_000;
  return provider;
}

export function getSigners() {
  const provider = getProvider({ chainId: 1 });
  const wallet = new Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
  return [provider.getSigner(wallet.address)];
}

export const mockConnector = new MockConnector({
  options: { signer: getSigners()[0] },
});

export function invalidAddress() {
  vi.mock("wagmi", async () => {
    const actualModule = await vi.importActual("wagmi");
    return {
      __esModule: true,
      ...actualModule,
    };
  });
  //@ts-ignore
  vi.spyOn(WAGMI, "useConnect").mockReturnValue(() => {
    return {
      activeConnector: mockConnector,
      connectors: [mockConnector],
    };
  });
}

export function disconnectedWallet() {
  // //@ts-ignore
  // WAGMI.useConnect = vi.fn(() => {
  //   return {
  //     activeConnector: mockConnector,
  //     connectors: [mockConnector],
  //   };
  // });
  // //@ts-ignore
  // WAGMI.useAccount = vi.fn(() => {
  //   return {
  //     isConnected: false,
  //     address: "",
  //     connector: mockConnector,
  //     error: null,
  //     fetchStatus: "idle",
  //     internal: {
  //       dataUpdatedAt: 1654570110046,
  //       errorUpdatedAt: 0,
  //       failureCount: 0,
  //       isFetchedAfterMount: true,
  //       isLoadingError: false,
  //       isPaused: false,
  //       isPlaceholderData: false,
  //       isPreviousData: false,
  //       isRefetchError: false,
  //       isStale: true,
  //     },
  //     isError: false,
  //     isFetched: true,
  //     isFetching: false,
  //     isIdle: false,
  //     isLoading: false,
  //     isRefetching: false,
  //     isSuccess: true,
  //     refetch: vi.fn(),
  //     status: "success",
  //   };
  // });
  //   //@ts-ignore
  //   WAGMI.useSigner = vi.fn(() => {
  //     return {
  //       data: getSigners()[0],
  //     };
  //   });
}
export const useAccount = {
  address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  isConnected: true,
  connector: mockConnector,
  error: null,
  fetchStatus: "idle",
  internal: {
    dataUpdatedAt: 1654570110046,
    errorUpdatedAt: 0,
    failureCount: 0,
    isFetchedAfterMount: true,
    isLoadingError: false,
    isPaused: false,
    isPlaceholderData: false,
    isPreviousData: false,
    isRefetchError: false,
    isStale: true,
  },
  isError: false,
  isFetched: true,
  isFetching: false,
  isIdle: false,
  isLoading: false,
  isRefetching: false,
  isSuccess: true,
  refetch: vi.fn(),
  status: "success",
};

export function connectWallet() {
  vi.mock("wagmi", async () => {
    const actualModule = await vi.importActual("wagmi");
    return {
      __esModule: true,
      ...actualModule,
    };
  });
  //@ts-ignore
  vi.spyOn(WAGMI, "useSigner").mockReturnValue({
    data: getSigners()[0],
  });
  vi.spyOn(WAGMI, "useAccount").mockReturnValue(useAccount);
}

type Config = Partial<CreateClientConfig>;

export function setupClient(config: Config = {}) {
  return createClient({
    connectors: [
      new MockConnector({
        options: {
          signer: getSigners()[0],
        },
      }),
    ],
    provider: getProvider(),
    ...config,
  });
}

export const mockRedeemableBalance = (data: string): UseQueryResult<string, Error> => {
  return {
    data: data,
    error: null,
    isError: false,
    isSuccess: true,
    isLoading: false,
    isLoadingError: false,
    isPaused: false,
    fetchStatus: "idle",
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
    errorUpdateCount: 0,
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
  };
};

export const mockStakingRebaseRate = (data: number): UseQueryResult<number, Error> => {
  return {
    data: data,
    error: null,
    isError: false,
    isSuccess: true,
    isLoading: false,
    isLoadingError: false,
    isPaused: false,
    fetchStatus: "idle",
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
    errorUpdateCount: 0,
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
  };
};

export const mockGohmBalance = (
  data: Record<
    | NetworkId.MAINNET
    | NetworkId.TESTNET_GOERLI
    | NetworkId.ARBITRUM
    | NetworkId.ARBITRUM_TESTNET
    | NetworkId.AVALANCHE
    | NetworkId.AVALANCHE_TESTNET
    | NetworkId.POLYGON
    | NetworkId.FANTOM
    | NetworkId.OPTIMISM,
    DecimalBigNumber
  >,
): Record<
  | NetworkId.MAINNET
  | NetworkId.TESTNET_GOERLI
  | NetworkId.ARBITRUM
  | NetworkId.ARBITRUM_TESTNET
  | NetworkId.AVALANCHE
  | NetworkId.AVALANCHE_TESTNET
  | NetworkId.POLYGON
  | NetworkId.FANTOM
  | NetworkId.OPTIMISM,
  UseQueryResult<DecimalBigNumber, Error>
> => {
  return {
    [NetworkId.MAINNET]: {
      data: data[NetworkId.MAINNET],
      error: null,
      isError: false,
      isSuccess: true,
      isLoading: false,
      isLoadingError: false,
      isPaused: false,
      fetchStatus: "idle",
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
      errorUpdateCount: 0,
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
    [NetworkId.TESTNET_GOERLI]: {
      data: data[NetworkId.TESTNET_GOERLI],
      error: null,
      isError: false,
      isSuccess: true,
      isLoading: false,
      isLoadingError: false,
      isPaused: false,
      fetchStatus: "idle",
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
      errorUpdateCount: 0,
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
      data: data[NetworkId.ARBITRUM],
      error: null,
      isError: false,
      isSuccess: true,
      isLoading: false,
      isLoadingError: false,
      isPaused: false,
      fetchStatus: "idle",
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
      errorUpdateCount: 0,
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
      data: data[NetworkId.ARBITRUM_TESTNET],
      error: null,
      isError: false,
      isSuccess: true,
      isLoading: false,
      isLoadingError: false,
      isPaused: false,
      fetchStatus: "idle",
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
      errorUpdateCount: 0,
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
      data: data[NetworkId.AVALANCHE],
      error: null,
      isError: false,
      isSuccess: true,
      isLoading: false,
      isLoadingError: false,
      isPaused: false,
      fetchStatus: "idle",
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
      errorUpdateCount: 0,
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
      data: data[NetworkId.AVALANCHE_TESTNET],
      error: null,
      isError: false,
      isSuccess: true,
      isLoading: false,
      isLoadingError: false,
      isPaused: false,
      fetchStatus: "idle",
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
      errorUpdateCount: 0,
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
      data: data[NetworkId.POLYGON],
      error: null,
      isError: false,
      isSuccess: true,
      isLoading: false,
      isLoadingError: false,
      isPaused: false,
      fetchStatus: "idle",
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
      errorUpdateCount: 0,
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
      data: data[NetworkId.FANTOM],
      error: null,
      isError: false,
      isSuccess: true,
      isLoading: false,
      isLoadingError: false,
      isPaused: false,
      fetchStatus: "idle",
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
      errorUpdateCount: 0,
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
      data: data[NetworkId.OPTIMISM],
      error: null,
      isError: false,
      isSuccess: true,
      isLoading: false,
      isLoadingError: false,
      isPaused: false,
      fetchStatus: "idle",
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
      errorUpdateCount: 0,
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
  };
};

export const mockContractAllowance = (data: BigNumber): UseQueryResult<BigNumber | null, Error> => {
  return {
    data: data,
    error: null,
    isError: false,
    isSuccess: true,
    isLoading: false,
    isLoadingError: false,
    isPaused: false,
    fetchStatus: "idle",
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
    errorUpdateCount: 0,
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
  };
};

export const mockCurrentIndex = (data: DecimalBigNumber): UseQueryResult<DecimalBigNumber, Error> => {
  return {
    data: data,
    error: null,
    isError: false,
    isSuccess: true,
    isLoading: false,
    isLoadingError: false,
    isPaused: false,
    fetchStatus: "idle",
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
    errorUpdateCount: 0,
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
  };
};
