import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Cooler__factory } from "src/typechain";
import { useSigner } from "wagmi";

export const useDelegateVoting = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ coolerAddress, delegationAddress }: { coolerAddress: string; delegationAddress: string }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const coolerContract = Cooler__factory.connect(coolerAddress, signer);
      const receipt = await coolerContract.delegateVoting(delegationAddress);
      const response = receipt.wait();
      return response;
    },
    {
      onError: (error: Error) => {
        toast.error(error.message);
      },
      onSuccess: async tx => {
        queryClient.invalidateQueries({ queryKey: ["checkDelegation"] });
        toast(`Successfully Delegated Voting`);
      },
    },
  );
};
