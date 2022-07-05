import { ethers } from "ethers";
import { useQuery } from "react-query";
import { nonNullable } from "src/helpers/types/nonNullable";

/// Data type for return from getProposalMetadata on Governance.sol
interface proposalMetadata {
  proposalName: string;
  proposer: string;
  submissionTimestamp: string;
}

/// Data type for returning full proposal informations
export interface Proposal {
  proposalName: string;
  proposer: string;
  submissionTimestamp: string;
  isActive: boolean;
  endorsements: number;
  yesVotes: number;
  noVotes: number;
  uri: string;
  content: string;
}

/// Mock totalInstructions value from INSTR.sol
export const mockTotalInstructions = 3;

/// Mock instructions ID for current active proposal
export const activeProposal = 3;

/// Mock mapping data for proposalMetadata in Governance.sol
export const mockProposalMetadata: { [key: number]: proposalMetadata } = {
  0: {
    proposalName: "0x4f49502d31000000000000000000000000000000000000000000000000000000",
    proposer: "0x6e36b2f9f2BcC273f090ff049952Fa4B5Cc67567",
    submissionTimestamp: "1653948322",
  },
  1: {
    proposalName: "0x4f49502d32000000000000000000000000000000000000000000000000000000",
    proposer: "0x0adfA199aB9485CE53859CD237836bFE6019F5Fa",
    submissionTimestamp: "1655157922",
  },
  2: {
    proposalName: "0x4f49502d33000000000000000000000000000000000000000000000000000000",
    proposer: "0x6e36b2f9f2BcC273f090ff049952Fa4B5Cc67567",
    submissionTimestamp: "1655503522",
  },
  3: {
    proposalName: "0x4f49502d34000000000000000000000000000000000000000000000000000000",
    proposer: "0x0adfA199aB9485CE53859CD237836bFE6019F5Fa",
    submissionTimestamp: "1656626722",
  },
};

/// Mock mapping data on total endorsements in Governance.sol
export const mockProposalTotalEndorsements: { [key: number]: number } = {
  0: 1000,
  1: 50,
  2: 275,
  3: 432,
};

/// Mock mapping data on proposal activation in Governance.sol
export const mockProposalHasBeenActivated: { [key: number]: boolean } = {
  0: true,
  1: false,
  2: true,
  3: true,
};

/// Mock mapping data on proposal yes votes in Governance.sol
export const mockYesVotesForProposal: { [key: number]: number } = {
  0: 1234,
  1: 0,
  2: 1546,
  3: 2583,
};

/// Mock mapping data on proposal no votes in Governance.sol
export const mockNoVotesForProposal: { [key: number]: number } = {
  0: 152,
  1: 0,
  2: 2436,
  3: 1875,
};

/// Mock IPFS URI values by proposal bytes32 name
export const mockProposalURIs: { [key: string]: string } = {
  "0x4f49502d31000000000000000000000000000000000000000000000000000000": "ipfs://proposalnumberone",
  "0x4f49502d32000000000000000000000000000000000000000000000000000000": "ipfs://proposalnumbertwo",
  "0x4f49502d33000000000000000000000000000000000000000000000000000000": "ipfs://proposalnumberthree",
  "0x4f49502d34000000000000000000000000000000000000000000000000000000": "ipfs://proposalnumberfour",
};

/// Mock content stores by IPFS URI
export const mockProposalContent: { [key: string]: string } = {
  "ipfs://proposalnumberone": "This is OIP-1. The first mock proposal",
  "ipfs://proposalnumbertwo": "This is OIP-2. The second mock proposal",
  "ipfs://proposalnumberthree": "This is OIP-3. The third mock proposal",
  "ipfs://proposalnumberfour": "This is OIP-4. The fourth mock proposal",
};

/// Function to return mock total instructions in lieu of a contract
export const mockGetTotalInstructions = (): number => {
  return mockTotalInstructions;
};

/// Function to return mock proposal metadata in lieu of a contract
export const mockGetProposalMetadata = (instructionIndex: number) => {
  return mockProposalMetadata[instructionIndex];
};

/// Function to return mock proposal endoresments in lieu of a contract
export const mockGetProposalTotalEndorsements = (instructionsIndex: number): number => {
  return mockProposalTotalEndorsements[instructionsIndex];
};

/// Function to return mock proposal activation data in lieu of a contract
export const mockGetProposalHasBeenActivated = (instructionsIndex: number): boolean => {
  return mockProposalHasBeenActivated[instructionsIndex];
};

/// Function to return mock proposal yes votes in lieu of a contract
export const mockGetYesVotesForProposal = (instructionsIndex: number): number => {
  return mockYesVotesForProposal[instructionsIndex];
};

/// Function to return mock proposal no votes in lieu of a contract
export const mockGetNoVotesForProposal = (instructionsIndex: number): number => {
  return mockNoVotesForProposal[instructionsIndex];
};

/// Function to return mock proposal URI in lieu of a contract
export const mockGetProposalURI = (proposalName: string): string => {
  return mockProposalURIs[proposalName];
};

/// Function to return mock proposal content in lieu of content deployed to IPFS
export const mockGetProposalContent = (uri: string): string => {
  return mockProposalContent[uri];
};

/**
 * Query key for useProposals. Doesn't need to be refreshed on address or network changes
 * Proposals should be fetched no matter what.
 */
export const proposalsQueryKey = () => ["useProposals"].filter(nonNullable);

/**
 * @notice  Fetches proposals from Governance policy, the related endorsements, yes votes,
 *          and no votes. Uses the proposal metadata to fetch the IPFS URIs containing the
 *          proposal content. Puts it into a big Proposal object.
 * @returns Query object in which the data attribute holds an array of Proposal objects for
 *          all proposals in the Governance policy contract
 */
export const useProposals = () => {
  /// const INSTRContract = "";
  /// const IPFSDContract = "";
  /// const governanceContract = "";

  const query = useQuery<Proposal[], Error>(
    proposalsQueryKey(),
    async () => {
      /// Get total number of proposal through INSTR module contract's totalInstructions variable
      const numberOfProposals = mockGetTotalInstructions();
      const allProposals: Proposal[] = [];

      /// For each proposal, fetch the relevant data points used in the frontend
      for (let i = 0; i < numberOfProposals; i++) {
        const proposal = mockGetProposalMetadata(i);
        const isActive = mockGetProposalHasBeenActivated(i);
        const endorsements = mockGetProposalTotalEndorsements(i);
        const yesVotes = mockGetYesVotesForProposal(i);
        const noVotes = mockGetNoVotesForProposal(i);
        const proposalURI = mockGetProposalURI(proposal.proposalName);
        const proposalContent = mockGetProposalContent(proposalURI);

        const currentProposal = {
          proposalName: ethers.utils.parseBytes32String(proposal.proposalName),
          proposer: proposal.proposer,
          submissionTimestamp: proposal.submissionTimestamp,
          isActive: isActive,
          endorsements: endorsements,
          yesVotes: yesVotes,
          noVotes: noVotes,
          uri: proposalURI,
          content: proposalContent,
        };

        allProposals.push(currentProposal);
      }

      return allProposals;
    },
    { enabled: true },
  );

  return query as typeof query;
};
