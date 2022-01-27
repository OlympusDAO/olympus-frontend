import { BigNumber } from "@ethersproject/bignumber";
import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import {
  AddressMap,
  MIGRATOR_ADDRESSES,
  V1_OHM_ADDRESSES,
  V1_SOHM_ADDRESSES,
  WSOHM_ADDRESSES,
} from "src/constants/addresses";
import { queryAssertion } from "src/helpers";

import { useWeb3Context } from ".";
import { useTokenContract } from "./useContract";

export const contractAllowanceQueryKey = (networkId?: NetworkId, address?: string) => [
  "useContractAllowances",
  networkId,
  address,
];

export const useContractAllowance = (tokenMap: AddressMap, contractMap: AddressMap) => {
  const { address, networkId } = useWeb3Context();
  const token = useTokenContract(tokenMap);

  return useQuery<BigNumber, Error>(
    contractAllowanceQueryKey(networkId, address),
    async () => {
      queryAssertion(address && networkId, contractAllowanceQueryKey(networkId, address));

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
