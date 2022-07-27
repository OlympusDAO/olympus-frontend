import { Proposal } from "src/hooks/useProposals";

export const NULL_PROPOSAL: Proposal = {
  id: -1,
  proposalName: "",
  proposer: "",
  submissionTimestamp: 0,
  isActive: false,
  state: "closed",
  endorsements: 0,
  yesVotes: 0,
  noVotes: 0,
  uri: "",
  content: "",
};
