import { useQuery } from "@tanstack/react-query";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { NetworkId } from "src/networkDetails";
import { ProposalVetoedEventObject } from "src/typechain/OlympusGovernorBravo";

export const useGetVetoedTime = ({ proposalId, status }: { proposalId: number; status?: string }) => {
  const archiveProvider = Providers.getArchiveStaticProvider(NetworkId.MAINNET);
  const contract = GOVERNANCE_CONTRACT.getEthersContract(NetworkId.MAINNET);
  return useQuery(
    ["getVetoedTime", NetworkId.MAINNET, proposalId, status],
    async () => {
      if (!status || status !== "Vetoed") {
        return { createdAtBlockTime: undefined, details: undefined, txHash: undefined };
      }
      // using EVENTS
      const proposalExecutedEvents = await contract.queryFilter(
        contract.filters.ProposalVetoed(),
        Environment.getGovernanceStartBlock(),
      );
      const proposal = proposalExecutedEvents.find(item => item.args.id.toNumber() === proposalId);
      const timestamp = proposal && (await archiveProvider.getBlock(proposal.blockNumber)).timestamp;
      if (proposal?.decode) {
        const details = proposal.decode(proposal.data) as ProposalVetoedEventObject;
        return { createdAtDate: timestamp && new Date(timestamp * 1000), details, txHash: proposal.transactionHash };
      }
      return { createdAtBlockTime: undefined, details: undefined, txHash: undefined };
    },
    { enabled: !!archiveProvider && !!contract && !!proposalId && !!status && status === "Vetoed" },
  );
};
