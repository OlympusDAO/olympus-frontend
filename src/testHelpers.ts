import mediaQuery from "css-mediaquery";
import { ethers } from "ethers";
import { UseQueryResult } from "react-query";
import Web3Modal from "web3modal";

import { IUserRecipientInfo } from "./hooks/useGiveInfo";
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
