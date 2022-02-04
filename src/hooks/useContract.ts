import { Contract, ContractInterface } from "@ethersproject/contracts";
import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { useMemo } from "react";
import { abi as FUSE_PROXY_ABI } from "src/abi/FuseProxy.json";
import { abi as IERC20_ABI } from "src/abi/IERC20.json";
import STAKING_ABI from "src/abi/OlympusStakingv2.json";
import { abi as PAIR_CONTRACT_ABI } from "src/abi/PairContract.json";
import { abi as SOHM_ABI } from "src/abi/sOhmv2.json";
import { NetworkId } from "src/constants";
import { SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { assert } from "src/helpers";
import { ohm_dai } from "src/helpers/AllBonds";
import { FuseProxy, IERC20, OlympusStakingv2, PairContract, SOhmv2 } from "src/typechain";

import { useStaticProvider } from "./useStaticProvider";

/**
 * Hook for fetching a contract.
 *
 * @param address Contract address
 * @param ABI The contract interface
 * @param providerOrSigner Static provider/signer to be used by the contract
 */
export function useContract<TContract extends Contract = Contract>(
  address: string,
  ABI: ContractInterface,
  providerOrSigner: StaticJsonRpcProvider | JsonRpcSigner,
): TContract {
  return useMemo(() => new Contract(address, ABI, providerOrSigner), [address, ABI, providerOrSigner]) as TContract;
}

export const useAnynetContract = <TContract extends Contract = Contract>(
  networkId: NetworkId,
  address: string,
  ABI: ContractInterface,
) => {
  const provider = useStaticProvider(networkId);
  assert(provider, `No provider available for the network: ${networkId}`);

  return useContract<TContract>(address, ABI, provider);
};

export const useTokenContract = (address: string, networkId: NetworkId) => {
  return useAnynetContract<IERC20>(networkId, address, IERC20_ABI);
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

export const usePairContract = (address: string, networkId: NetworkId) => {
  return useAnynetContract<PairContract>(networkId, address, PAIR_CONTRACT_ABI);
};
