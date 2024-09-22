import { useQuery } from "@tanstack/react-query";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { useAccount, useProvider } from "wagmi";

export const useGetReceipt = ({ proposalId }: { proposalId: number }) => {
  const { address } = useAccount();
  const provider = useProvider();
  return useQuery(
    ["getReceipt", NetworkId.MAINNET, proposalId, address],
    async () => {
      if (!provider || !address) return;
      const contract = GOVERNANCE_CONTRACT.getEthersContract(NetworkId.MAINNET);
      const a = contract.connect(provider);
      const receipt = await a.getReceipt(proposalId, address);
      return receipt;
    },
    { enabled: !!provider && !!address },
  );
};
