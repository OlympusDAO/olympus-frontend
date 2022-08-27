import { BigNumber } from "@ethersproject/bignumber";
import { useQuery } from "@tanstack/react-query";
import { NetworkId } from "src/constants";
import { AddressMap } from "src/constants/addresses";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";
import { useDynamicTokenContract } from "src/hooks/useContract";
import { useAccount, useNetwork } from "wagmi";

export const contractAllowanceQueryKey = (
  address?: string,
  networkId?: NetworkId,
  tokenMap?: AddressMap,
  contractMap?: AddressMap,
) => ["useContractAllowances", address, networkId, tokenMap, contractMap].filter(nonNullable);

export const useContractAllowance = (tokenMap: AddressMap, contractMap: AddressMap) => {
  const token = useDynamicTokenContract(tokenMap);
  const { address = "", isConnected } = useAccount();
  const { chain = { id: 1 } } = useNetwork();

  const key = contractAllowanceQueryKey(address, chain.id, tokenMap, contractMap);
  return useQuery<BigNumber | null, Error>(
    [key],
    async () => {
      queryAssertion(address && chain.id, key);

      // NOTE: we originally threw an error here, but it caused problems with passing in null values
      // e.g. when the token has not yet been selected
      if (!token) {
        console.warn("Token was expected to exist on current network, but didn't.");
        return null;
      }

      const contractAddress = contractMap[chain.id as NetworkId];
      if (!contractAddress) throw new Error("Contract doesn't exist on current network");

      return token.allowance(address, contractAddress);
    },
    { enabled: !!address && !!isConnected },
  );
};
