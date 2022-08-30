import { Proposal } from "src/hooks/useProposals";

export const NULL_PROPOSAL: Proposal = {
  id: -1,
  title: "",
  submitter: "",
  submissionTimestamp: 0,
  isActive: false,
  state: "closed",
  endorsements: 0,
  yesVotes: 0,
  noVotes: 0,
  uri: "",
  content: "",
};
