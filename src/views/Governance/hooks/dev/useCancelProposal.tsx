import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { useMutation, useSigner } from "wagmi";

export const useCancelProposal = () => {
  const { data: signer } = useSigner();
  return useMutation(async ({ proposalId }: { proposalId: string }) => {
    if (signer) {
      const contract = GOVERNANCE_CONTRACT.getEthersContract(NetworkId.MAINNET);
      const a = contract.connect(signer);
      const response = await a.cancel(proposalId);
      const tx = await response.wait();
      return tx;
    }
  });
};
