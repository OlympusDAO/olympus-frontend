import { Contract, ContractInterface } from "@ethersproject/contracts";
import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { useMemo } from "react";
import { abi as FUSE_PROXY_ABI } from "src/abi/FuseProxy.json";
import { abi as IERC20_ABI } from "src/abi/IERC20.json";
import STAKING_ABI from "src/abi/OlympusStakingv2.json";
import { abi as PAIR_CONTRACT_ABI } from "src/abi/PairContract.json";
import { abi as SOHM_ABI } from "src/abi/sOhmv2.json";
import { AddressMap } from "src/constants/addresses";
import { NetworkId } from "src/networkDetails";
import { FuseProxy, IERC20, OlympusStakingv2, PairContract, SOhmv2 } from "src/typechain";

import { useWeb3Context } from ".";
import { useStaticProvider, useStaticProviders } from "./useStaticProvider";

/**
 * Hook for fetching a contract.
 *
 * @param address Contract address
 * @param ABI The contract interface
 * @param providerOrSigner Provider/signer to be used by the contract
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
 * Static contracts require an explicit network id to be given as an argument.
 */
const createStaticContract = <TContract extends Contract = Contract>(ABI: ContractInterface) => {
  return (address: string, networkId: NetworkId) => {
    const provider = useStaticProvider(networkId);

    return useContract<TContract>(address, ABI, provider);
  };
};

/**
 * Helper function to create a dynamic contract hook.
 * Dynamic contracts use the provider/signer injected by the users wallet.
 * Since a wallet can be connected to any network, a dynamic contract hook
 * can possibly return null if there is no contract address specified for
 * the currently active network.
 */
const createDynamicContract = <TContract extends Contract = Contract>(ABI: ContractInterface) => {
  return (addressMap: AddressMap, asSigner = false) => {
    const { provider, connected } = useWeb3Context();

    return useContract<TContract>(addressMap, ABI, asSigner && connected ? provider.getSigner() : provider);
  };
};

/**
 * Hook that returns a contract for every network in an address map
 */
export const useMultipleContracts = <TContract extends Contract = Contract>(
  addressMap: AddressMap,
  ABI: ContractInterface,
) => {
  const networks = useMemo(() => Object.keys(addressMap).map(Number), [addressMap]);
  const providers = useStaticProviders(networks);

  return useMemo(() => {
    return Object.values(addressMap).map((address, index) => {
      return new Contract(address, ABI, providers[index]) as TContract;
    });
  }, [addressMap, ABI, providers]);
};

export const useStaticSohmContract = createStaticContract<SOhmv2>(SOHM_ABI);
export const useStaticTokenContract = createStaticContract<IERC20>(IERC20_ABI);
export const useStaticFuseContract = createStaticContract<FuseProxy>(FUSE_PROXY_ABI);
export const useStaticPairContract = createStaticContract<PairContract>(PAIR_CONTRACT_ABI);
export const useStaticStakingContract = createStaticContract<OlympusStakingv2>(STAKING_ABI);

export const useDynamicTokenContract = createDynamicContract<IERC20>(IERC20_ABI);
export const useDynamicStakingContract = createDynamicContract<OlympusStakingv2>(STAKING_ABI);
