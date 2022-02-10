import { Contract, ContractInterface } from "@ethersproject/contracts";
import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { useMemo } from "react";
import { abi as FUSE_PROXY_ABI } from "src/abi/FuseProxy.json";
import { abi as IERC20_ABI } from "src/abi/IERC20.json";
import STAKING_ABI from "src/abi/OlympusStakingv2.json";
import { abi as PAIR_CONTRACT_ABI } from "src/abi/PairContract.json";
import { abi as SOHM_ABI } from "src/abi/sOhmv2.json";
import { AddressMap } from "src/constants/addresses";
import { FuseProxy, IERC20, OlympusStakingv2, PairContract, SOhmv2 } from "src/typechain";

import { useWeb3Context } from ".";

/**
 * Hook for fetching a contract.
 *
 * @param address Contract address
 * @param ABI The contract interface
 * @param providerOrSigner Static provider/signer to be used by the contract
 */
export function useContract<TContract extends Contract = Contract>(
  addressOrAddressMap: string,
  ABI: ContractInterface,
  providerOrSigner: StaticJsonRpcProvider | JsonRpcSigner,
): TContract;
export function useContract<TContract extends Contract = Contract>(
  addressOrAddressMap: AddressMap,
  ABI: ContractInterface,
  providerOrSigner?: StaticJsonRpcProvider | JsonRpcSigner,
): TContract | null;
export function useContract<TContract extends Contract = Contract>(
  addressOrAddressMap: string | AddressMap,
  ABI: ContractInterface,
  providerOrSigner?: StaticJsonRpcProvider | JsonRpcSigner,
): TContract | null {
  const { networkId } = useWeb3Context();

  return useMemo(() => {
    const address =
      typeof addressOrAddressMap === "string"
        ? addressOrAddressMap
        : addressOrAddressMap[networkId as keyof typeof addressOrAddressMap];

    if (!address) return null;

    return new Contract(address, ABI, providerOrSigner) as TContract;
  }, [networkId, addressOrAddressMap, ABI, providerOrSigner]);
}

/**
 * Helper function to create a static contract hook.
 * Static contracts require a provider/signer to be given as an argument.
 */
const createStaticContract = <TContract extends Contract = Contract>(ABI: ContractInterface) => {
  return (address: string, providerOrSigner: StaticJsonRpcProvider | JsonRpcSigner) => {
    return useContract<TContract>(address, ABI, providerOrSigner);
  };
};

/**
 * Helper function to create a dynamic contract hook.
 * Dynamic contracts do not require a provider/signer to be given as an argument.
 * Instead, they are given a map of networkIds and addresses, and use the current network
 * and provider/signer injected by the users wallet. This means that a dynamic contract
 * can possibly return null if that contract does not exist on the currently active network.
 */
const createDynamicContract = <TContract extends Contract = Contract>(ABI: ContractInterface) => {
  return (addressMap: AddressMap, asSigner = false) => {
    const { provider, connected } = useWeb3Context();

    return useContract<TContract>(addressMap, ABI, asSigner && connected ? provider.getSigner() : provider);
  };
};

export const useStaticSohmContract = createStaticContract<SOhmv2>(SOHM_ABI);
export const useStaticTokenContract = createStaticContract<IERC20>(IERC20_ABI);
export const useStaticFuseContract = createStaticContract<FuseProxy>(FUSE_PROXY_ABI);
export const useStaticPairContract = createStaticContract<PairContract>(PAIR_CONTRACT_ABI);
export const useStaticStakingContract = createStaticContract<OlympusStakingv2>(STAKING_ABI);

export const useDynamicTokenContract = createDynamicContract<IERC20>(IERC20_ABI);
export const useDynamicStakingContract = createDynamicContract<OlympusStakingv2>(STAKING_ABI);
