import { BigNumber } from "@ethersproject/bignumber";
import { useQueries, useQuery, UseQueryResult } from "react-query";
import { NetworkId } from "src/constants";
import {
  AddressMap,
  FUSE_POOL_6_ADDRESSES,
  FUSE_POOL_18_ADDRESSES,
  FUSE_POOL_36_ADDRESSES,
  GOHM_ADDRESSES,
  GOHM_TOKEMAK_ADDRESSES,
  OHM_ADDRESSES,
  SOHM_ADDRESSES,
  V1_OHM_ADDRESSES,
  V1_SOHM_ADDRESSES,
  WSOHM_ADDRESSES,
} from "src/constants/addresses";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";

import { useWeb3Context } from ".";
import { useMultipleTokenContracts, useStaticFuseContract } from "./useContract";

export const balanceQueryKey = (address?: string, tokenAddressMap?: AddressMap, networkId?: NetworkId) =>
  ["useBalance", address, tokenAddressMap, networkId].filter(nonNullable);

/**
 * Returns a balance.
 * @param addressMap Address map of the token you want the balance of.
 */
export const useBalance = <TAddressMap extends AddressMap = AddressMap>(tokenAddressMap: TAddressMap) => {
  const { address } = useWeb3Context();
  const contracts = useMultipleTokenContracts(tokenAddressMap);

  const networkIds = Object.keys(tokenAddressMap).map(Number);

  const results = useQueries(
    networkIds.map(networkId => ({
      enabled: !!address,
      queryFn: () => contracts[networkId as NetworkId].balanceOf(address),
      queryKey: balanceQueryKey(address, tokenAddressMap, networkId),
    })),
  );

  return networkIds.reduce(
    (prev, networkId, index) => Object.assign(prev, { [networkId]: results[index] }),
    {} as Record<keyof typeof tokenAddressMap, UseQueryResult<BigNumber>>,
  );
};

/**
 * Returns gOHM balance in Fuse
 */
export const fuseBalanceQueryKey = (address: string) => ["useFuseBalance", address].filter(nonNullable);
export const useFuseBalance = () => {
  const { address } = useWeb3Context();
  const pool6Contract = useStaticFuseContract(FUSE_POOL_6_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);
  const pool18Contract = useStaticFuseContract(FUSE_POOL_18_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);
  const pool36Contract = useStaticFuseContract(FUSE_POOL_36_ADDRESSES[NetworkId.MAINNET], NetworkId.MAINNET);

  return {
    [NetworkId.MAINNET]: useQuery<BigNumber, Error>(
      fuseBalanceQueryKey(address),
      async () => {
        queryAssertion(address, fuseBalanceQueryKey(address));

        const promises = [pool6Contract, pool18Contract, pool36Contract].map(async contract => {
          return contract.callStatic.balanceOfUnderlying(address);
        });

        const results = await Promise.all(promises);

        return results.reduce((prev, bal) => prev.add(bal), BigNumber.from(0));
      },
      { enabled: !!address },
    ),
  };
};

export const useOhmBalance = () => useBalance(OHM_ADDRESSES);
export const useSohmBalance = () => useBalance(SOHM_ADDRESSES);
export const useGohmBalance = () => useBalance(GOHM_ADDRESSES);
export const useWsohmBalance = () => useBalance(WSOHM_ADDRESSES);
export const useV1OhmBalance = () => useBalance(V1_OHM_ADDRESSES);
export const useV1SohmBalance = () => useBalance(V1_SOHM_ADDRESSES);
export const useGohmTokemakBalance = () => useBalance(GOHM_TOKEMAK_ADDRESSES);
