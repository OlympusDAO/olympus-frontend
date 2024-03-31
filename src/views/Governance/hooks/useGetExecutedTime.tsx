import { useQuery } from "@tanstack/react-query";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { ProposalExecutedEventObject } from "src/typechain/OlympusGovernorBravo";
import { useProvider } from "wagmi";

export const useGetExecutedTime = ({ proposalId, status }: { proposalId: number; status?: string }) => {
  const archiveProvider = useProvider();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(NetworkId.MAINNET);
  return useQuery(
    ["getExecutedTime", NetworkId.MAINNET, proposalId, status],
    async () => {
      if (!status || status !== "Executed") {
        return { createdAtBlockTime: undefined, details: undefined, txHash: undefined };
      }
      // using EVENTS
      const proposalExecutedEvents = await contract.queryFilter(contract.filters.ProposalExecuted(), 19520392);
      const proposal = proposalExecutedEvents.find(item => item.args.id.toNumber() === proposalId);
      const timestamp = proposal && (await archiveProvider.getBlock(proposal.blockNumber)).timestamp;
      if (proposal?.decode) {
        const details = proposal.decode(proposal.data) as ProposalExecutedEventObject;
        return { createdAtDate: timestamp && new Date(timestamp * 1000), details, txHash: proposal.transactionHash };
      }
      return { createdAtBlockTime: undefined, details: undefined, txHash: undefined };
    },
    { enabled: !!archiveProvider && !!contract && !!proposalId && !!status && status === "Executed" },
  );
};
