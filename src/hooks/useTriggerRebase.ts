import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { STAKING_CONTRACT } from "src/constants/contracts";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { ZeroDistributor__factory } from "src/typechain";
import { useSigner } from "wagmi";

export const useTriggerZeroDistributorRebase = () => {
  const network = useTestableNetworks();
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();
  return useMutation(
    async () => {
      if (!signer) {
        throw new Error("No signer found");
      }
      const stakingContract = STAKING_CONTRACT.getEthersContract(network.MAINNET);
      const distributorAddress = await stakingContract.distributor();

      const zeroDistributorContract = ZeroDistributor__factory.connect(distributorAddress, signer);

      const triggerRebase = await zeroDistributorContract.triggerRebase();

      const confirmation = await triggerRebase.wait();

      return confirmation;
    },
    {
      onError: (error: Error) => {
        toast.error(error.message);
      },
      onSuccess: async tx => {
        queryClient.invalidateQueries({ queryKey: ["checkSecondsToNextEpoch"] });
        toast(`Successfully Triggered Rebase`);
      },
    },
  );
};
