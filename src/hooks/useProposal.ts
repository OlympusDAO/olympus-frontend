import { ethers } from "ethers";
import { useQuery } from "react-query";
import { nonNullable } from "src/helpers/types/nonNullable";

/// Import Proposal data type and mock data getters from useProposals
import {
  MockGetNoVotesForProposal,
  mockGetProposalContent,
  MockGetProposalHasBeenActivated,
  MockGetProposalMetadata,
  mockGetProposalState,
  MockGetProposalTotalEndorsements,
  mockGetProposalURI,
  MockGetYesVotesForProposal,
  Proposal,
} from "./useProposals";

/**
 * @notice Query key for useProposal which is dependent on instructionsIndex
 * @param instructionsIndex The index number of the proposal to fetch
 */
const proposalQueryKey = (instructionsIndex: number) => ["useProposal", instructionsIndex].filter(nonNullable);

/**
 * @notice  Fetches the metadata, related endorsements, yes votes, and no votes for the proposal
 *          at the passed index. Uses the proposal metadata to fetch the IPFS URIs containing the
 *          proposal content. Puts it into a big Proposal object.
 * @param instructionsIndex The index number of the proposal to fetch
 * @returns Query object in which the data attribute holds a Proposal object for the proposal at
 *          relevant index
 */
export const useProposal = (instructionsIndex: number) => {
  /// const IPFSDContract = "";
  /// const governanceContract = "";

  const query = useQuery<Proposal, Error>(
    proposalQueryKey(instructionsIndex),
    async () => {
      /// For the specified proposal index, fetch the relevant data points used in the frontend
      const proposal = MockGetProposalMetadata(instructionsIndex);
      const isActive = MockGetProposalHasBeenActivated(instructionsIndex);
      const endorsements = MockGetProposalTotalEndorsements(instructionsIndex);
      const yesVotes = MockGetYesVotesForProposal(instructionsIndex);
      const noVotes = MockGetNoVotesForProposal(instructionsIndex);
      const proposalURI = mockGetProposalURI(proposal.proposalName);
      const proposalContent = mockGetProposalContent(proposalURI);
      const proposalState = mockGetProposalState(proposal.proposalName);

      const currentProposal = {
        id: instructionsIndex,
        proposalName: ethers.utils.parseBytes32String(proposal.proposalName),
        proposer: proposal.proposer,
        submissionTimestamp: proposal.submissionTimestamp,
        isActive: isActive,
        state: proposalState,
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
