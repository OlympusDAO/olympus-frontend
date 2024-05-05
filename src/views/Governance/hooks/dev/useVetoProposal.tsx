import { useMutation } from "@tanstack/react-query";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { useSigner } from "wagmi";

export const useVetoProposal = () => {
  const { data: signer } = useSigner();
  return useMutation(async ({ proposalId }: { proposalId: string }) => {
    if (signer) {
      const contract = GOVERNANCE_CONTRACT.getEthersContract(NetworkId.MAINNET);
      const a = contract.connect(signer);
      const response = await a.veto(proposalId);
      const tx = await response.wait();
      return tx;
    }
  });
};
