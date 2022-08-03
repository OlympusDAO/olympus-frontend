import { ethers } from "ethers";
import { useQuery } from "react-query";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { parseBigNumber } from "src/helpers";
import { createDependentQuery } from "src/helpers/react-query/createDependentQuery";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";
import { useNetwork } from "wagmi";

/// Import Proposal data type and mock data getters from useProposals
import { mockGetProposalContent, mockGetProposalState, mockGetProposalURI, Proposal } from "./useProposals";

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
 *  * TODO: This needs to be refactored to use dependent queries. We cannot nest useQuery calls as mocked here.
 */
export const useProposal = (instructionsIndex: number) => {
  /// const IPFSDContract = "";
  /// const governanceContract = "";
  const { chain = { id: 1 } } = useNetwork();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);
  const queryKey = proposalQueryKey(instructionsIndex);
  const useDependentQuery = createDependentQuery(queryKey);
  // dependent queries, may be more clear as Promises
  const metadata = useDependentQuery("GetProposalMetadata", () => contract.getProposalMetadata(instructionsIndex));
  const isActive = useDependentQuery("ProposalHasBeenActivated", () =>
    contract.proposalHasBeenActivated(instructionsIndex),
  );
  const endorsements = useDependentQuery("TotalEndorsementsForProposal", () =>
    contract.totalEndorsementsForProposal(instructionsIndex),
  );
  const yesVotes = useDependentQuery("YesVotesForProposal", () => contract.yesVotesForProposal(instructionsIndex));
  const noVotes = useDependentQuery("NoVotesForProposal", () => contract.noVotesForProposal(instructionsIndex));

  const query = useQuery<Proposal, Error>(
    queryKey,
    async () => {
      queryAssertion(metadata && isActive !== undefined && endorsements && yesVotes && noVotes, queryKey);
      /// For the specified proposal index, fetch the relevant data points used in the frontend
      // TODO(appleseed): handle these three
      const proposalURI = mockGetProposalURI("0x4f49502d31000000000000000000000000000000000000000000000000000000");
      const proposalContent = mockGetProposalContent("ipfs://proposalnumberone");
      const proposalState = mockGetProposalState("0x4f49502d31000000000000000000000000000000000000000000000000000000");

      const currentProposal = {
        id: instructionsIndex,
        proposalName: ethers.utils.parseBytes32String(metadata.proposalName),
        proposer: metadata.proposer,
        submissionTimestamp: parseBigNumber(metadata.submissionTimestamp, 0),
        isActive: isActive,
        state: proposalState,
        endorsements: parseBigNumber(endorsements, 0),
        yesVotes: parseBigNumber(yesVotes, 0),
        noVotes: parseBigNumber(noVotes, 0),
        uri: proposalURI,
        content: proposalContent,
      };

      return currentProposal;
    },
    {
      enabled: !!metadata && isActive !== undefined && !!endorsements && !!yesVotes && !!noVotes,
    },
  );

  return query as typeof query;
};
