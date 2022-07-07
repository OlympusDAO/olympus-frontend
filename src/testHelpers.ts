import { MockConnector } from "@wagmi/core/connectors/mock";
import mediaQuery from "css-mediaquery";
import { BigNumber, ethers, providers } from "ethers";
import { Wallet } from "ethers/lib/ethers";
import { UseQueryResult } from "react-query";
import { allChains, Chain, chain as chain_, createClient, CreateClientConfig } from "wagmi";
import * as WAGMI from "wagmi";

import { NetworkId } from "./constants";
import { DecimalBigNumber } from "./helpers/DecimalBigNumber/DecimalBigNumber";
import { IUserRecipientInfo } from "./hooks/useGiveInfo";
import { ZapHelperBalancesResponse } from "./hooks/useZapTokenBalances";
import { IUserDonationInfo } from "./views/Give/Interfaces";

const provider = new ethers.providers.StaticJsonRpcProvider();

export const createMatchMedia = (width: string) => {
  return (query: string) => ({
    matches: mediaQuery.match(query, {
      width,
    }),
    addListener: () => {
      undefined;
    },
    removeListener: () => {
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
  const chain = allChains.find(x => x.id === chainId) ?? chain_.hardhat;
  const network = getNetwork(chain);
  const url = chain_.mainnet.rpcUrls.default.toString();
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

export function disconnectedWallet() {
  //@ts-ignore
  WAGMI.useConnect = jest.fn(() => {
    return {
      activeConnector: mockConnector,
      connectors: [mockConnector],
    };
  });

  //@ts-ignore
  WAGMI.useAccount = jest.fn(() => {
    return {
      isConnected: false,
      address: "",
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
      refetch: jest.fn(),
      status: "success",
    };
  });

  //@ts-ignore
  WAGMI.useSigner = jest.fn(() => {
    return {
      data: getSigners()[0],
    };
  });
}
export function connectWallet() {
  //@ts-ignore
  WAGMI.useConnect = jest.fn(() => {
    return {
      activeConnector: mockConnector,
      connectors: [mockConnector],
    };
  });

  //@ts-ignore
  WAGMI.useAccount = jest.fn(() => {
    return {
      address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      connector: mockConnector,
      isConnected: true,
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
      refetch: jest.fn(),
      status: "success",
    };
  });
  //@ts-ignore
  // WAGMI.useNetwork = jest.fn(() => {
  //   return {
  //     activeChain: {
  //       id: 1,
  //       name: "Ethereum",
  //       network: "homestead",
  //       nativeCurrency: {
  //         name: "Ether",
  //         symbol: "ETH",
  //         decimals: 18,
  //       },
  //       rpcUrls: {
  //         alchemy: "https://eth-mainnet.alchemyapi.io/v2",
  //         infura: "https://mainnet.infura.io/v3",
  //         default: "https://eth-mainnet.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
  //       },
  //       blockExplorers: {
  //         etherscan: {
  //           name: "Etherscan",
  //           url: "https://etherscan.io",
  //         },
  //         default: {
  //           name: "Etherscan",
  //           url: "https://etherscan.io",
  //         },
  //       },
  //     },
  //     chains: [
  //       {
  //         id: 1,
  //         name: "Ethereum",
  //         network: "homestead",
  //         nativeCurrency: {
  //           name: "Ether",
  //           symbol: "ETH",
  //           decimals: 18,
  //         },
  //         rpcUrls: {
  //           alchemy: "https://eth-mainnet.alchemyapi.io/v2",
  //           infura: "https://mainnet.infura.io/v3",
  //           default: "https://eth-mainnet.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
  //         },
  //         blockExplorers: {
  //           etherscan: {
  //             name: "Etherscan",
  //             url: "https://etherscan.io",
  //           },
  //           default: {
  //             name: "Etherscan",
  //             url: "https://etherscan.io",
  //           },
  //         },
  //       },
  //       {
  //         id: 137,
  //         name: "Polygon",
  //         network: "matic",
  //         nativeCurrency: {
  //           name: "MATIC",
  //           symbol: "MATIC",
  //           decimals: 18,
  //         },
  //         rpcUrls: {
  //           alchemy: "https://polygon-mainnet.g.alchemy.com/v2",
  //           infura: "https://polygon-mainnet.infura.io/v3",
  //           default: "https://polygon-mainnet.g.alchemy.com/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
  //         },
  //         blockExplorers: {
  //           etherscan: {
  //             name: "PolygonScan",
  //             url: "https://polygonscan.com",
  //           },
  //           default: {
  //             name: "PolygonScan",
  //             url: "https://polygonscan.com",
  //           },
  //         },
  //       },
  //       {
  //         id: 10,
  //         name: "Optimism",
  //         network: "optimism",
  //         nativeCurrency: {
  //           name: "Ether",
  //           symbol: "ETH",
  //           decimals: 18,
  //         },
  //         rpcUrls: {
  //           alchemy: "https://opt-mainnet.g.alchemy.com/v2",
  //           infura: "https://optimism-mainnet.infura.io/v3",
  //           default: "https://opt-mainnet.g.alchemy.com/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
  //         },
  //         blockExplorers: {
  //           etherscan: {
  //             name: "Etherscan",
  //             url: "https://optimistic.etherscan.io",
  //           },
  //           default: {
  //             name: "Etherscan",
  //             url: "https://optimistic.etherscan.io",
  //           },
  //         },
  //       },
  //       {
  //         id: 42161,
  //         name: "Arbitrum",
  //         network: "arbitrum",
  //         nativeCurrency: {
  //           name: "Ether",
  //           symbol: "AETH",
  //           decimals: 18,
  //         },
  //         rpcUrls: {
  //           alchemy: "https://arb-mainnet.g.alchemy.com/v2",
  //           infura: "https://arbitrum-mainnet.infura.io/v3",
  //           default: "https://arb-mainnet.g.alchemy.com/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
  //         },
  //         blockExplorers: {
  //           arbitrum: {
  //             name: "Arbitrum Explorer",
  //             url: "https://explorer.arbitrum.io",
  //           },
  //           etherscan: {
  //             name: "Arbiscan",
  //             url: "https://arbiscan.io",
  //           },
  //           default: {
  //             name: "Arbiscan",
  //             url: "https://arbiscan.io",
  //           },
  //         },
  //       },
  //       {
  //         id: 4,
  //         name: "Rinkeby",
  //         network: "rinkeby",
  //         nativeCurrency: {
  //           name: "Rinkeby Ether",
  //           symbol: "rETH",
  //           decimals: 18,
  //         },
  //         rpcUrls: {
  //           alchemy: "https://eth-rinkeby.alchemyapi.io/v2",
  //           infura: "https://rinkeby.infura.io/v3",
  //           default: "https://eth-rinkeby.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
  //         },
  //         blockExplorers: {
  //           etherscan: {
  //             name: "Etherscan",
  //             url: "https://rinkeby.etherscan.io",
  //           },
  //           default: {
  //             name: "Etherscan",
  //             url: "https://rinkeby.etherscan.io",
  //           },
  //         },
  //         testnet: true,
  //       },
  //       {
  //         id: 288,
  //         name: "Boba Network",
  //         network: "boba",
  //         nativeCurrency: {
  //           name: "Boba",
  //           symbol: "BOBA",
  //           decimals: 18,
  //         },
  //         rpcUrls: {
  //           default: "https://mainnet.boba.network",
  //         },
  //         testnet: false,
  //         iconUrl:
  //           "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_boba.jpg&w=64&q=100",
  //       },
  //       {
  //         name: "Avalanche",
  //         network: "avalanche",
  //         id: 43114,
  //         nativeCurrency: {
  //           name: "Avalanche",
  //           symbol: "AVAX",
  //           decimals: 18,
  //         },
  //         rpcUrls: {
  //           default: "https://api.avax.network/ext/bc/C/rpc",
  //         },
  //         iconUrl:
  //           "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=64&q=100",
  //       },
  //       {
  //         name: "Fantom",
  //         network: "fantom",
  //         id: 250,
  //         nativeCurrency: {
  //           name: "Fantom",
  //           symbol: "FTM",
  //           decimals: 18,
  //         },
  //         rpcUrls: {
  //           default: "https://rpc.fantom.network",
  //         },
  //         iconUrl:
  //           "https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_fantom.jpg&w=64&q=100",
  //       },
  //     ],
  //   };
  // });

  //@ts-ignore
  WAGMI.useSigner = jest.fn(() => {
    return {
      data: getSigners()[0],
    };
  });
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

// TODO abstract out return object
export const mockZapTokenBalances = (
  data: ZapHelperBalancesResponse,
): UseQueryResult<ZapHelperBalancesResponse, Error> => {
  return {
    data: data,
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

export const mockRecipientInfo = (data: IUserRecipientInfo): UseQueryResult<IUserRecipientInfo, Error> => {
  return {
    data: data,
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

export const mockOhmPrice = (data: number): UseQueryResult<number, Error> => {
  return {
    data: data,
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

export const mockRedeemableBalance = (data: string): UseQueryResult<string, Error> => {
  return {
    data: data,
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

export const mockGohmPrice = (data: number): UseQueryResult<number, Error> => {
  return {
    data: data,
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

export const mockSohmBalance = (
  data: Record<NetworkId.MAINNET | NetworkId.TESTNET_RINKEBY, DecimalBigNumber>,
): Record<NetworkId.MAINNET | NetworkId.TESTNET_RINKEBY, UseQueryResult<DecimalBigNumber, Error>> => {
  return {
    [NetworkId.MAINNET]: {
      data: data[NetworkId.MAINNET],
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
    [NetworkId.TESTNET_RINKEBY]: {
      data: data[NetworkId.TESTNET_RINKEBY],
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

export const mockGohmBalance = (
  data: Record<
    | NetworkId.MAINNET
    | NetworkId.TESTNET_RINKEBY
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
  | NetworkId.TESTNET_RINKEBY
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
    [NetworkId.TESTNET_RINKEBY]: {
      data: data[NetworkId.TESTNET_RINKEBY],
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

export const mockDonationInfo = (data: IUserDonationInfo): UseQueryResult<IUserDonationInfo, Error> => {
  return {
    data: data,
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

export const mockContractAllowance = (data: BigNumber): UseQueryResult<BigNumber | null, Error> => {
  return {
    data: data,
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
