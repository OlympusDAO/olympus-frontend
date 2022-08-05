import { MaxUint256 } from "@ethersproject/constants";
import { ContractReceipt } from "@ethersproject/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { AddressMap } from "src/constants/addresses";
import { useDynamicTokenContract } from "src/hooks/useContract";
import { contractAllowanceQueryKey } from "src/hooks/useContractAllowance";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";
import { useAccount, useNetwork } from "wagmi";

export const useApproveToken = (tokenAddressMap: AddressMap, spenderAddressMap: AddressMap) => {
  const dispatch = useDispatch();
  const client = useQueryClient();

  const { address = "" } = useAccount();
  const { chain = { id: 1 } } = useNetwork();
  const token = useDynamicTokenContract(tokenAddressMap, true);

  return useMutation<ContractReceipt, Error>(
    async () => {
      const contractAddress = spenderAddressMap[chain.id as keyof typeof spenderAddressMap];

      if (!token) throw new Error("Token doesn't exist on current network. Please switch networks.");
      if (!contractAddress) throw new Error("Contract doesn't exist on current network. Please switch networks.");

      const transaction = await token.approve(contractAddress, MaxUint256);

      return transaction.wait();
    },
    {
      onError: error => void dispatch(createErrorToast(error.message)),
      onSuccess: async () => {
        dispatch(createInfoToast("Successfully approved"));
        await client.refetchQueries([contractAllowanceQueryKey(address, chain.id, tokenAddressMap, spenderAddressMap)]);
      },
    },
  );
};
