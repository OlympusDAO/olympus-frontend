import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { useSigner } from "wagmi";

export const useExecuteProposal = () => {
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();
  return useMutation(
    async ({ proposalId }: { proposalId: number }) => {
      if (signer) {
        const contract = GOVERNANCE_CONTRACT.getEthersContract(NetworkId.MAINNET);
        const a = contract.connect(signer);

        const execute = await a.execute(proposalId);
        return execute;
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
