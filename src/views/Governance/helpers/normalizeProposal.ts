import { Proposal } from "src/views/Governance/hooks/useGetProposalFromSubgraph";

// Normalizes the proposal data to match the onchain format
export const normalizeProposal = (proposal: Proposal) => {
  return {
    createdAtBlock: new Date(Number(proposal.blockTimestamp) * 1000),
    details: {
      id: proposal.proposalId,
      proposer: proposal.proposer,
      targets: proposal.targets,
      values: proposal.values,
      signatures: proposal.signatures,
      calldatas: proposal.calldatas,
      startBlock: proposal.startBlock,
      description: proposal.description,
    },
    title: proposal.description.split(/#+\s|\n/g)[1] || `${proposal.description.slice(0, 20)}...`,
    txHash: proposal.transactionHash,
  };
};
