import { BigNumber } from "@ethersproject/bignumber";
import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import {
  AddressMap,
  GOHM_ADDRESSES,
  MIGRATOR_ADDRESSES,
  SOHM_ADDRESSES,
  STAKINGV2_ADDRESSES,
  V1_OHM_ADDRESSES,
  V1_SOHM_ADDRESSES,
  WSOHM_ADDRESSES,
} from "src/constants/addresses";
import { assert, queryAssertion } from "src/helpers";

import { useWeb3Context } from ".";
import { useTokenContract } from "./useContract";

export const contractAllowanceQueryKey = (
  networkId?: NetworkId,
  address?: string,
  tokenMap?: AddressMap,
  contractMap?: AddressMap,
) => ["useContractAllowances", networkId, address, tokenMap, contractMap];

export const useContractAllowance = (tokenMap: AddressMap, contractMap: AddressMap) => {
  const { address, networkId } = useWeb3Context();

  const tokenAddress = tokenMap[networkId as NetworkId];
  assert(tokenAddress, `Token doesn't exist for network: ${networkId}`);

  const token = useTokenContract(tokenAddress, networkId);
  const queryKey = contractAllowanceQueryKey(networkId, address, tokenMap, contractMap);

  return useQuery<BigNumber, Error>(
    queryKey,
    async () => {
      queryAssertion(address && networkId, queryKey);

      const contractAddress = contractMap[networkId as NetworkId];

      if (!token) throw new Error("Token doesn't exist on current network");
      if (!contractAddress) throw new Error("Contract doesn't exist on current network");

      return token.allowance(address, contractAddress);
    },
    { enabled: !!address },
  );
};

export const useWsohmMigrationAllowance = () => useContractAllowance(WSOHM_ADDRESSES, MIGRATOR_ADDRESSES);
export const useV1OhmMigrationAllowance = () => useContractAllowance(V1_OHM_ADDRESSES, MIGRATOR_ADDRESSES);
export const useV1SohmMigrationAllowance = () => useContractAllowance(V1_SOHM_ADDRESSES, MIGRATOR_ADDRESSES);
export const useSohmWrapAllowance = () => useContractAllowance(SOHM_ADDRESSES, STAKINGV2_ADDRESSES);
export const useGohmUnwrapAllowance = () => useContractAllowance(GOHM_ADDRESSES, STAKINGV2_ADDRESSES);
