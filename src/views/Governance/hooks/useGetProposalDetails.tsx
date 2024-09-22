import { useQuery } from "@tanstack/react-query";
import { formatEther } from "ethers/lib/utils";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { NetworkId } from "src/networkDetails";
import { getDateFromBlock } from "src/views/Governance/helpers";
import { useProvider } from "wagmi";

export const useGetProposalDetails = ({ proposalId }: { proposalId: number }) => {
  const archiveProvider = useProvider();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(NetworkId.MAINNET);
  return useQuery(["getProposalDetails", NetworkId.MAINNET, proposalId], {
    queryFn: async () => {
      const state = await contract.state(Number(proposalId));
      const proposalDetails = await contract.proposals(proposalId);
      const blockTime = await archiveProvider.getBlock("latest");
      const endDateBlockTimestamp = await archiveProvider.getBlock(Number(proposalDetails.endBlock));
      const startDateBlockTimestamp = await archiveProvider.getBlock(Number(proposalDetails.startBlock));
      const startDate = getDateFromBlock(Number(proposalDetails.startBlock), blockTime.number, 15, blockTime.timestamp);
      const endDate = getDateFromBlock(Number(proposalDetails.endBlock), blockTime.number, 15, blockTime.timestamp);

      return {
        id: proposalDetails.id.toNumber(),
        proposer: proposalDetails.proposer,
        status: proposalStates[state],
        forCount: Number(formatEther(proposalDetails.forVotes)),
        againstCount: Number(formatEther(proposalDetails.againstVotes)),
        abstainCount: Number(formatEther(proposalDetails.abstainVotes)),
        startBlock: proposalDetails.startBlock.toNumber(),
        endBlock: proposalDetails.endBlock.toNumber(),
        eta: proposalDetails.eta.toNumber(),
        etaDate: new Date(Number(proposalDetails?.eta) * 1000),
        quorumVotes: Number(formatEther(proposalDetails.quorumVotes)),
        proposalThreshold: Number(formatEther(proposalDetails.proposalThreshold)),
        startDate: startDateBlockTimestamp?.timestamp ? new Date(startDateBlockTimestamp.timestamp * 1000) : startDate,
        endDate: endDateBlockTimestamp?.timestamp ? new Date(endDateBlockTimestamp.timestamp * 1000) : endDate,
      };
    },
    enabled: !!archiveProvider && !!contract && !!proposalId,
  });
};

export const proposalStates = [
  "Pending",
  "Active",
  "Canceled",
  "Defeated",
  "Succeeded",
  "Queued",
  "Expired",
  "Executed",
  "Vetoed",
  "Emergency",
];
