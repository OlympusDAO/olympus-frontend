import { Contract, ContractInterface } from "@ethersproject/contracts";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { useMemo } from "react";
import { abi as IERC20_ABI } from "src/abi/IERC20.json";
import STAKING_ABI from "src/abi/OlympusStakingv2.json";
import { abi as PAIR_CONTRACT_ABI } from "src/abi/PairContract.json";
import { abi as sOHMv2 } from "src/abi/sOhmv2.json";
import { NetworkId } from "src/constants";
import { AddressMap, SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { assert } from "src/helpers";
import { ohm_dai } from "src/helpers/AllBonds";
import { NodeHelper } from "src/helpers/NodeHelper";
import { OlympusStakingv2, PairContract, SOhmv2 } from "src/typechain";

import { useWeb3Context } from ".";

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
  provider?: StaticJsonRpcProvider,
): TContract;
export function useContract<TContract extends Contract = Contract>(
  addressOrMap: string | AddressMap,
  ABI: ContractInterface,
  provider?: StaticJsonRpcProvider,
): TContract | null {
  const { provider: currentProvider, networkId } = useWeb3Context();

  return useMemo(() => {
    const address = typeof addressOrMap === "string" ? addressOrMap : addressOrMap[networkId as NetworkId];
    if (!address) return null;

    try {
      return new Contract(address, ABI, provider || currentProvider) as TContract;
    } catch (error) {
      console.error("Unable to get contract", error);
      return null;
    }
  }, [addressOrMap, ABI, provider, networkId, currentProvider]);
}

export const useMainnetContract = <TContract extends Contract = Contract>(address: string, ABI: ContractInterface) => {
  const provider = NodeHelper.getMainnetStaticProvider();

  return useContract<TContract>(address, ABI, provider);
};

export const useTokenContract = (addressMap: AddressMap) => {
  return useContract(addressMap, IERC20_ABI);
};

export const useStakingContract = () => {
  return useMainnetContract<OlympusStakingv2>(STAKING_ADDRESSES[NetworkId.MAINNET], STAKING_ABI);
};

export const useOhmDaiReserveContract = () => {
  const address = ohm_dai.getAddressForReserve(NetworkId.MAINNET);
  assert(address, "Contract should exist for NetworkId.MAINNET");

  return useMainnetContract<PairContract>(address, PAIR_CONTRACT_ABI);
};

export const useSohmContract = () => {
  return useMainnetContract<SOhmv2>(SOHM_ADDRESSES[NetworkId.MAINNET], sOHMv2);
};
