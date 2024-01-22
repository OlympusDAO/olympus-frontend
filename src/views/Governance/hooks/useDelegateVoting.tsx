import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { GOHM_ADDRESSES } from "src/constants/addresses";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { Cooler__factory, GOHM__factory } from "src/typechain";
import { useSigner } from "wagmi";

export const useDelegateVoting = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();
  const networks = useTestableNetworks();

  return useMutation(
    async ({ address, delegationAddress }: { address: string; delegationAddress: string }) => {
      if (!signer) throw new Error(`Please connect a wallet`);
      const isGohm = address === GOHM_ADDRESSES[networks.MAINNET];

      if (!isGohm) {
        const coolerContract = Cooler__factory.connect(address, signer);
        const receipt = await coolerContract.delegateVoting(delegationAddress);
        const response = receipt.wait();
        return response;
      } else {
        const gohmContract = GOHM__factory.connect(address, signer);
        const receipt = await gohmContract.delegate(delegationAddress);
        const response = receipt.wait();
        return response;
      }
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
