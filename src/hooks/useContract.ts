import { Contract, ContractInterface } from "@ethersproject/contracts";
import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { useMemo } from "react";
import { abi as FUSE_PROXY_ABI } from "src/abi/FuseProxy.json";
import { abi as IERC20_ABI } from "src/abi/IERC20.json";
import STAKING_ABI from "src/abi/OlympusStakingv2.json";
import { abi as PAIR_CONTRACT_ABI } from "src/abi/PairContract.json";
import { abi as SOHM_ABI } from "src/abi/sOhmv2.json";
import { FuseProxy, IERC20, OlympusStakingv2, PairContract, SOhmv2 } from "src/typechain";

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

/**
 * Helper function to create a contract hook by passing in the contract type and ABI.
 */
const createContract = <TContract extends Contract = Contract>(ABI: ContractInterface) => {
  return (address: string, providerOrSigner: StaticJsonRpcProvider | JsonRpcSigner) => {
    return useContract<TContract>(address, ABI, providerOrSigner);
  };
};

export const useSohmContract = createContract<SOhmv2>(SOHM_ABI);
export const useTokenContract = createContract<IERC20>(IERC20_ABI);
export const useFuseContract = createContract<FuseProxy>(FUSE_PROXY_ABI);
export const usePairContract = createContract<PairContract>(PAIR_CONTRACT_ABI);
export const useStakingContract = createContract<OlympusStakingv2>(STAKING_ABI);
