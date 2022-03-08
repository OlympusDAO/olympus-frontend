import { Contract, ContractInterface } from "@ethersproject/contracts";
import { useMemo } from "react";
import { abi as FUSE_PROXY_ABI } from "src/abi/FuseProxy.json";
import { abi as IERC20_ABI } from "src/abi/IERC20.json";
import STAKING_ABI from "src/abi/OlympusStakingv2.json";
import { abi as PAIR_CONTRACT_ABI } from "src/abi/PairContract.json";
import { abi as SOHM_ABI } from "src/abi/sOhmv2.json";
import { AddressMap } from "src/constants/addresses";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { NetworkId } from "src/networkDetails";
import { FuseProxy, IERC20, OlympusStakingv2, PairContract, SOhmv2 } from "src/typechain";

import { useWeb3Context } from ".";

/**
 * Helper function to create a static contract hook.
 * Static contracts require an explicit network id to be given as an argument.
 */
const createStaticContract = <TContract extends Contract = Contract>(ABI: ContractInterface) => {
  return (address: string, networkId: NetworkId) => {
    const provider = Providers.getStaticProvider(networkId);

    return useMemo(() => new Contract(address, ABI, provider) as TContract, [address, provider]);
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
    const { provider, connected, networkId } = useWeb3Context();

    return useMemo(() => {
      const address = addressMap[networkId as keyof typeof addressMap];

      if (!address) return null;

      const providerOrSigner = asSigner && connected ? provider.getSigner() : provider;

      return new Contract(address, ABI, providerOrSigner) as TContract;
    }, [addressMap, asSigner, connected, networkId, provider]);
  };
};

/**
 * Hook that returns a contract for every network in an address map
 */
export const createMultipleStaticContracts = <TContract extends Contract = Contract>(ABI: ContractInterface) => {
  return <TAddressMap extends AddressMap = AddressMap>(addressMap: TAddressMap) => {
    return useMemo(() => {
      return Object.entries(addressMap).reduce((res, [networkId, address]) => {
        const _networkId = Number(networkId) as NetworkId;
        const provider = Providers.getStaticProvider(_networkId);
        const contract = new Contract(address, ABI, provider) as TContract;

        return Object.assign(res, { [networkId]: contract });
      }, {} as Record<keyof typeof addressMap, TContract>);
    }, [addressMap]);
  };
};

// Static contracts
export const useStaticSohmContract = createStaticContract<SOhmv2>(SOHM_ABI);
export const useStaticTokenContract = createStaticContract<IERC20>(IERC20_ABI);
export const useStaticFuseContract = createStaticContract<FuseProxy>(FUSE_PROXY_ABI);
export const useStaticPairContract = createStaticContract<PairContract>(PAIR_CONTRACT_ABI);
export const useStaticStakingContract = createStaticContract<OlympusStakingv2>(STAKING_ABI);

// Dynamic contracts
export const useDynamicTokenContract = createDynamicContract<IERC20>(IERC20_ABI);
export const useDynamicStakingContract = createDynamicContract<OlympusStakingv2>(STAKING_ABI);

// Multiple static contracts
export const useMultipleTokenContracts = createMultipleStaticContracts<IERC20>(IERC20_ABI);
