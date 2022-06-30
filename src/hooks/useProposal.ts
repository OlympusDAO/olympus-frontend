import { useQuery } from "react-query";
import { nonNullable } from "src/helpers/types/nonNullable";

import {
  mockGetNoVotesForProposal,
  mockGetProposalContent,
  mockGetProposalHasBeenActivated,
  mockGetProposalMetadata,
  mockGetProposalTotalEndorsements,
  mockGetProposalURI,
  mockGetYesVotesForProposal,
  Proposal,
} from "./useProposals";

const proposalQueryKey = (instructionsIndex: number) => ["useProposal", instructionsIndex].filter(nonNullable);

export const useProposal = (instructionsIndex: number) => {
  /// const IPFSDContract = "";
  /// const governanceContract = "";

  const query = useQuery<Proposal, Error>(
    proposalQueryKey(instructionsIndex),
    async () => {
      const proposal = mockGetProposalMetadata(instructionsIndex);
      const isActive = mockGetProposalHasBeenActivated(instructionsIndex);
      const endorsements = mockGetProposalTotalEndorsements(instructionsIndex);
      const yesVotes = mockGetYesVotesForProposal(instructionsIndex);
      const noVotes = mockGetNoVotesForProposal(instructionsIndex);
      const proposalURI = mockGetProposalURI(proposal.proposalName);
      const proposalContent = mockGetProposalContent(proposalURI);

      const currentProposal = {
        proposalName: proposal.proposalName,
        proposer: proposal.proposer,
        submissionTimestamp: proposal.submissionTimestamp,
        isActive: isActive,
        endorsements: endorsements,
        yesVotes: yesVotes,
        noVotes: noVotes,
        uri: proposalURI,
        content: proposalContent,
      };

      return currentProposal;
    },
    { enabled: true },
  );

  return query as typeof query;
};
