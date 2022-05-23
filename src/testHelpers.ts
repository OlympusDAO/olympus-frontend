import mediaQuery from "css-mediaquery";
import { BigNumber, ethers } from "ethers";
import { UseQueryResult } from "react-query";
import Web3Modal from "web3modal";

import { NetworkId } from "./constants";
import { DecimalBigNumber } from "./helpers/DecimalBigNumber/DecimalBigNumber";
import { IUserRecipientInfo } from "./hooks/useGiveInfo";
import { ZapHelperBalancesResponse } from "./hooks/useZapTokenBalances";
import { IUserDonationInfo } from "./views/Give/Interfaces";

jest.mock("web3modal");

const provider = new ethers.providers.StaticJsonRpcProvider();

export const mockWeb3Context = {
  connected: true,
  networkId: 1,
  provider: provider,
  connect: jest.fn(),
  disconnect: jest.fn(),
  address: "0x49aFdD21097eE0c6e40d69e3233a73Ed76eD43e4",
  hasCachedProvider: jest.fn(() => true),
  connectionError: null,
  networkName: "mainnet",
  providerUri: "https://eth-mainnet.alchemyapi.io/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
  providerInitialized: true,
  web3Modal: new Web3Modal(),
};

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
