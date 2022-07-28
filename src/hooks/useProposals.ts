import { ethers } from "ethers";
import { useQuery } from "react-query";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { nonNullable } from "src/helpers/types/nonNullable";
import { useNetwork } from "wagmi";

/// Data type for return from getProposalMetadata on Governance.sol
interface proposalMetadata {
  proposalName: string;
  proposer: string;
  submissionTimestamp: number;
}

/// Data type for returning full proposal informations
export interface Proposal {
  id: number;
  proposalName: string;
  proposer: string;
  submissionTimestamp: number;
  isActive: boolean;
  state: PStatus;
  endorsements: number;
  yesVotes: number;
  noVotes: number;
  uri: string;
  content: string;
}

/**
 * the proposals current state
 * - currenly only Active & Endorsements status are stored on chain
 * - all other states would be stored off-chain, either from the forum
 * - TODO(appleseed): how does a proposal get to "closed" state?
 */
export type PStatus = "active" | "endorsement" | "discussion" | "draft" | "closed";
export interface IProposalState {
  state: PStatus;
}
/// Mock totalInstructions value from INSTR.sol
export const mockTotalInstructions = 3;

/// Mock instructions ID for current active proposal
export const activeProposal = 0;

/// Mock mapping data for proposalMetadata in Governance.sol
export const mockProposalMetadata: { [key: number]: proposalMetadata } = {
  0: {
    proposalName: "0x4f49502d31000000000000000000000000000000000000000000000000000000",
    proposer: "0x6e36b2f9f2BcC273f090ff049952Fa4B5Cc67567",
    submissionTimestamp: 1653948322,
  },
  1: {
    proposalName: "0x4f49502d32000000000000000000000000000000000000000000000000000000",
    proposer: "0x0adfA199aB9485CE53859CD237836bFE6019F5Fa",
    submissionTimestamp: 1655157922,
  },
  2: {
    proposalName: "0x4f49502d33000000000000000000000000000000000000000000000000000000",
    proposer: "0x6e36b2f9f2BcC273f090ff049952Fa4B5Cc67567",
    submissionTimestamp: 1655503522,
  },
  3: {
    proposalName: "0x4f49502d34000000000000000000000000000000000000000000000000000000",
    proposer: "0x0adfA199aB9485CE53859CD237836bFE6019F5Fa",
    submissionTimestamp: 1656626722,
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
  1: true,
  2: false,
  3: false,
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

/// Mock content stored at IPFS URI
export const mockProposalContent: { [key: string]: string } = {
  "ipfs://proposalnumberone": "This is OIP-1. The first mock proposal",
  "ipfs://proposalnumbertwo": "This is OIP-2. The second mock proposal",
  "ipfs://proposalnumberthree": "This is OIP-3. The third mock proposal",
  "ipfs://proposalnumberfour": "This is OIP-4. The fourth mock proposal",
};

/// Mock proposal state (don't know if this will be stored at IPFS URI or in-contract)
export const mockProposalState: { [key: string]: PStatus } = {
  "0x4f49502d31000000000000000000000000000000000000000000000000000000": "active",
  "0x4f49502d32000000000000000000000000000000000000000000000000000000": "discussion",
  "0x4f49502d33000000000000000000000000000000000000000000000000000000": "closed",
  "0x4f49502d34000000000000000000000000000000000000000000000000000000": "draft",
};

//TODO: Not implemented in Contract. Follow up with SC Team
export const mockGetTotalInstructions = (): number => {
  return mockTotalInstructions;
};

/// Function to return mock proposal metadata in lieu of a contract
export const MockGetProposalMetadata = (instructionsIndex: number) => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);
  const { data, isFetched, isLoading } = useQuery(["GetProposalMetadata", instructionsIndex], async () => {
    return await contract.getProposalMetadata(instructionsIndex);
  });
  //TODO: Swap Return statement to return contract results
  return mockProposalMetadata[instructionsIndex];
  //return { data, isFetched, isLoading };
};

/// Function to return mock proposal endoresments in lieu of a contract
export const MockGetProposalTotalEndorsements = (instructionsIndex: number) => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);
  const { data, isFetched, isLoading } = useQuery(["GetProposalTotalEndorsements", instructionsIndex], async () => {
    return await contract.totalEndorsementsForProposal(instructionsIndex);
  });

  //TODO: Swap Return statement to return contract results
  return mockProposalTotalEndorsements[instructionsIndex];
  //return { data, isFetched, isLoading };
};

