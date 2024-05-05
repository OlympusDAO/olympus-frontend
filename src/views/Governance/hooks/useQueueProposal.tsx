import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { useSigner } from "wagmi";

export const useQueueProposal = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();
  return useMutation(
    async ({ proposalId }: { proposalId: number }) => {
      if (signer) {
        const contract = GOVERNANCE_CONTRACT.getEthersContract(NetworkId.MAINNET);
        const a = contract.connect(signer);

        const queue = await a.queue(proposalId);
        return queue;
      }
      return true;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["getProposalDetails", NetworkId.MAINNET, variables.proposalId] });
      },
    },
  );
};
