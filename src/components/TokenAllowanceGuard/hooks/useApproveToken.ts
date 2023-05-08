import { MaxUint256 } from "@ethersproject/constants";
import { ContractReceipt } from "@ethersproject/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AddressMap } from "src/constants/addresses";
import { useDynamicTokenContract } from "src/hooks/useContract";
import { contractAllowanceQueryKey } from "src/hooks/useContractAllowance";
import { EthersError } from "src/lib/EthersTypes";
import { useAccount, useNetwork } from "wagmi";

export const useApproveToken = (tokenAddressMap: AddressMap) => {
  const client = useQueryClient();

  const { address = "" } = useAccount();
  const { chain = { id: 1 } } = useNetwork();
  const token = useDynamicTokenContract(tokenAddressMap, true);

  return useMutation<ContractReceipt, EthersError, { spenderAddressMap: AddressMap }>(
    async ({ spenderAddressMap }) => {
      const contractAddress = spenderAddressMap[chain.id as keyof typeof spenderAddressMap];

      if (!token) throw new Error("Token doesn't exist on current network. Please switch networks.");
      if (!contractAddress) throw new Error("Contract doesn't exist on current network. Please switch networks.");

      const transaction = await token.approve(contractAddress, MaxUint256);

      return transaction.wait();
    },
    {
      onError: error => toast.error("error" in error ? error.error.message : error.message),
      onSuccess: async (data, variables) => {
        toast.success("Successfully approved");
        await client.refetchQueries([
          contractAllowanceQueryKey(address, chain.id, tokenAddressMap, variables.spenderAddressMap),
        ]);
      },
    },
  );
};
