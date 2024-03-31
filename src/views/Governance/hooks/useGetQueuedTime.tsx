import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { ProposalQueuedEventObject } from "src/typechain/OlympusGovernorBravo";
import { useProvider, useQuery } from "wagmi";

export const useGetQueuedTime = ({ proposalId }: { proposalId: number }) => {
  const archiveProvider = useProvider();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(NetworkId.MAINNET);
  return useQuery(
    ["getQueuedTime", NetworkId.MAINNET, proposalId],
    async () => {
      // using EVENTS
      const proposalQueuedEvents = await contract.queryFilter(contract.filters.ProposalQueued(), 19520392);
      const proposal = proposalQueuedEvents.find(item => item.args.id.toNumber() === proposalId);
      const timestamp = proposal && (await archiveProvider.getBlock(proposal.blockNumber)).timestamp;
      if (proposal?.decode) {
        const details = proposal.decode(proposal.data) as ProposalQueuedEventObject;
        return { createdAtDate: timestamp && new Date(timestamp * 1000), details, txHash: proposal.transactionHash };
      }
      return { createdAtBlockTime: undefined, details: undefined, txHash: undefined };
    },
    { enabled: !!archiveProvider && !!contract && !!proposalId },
  );
};