/// Function to return mock proposal activation data in lieu of a contract
export const MockGetProposalHasBeenActivated = (instructionsIndex: number) => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);
  const { data, isFetched, isLoading } = useQuery(["ProposalHasBeenActivated", instructionsIndex], async () => {
    return await contract.proposalHasBeenActivated(instructionsIndex);
  });

  //TODO: Swap Return statement to return contract results
  return mockProposalHasBeenActivated[instructionsIndex];
  //return { data, isFetched, isLoading };
};

/// Function to return mock proposal yes votes in lieu of a contract
export const MockGetYesVotesForProposal = (instructionsIndex: number) => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);
  const { data, isFetched, isLoading } = useQuery(["YesVotesForProposal", instructionsIndex], async () => {
    return await contract.yesVotesForProposal(instructionsIndex);
  });

  //TODO: Swap Return statement to return contract results
  return mockYesVotesForProposal[instructionsIndex];
  //return { data, isFetched, isLoading };
};

/// Function to return mock proposal no votes in lieu of a contract
export const MockGetNoVotesForProposal = (instructionsIndex: number) => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);
  const { data, isFetched, isLoading } = useQuery(["NoVotesForProposal", instructionsIndex], async () => {
    return await contract.noVotesForProposal(instructionsIndex);
  });
  //TODO: Swap Return statement to return contract results
  return mockNoVotesForProposal[instructionsIndex];
  //return { data, isFetched, isLoading };
};

//TODO: Not implemented in Contract. Follow up with SC Team
/// Function to return mock proposal URI in lieu of a contract
export const mockGetProposalURI = (proposalName: string): string => {
  return mockProposalURIs[proposalName];
};

//TODO: Not implemented in Contract. Follow up with SC Team
/// Function to return mock proposal content in lieu of content deployed to IPFS
export const mockGetProposalContent = (uri: string): string => {
  return mockProposalContent[uri];
};

/// Function to return mock proposal state in lieu of contract/content deployed to IPFS
export const mockGetProposalState = (proposalName: string): PStatus => {
  return mockProposalState[proposalName];
};

/**
 * Query key for useProposals. Doesn't need to be refreshed on address or network changes
 * Proposals should be fetched no matter what.
 */
export const proposalsQueryKey = (filters: IProposalState) => {
  if (filters) {
    return ["useProposals", filters].filter(nonNullable);
  } else {
    return ["useProposals"].filter(nonNullable);
  }
};

export const filterStatement = ({ proposal, filters }: { proposal: Proposal; filters: IProposalState }) => {
  let result = proposal.isActive;
  if (filters) {
    switch (filters.state) {
      case "active":
        result = proposal.isActive;
        break;
      case "endorsement":
        result = proposal.isActive === false;
        break;
      case "discussion":
      case "draft":
      case "closed":
        break;
      default:
        console.log(`Sorry, we are out of somethings wrong.`);
    }
  }
  return result;
};

/**
 * @notice  Fetches proposals from Governance policy, the related endorsements, yes votes,
 *          and no votes. Uses the proposal metadata to fetch the IPFS URIs containing the
 *          proposal content. Puts it into a big Proposal object.
 * @returns Query object in which the data attribute holds an array of Proposal objects for
 *          all proposals in the Governance policy contract
 */
export const useProposals = (filters: IProposalState) => {
  /// const INSTRContract = "";
  /// const IPFSDContract = "";
  /// const governanceContract = "";

  const query = useQuery<Proposal[], Error>(
    proposalsQueryKey(filters),
    async () => {
      /// Get total number of proposal through INSTR module contract's totalInstructions variable
      const numberOfProposals = mockGetTotalInstructions();
      const allProposals: Proposal[] = [];

      /// For each proposal, fetch the relevant data points used in the frontend
      for (let i = 0; i <= numberOfProposals; i++) {
        const proposal = MockGetProposalMetadata(i);
        const isActive = MockGetProposalHasBeenActivated(i);
        const endorsements = MockGetProposalTotalEndorsements(i);
        const yesVotes = MockGetYesVotesForProposal(i);
        const noVotes = MockGetNoVotesForProposal(i);
        const proposalURI = mockGetProposalURI(proposal.proposalName);
        const proposalContent = mockGetProposalContent(proposalURI);
        /**
         * should become parsing logic to determine a proposal's state
         * - TODO(appleseed): still need to determine methodolgy for "discussion", "draft" and "closed" states
         * @returns {PStatus} IProposalState
         */
        const proposalState = mockGetProposalState(proposal.proposalName);

        const currentProposal: Proposal = {
          id: i,
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

        allProposals.push(currentProposal);
        console.log(allProposals);
      }
      if (filters) {
        return allProposals.filter(proposal => filterStatement({ proposal, filters }));
      } else {
        return allProposals;
      }
    },
    { enabled: true },
  );

  return query as typeof query;
};
