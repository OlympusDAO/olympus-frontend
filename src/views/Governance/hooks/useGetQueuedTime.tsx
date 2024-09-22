import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { NetworkId } from "src/networkDetails";
import { ProposalQueuedEventObject } from "src/typechain/OlympusGovernorBravo";
import { useQuery } from "wagmi";

export const useGetQueuedTime = ({ proposalId }: { proposalId: number }) => {
  const archiveProvider = Providers.getArchiveStaticProvider(NetworkId.MAINNET);
  const contract = GOVERNANCE_CONTRACT.getEthersContract(NetworkId.MAINNET);
  return useQuery(
    ["getQueuedTime", NetworkId.MAINNET, proposalId],
    async () => {
      // using EVENTS
      const proposalQueuedEvents = await contract.queryFilter(
        contract.filters.ProposalQueued(),
        Environment.getGovernanceStartBlock(),
      );
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
