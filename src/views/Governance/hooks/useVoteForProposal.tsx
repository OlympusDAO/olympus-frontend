import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { useSigner } from "wagmi";

export const useVoteForProposal = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();
  return useMutation(
    async ({ proposalId, vote, comment }: { proposalId: number; vote: number; comment?: string }) => {
      if (signer) {
        const contract = GOVERNANCE_CONTRACT.getEthersContract(NetworkId.MAINNET);
        const a = contract.connect(signer);
        //. 0=against, 1=for, 2=abstain
        if (comment) {
          const voteResponse = await a.castVoteWithReason(proposalId, vote, comment);
          const receipt = await voteResponse.wait();
          return receipt;
        } else {
          const voteResponse = await a.castVote(proposalId, vote);
          const receipt = await voteResponse.wait();
          return receipt;
        }
      }
      return true;
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["getProposalDetails", NetworkId.MAINNET, variables.proposalId] });
        queryClient.invalidateQueries({ queryKey: ["getReceipt", NetworkId.MAINNET, variables.proposalId] });
      },
    },
  );
};
