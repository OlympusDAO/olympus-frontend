import { useQuery } from "react-query";
import { nonNullable } from "src/helpers/types/nonNullable";

interface proposalMetadata {
  proposalName: string;
  proposer: string;
  submissionTimestamp: string;
}

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

export const mockTotalInstructions = 3;
export const activeProposal = 3;

export const mockProposalMetadata: { [key: number]: proposalMetadata } = {
  0: {
    proposalName: "0x4f49502d310000000000000000000000000000000000000000000000000000",
    proposer: "0x6e36b2f9f2BcC273f090ff049952Fa4B5Cc67567",
    submissionTimestamp: "1653948322",
  },
  1: {
    proposalName: "0x4f49502d320000000000000000000000000000000000000000000000000000",
    proposer: "0x0adfA199aB9485CE53859CD237836bFE6019F5Fa",
    submissionTimestamp: "1655157922",
  },
  2: {
    proposalName: "0x4f49502d330000000000000000000000000000000000000000000000000000",
    proposer: "0x6e36b2f9f2BcC273f090ff049952Fa4B5Cc67567",
    submissionTimestamp: "1655503522",
  },
  3: {
    proposalName: "0x4f49502d340000000000000000000000000000000000000000000000000000",
    proposer: "0x0adfA199aB9485CE53859CD237836bFE6019F5Fa",
    submissionTimestamp: "1656626722",
  },
};

export const mockProposalTotalEndorsements: { [key: number]: number } = {
  0: 1000,
  1: 50,
  2: 275,
  3: 432,
};

export const mockProposalHasBeenActivated: { [key: number]: boolean } = {
  0: true,
  1: false,
  2: true,
  3: true,
};

export const mockYesVotesForProposal: { [key: number]: number } = {
  0: 1234,
  1: 0,
  2: 1546,
  3: 2583,
};

export const mockNoVotesForProposal: { [key: number]: number } = {
  0: 152,
  1: 0,
  2: 2436,
  3: 1875,
};

export const mockProposalURIs: { [key: string]: string } = {
  "0x4f49502d310000000000000000000000000000000000000000000000000000": "ipfs://proposalnumberone",
  "0x4f49502d320000000000000000000000000000000000000000000000000000": "ipfs://proposalnumbertwo",
  "0x4f49502d330000000000000000000000000000000000000000000000000000": "ipfs://proposalnumberthree",
  "0x4f49502d340000000000000000000000000000000000000000000000000000": "ipfs://proposalnumberfour",
};

export const mockProposalContent: { [key: string]: string } = {
  "ipfs://proposalnumberone": "This is OIP-1. The first mock proposal",
  "ipfs://proposalnumbertwo": "This is OIP-2. The second mock proposal",
  "ipfs://proposalnumberthree": "This is OIP-3. The third mock proposal",
  "ipfs://proposalnumberfour": "This is OIP-4. The fourth mock proposal",
};

export const mockGetTotalInstructions = (): number => {
  return mockTotalInstructions;
};

export const mockGetProposalMetadata = (instructionIndex: number) => {
  return mockProposalMetadata[instructionIndex];
};

export const mockGetProposalTotalEndorsements = (instructionsIndex: number): number => {
  return mockProposalTotalEndorsements[instructionsIndex];
};

export const mockGetProposalHasBeenActivated = (instructionsIndex: number): boolean => {
  return mockProposalHasBeenActivated[instructionsIndex];
};

export const mockGetYesVotesForProposal = (instructionsIndex: number): number => {
  return mockYesVotesForProposal[instructionsIndex];
};

export const mockGetNoVotesForProposal = (instructionsIndex: number): number => {
  return mockNoVotesForProposal[instructionsIndex];
};

export const mockGetProposalURI = (proposalName: string): string => {
  return mockProposalURIs[proposalName];
};

export const mockGetProposalContent = (uri: string): string => {
  return mockProposalContent[uri];
};

export const proposalsQueryKey = () => ["useProposals"].filter(nonNullable);

export const useProposals = () => {
  /// const INSTRContract = "";
  /// const IPFSDContract = "";
  /// const governanceContract = "";

  const query = useQuery<Proposal[], Error>(
    proposalsQueryKey(),
    async () => {
      const totalInstructions = mockGetTotalInstructions();
      const allProposals: Proposal[] = [];

      for (let i = 0; i < totalInstructions; i++) {
        const proposal = mockGetProposalMetadata(i);
        const isActive = mockGetProposalHasBeenActivated(i);
        const endorsements = mockGetProposalTotalEndorsements(i);
        const yesVotes = mockGetYesVotesForProposal(i);
        const noVotes = mockGetNoVotesForProposal(i);
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

        allProposals.push(currentProposal);
      }

      return allProposals;
    },
    { enabled: true },
  );

  return query as typeof query;
};
