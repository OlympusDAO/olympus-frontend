import { Contract, ContractInterface } from "@ethersproject/contracts";
import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { useMemo } from "react";
import { abi as FUSE_PROXY_ABI } from "src/abi/FuseProxy.json";
import { abi as IERC20_ABI } from "src/abi/IERC20.json";
import STAKING_ABI from "src/abi/OlympusStakingv2.json";
import { abi as PAIR_CONTRACT_ABI } from "src/abi/PairContract.json";
import { abi as SOHM_ABI } from "src/abi/sOhmv2.json";
import { NetworkId } from "src/constants";
import { AddressMap, SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { assert } from "src/helpers";
import { ohm_dai } from "src/helpers/AllBonds";
import { FuseProxy, IERC20, OlympusStakingv2, PairContract, SOhmv2 } from "src/typechain";

import { useWeb3Context } from ".";
import { useStaticProvider } from "./useStaticProvider";

/**
 * Hook for fetching a contract.
 *
 * @param addressOrMap A contract address, or a map with a contract address for each network
 * @param ABI The contract interface
 * @param provider An optional static provider to be used by the contract
 */
export function useContract<TContract extends Contract = Contract>(
  addressOrMap: AddressMap,
  ABI: ContractInterface,
): TContract | null;
export function useContract<TContract extends Contract = Contract>(
  addressOrMap: string,
  ABI: ContractInterface,
  providerOrSigner?: StaticJsonRpcProvider | JsonRpcSigner,
): TContract;
export function useContract<TContract extends Contract = Contract>(
  addressOrMap: string | AddressMap,
  ABI: ContractInterface,
  providerOrSigner?: StaticJsonRpcProvider | JsonRpcSigner,
): TContract | null {
  const { provider: injectedProvider, networkId } = useWeb3Context();

  return useMemo(() => {
    const address = typeof addressOrMap === "string" ? addressOrMap : addressOrMap[networkId as NetworkId];
    if (!address) return null;

    try {
      return new Contract(address, ABI, providerOrSigner || injectedProvider) as TContract;
    } catch (error) {
      console.error("Unable to get contract", error);
      return null;
    }
  }, [addressOrMap, ABI, networkId, providerOrSigner, injectedProvider]);
}

export const useAnynetContract = <TContract extends Contract = Contract>(
  networkId: NetworkId,
  address: string,
  ABI: ContractInterface,
) => {
  const provider = useStaticProvider(networkId);

  return useContract<TContract>(address, ABI, provider);
};

export const useTokenContract = (addressMap: AddressMap) => {
  return useContract<IERC20>(addressMap, IERC20_ABI);
};

export const useStakingContract = () => {
  return useAnynetContract<OlympusStakingv2>(NetworkId.MAINNET, STAKING_ADDRESSES[NetworkId.MAINNET], STAKING_ABI);
};

export const useOhmDaiReserveContract = () => {
  const address = ohm_dai.getAddressForReserve(NetworkId.MAINNET);
  assert(address, "Contract should exist for NetworkId.MAINNET");

  return useAnynetContract<PairContract>(NetworkId.MAINNET, address, PAIR_CONTRACT_ABI);
};

export const useSohmContract = () => {
  return useAnynetContract<SOhmv2>(NetworkId.MAINNET, SOHM_ADDRESSES[NetworkId.MAINNET], SOHM_ABI);
};

export const useFuseContract = (fuseAddressMap: Record<NetworkId.MAINNET, string>) => {
  return useAnynetContract<FuseProxy>(NetworkId.MAINNET, fuseAddressMap[NetworkId.MAINNET], FUSE_PROXY_ABI);
};

export const usePairContract = (address: string, provider?: StaticJsonRpcProvider) => {
  return useContract<PairContract>(address, PAIR_CONTRACT_ABI, provider);
};
