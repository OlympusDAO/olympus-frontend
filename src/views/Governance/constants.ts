import { Proposal } from "src/hooks/useProposals";

export const NULL_PROPOSAL: Proposal = {
  id: -1,
  proposalName: "",
  proposer: "",
  submissionTimestamp: "",
  isActive: false,
  endorsements: 0,
  yesVotes: 0,
  noVotes: 0,
  uri: "",
  content: "",
};
