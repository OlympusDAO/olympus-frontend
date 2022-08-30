import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { ethers } from "ethers";
import { GOV_INSTRUCTIONS_CONTRACT, GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { parseBigNumber } from "src/helpers";
import { createDependentQuery } from "src/helpers/react-query/createDependentQuery";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";
import { useNetwork } from "wagmi";

export enum ProposalAction {
  InstallModule,
  UpgradeModule,
  ApprovePolicy,
  TerminatePolicy,
  ChangeExecutor,
}

/// Data type for return from getProposalMetadata on Governance.sol
export interface proposalMetadata {
  title: string;
  submitter: string;
  submissionTimestamp: number;
}

/// Data type for returning full proposal informations
export interface Proposal {
  id: number;
  title: string;
  submitter: string;
  submissionTimestamp: number;
  isActive: boolean;
  state: PStatus;
  endorsements: number;
  yesVotes: number;
  noVotes: number;
  uri: string;
  content: string;
}

export interface IAnyProposal extends Omit<Proposal, "isActive"> {
  timeRemaining?: number | undefined;
  isActive: boolean | undefined;
}

export interface IActiveProposal {
  instructionsId: number;
  activationTimestamp: number;
  timeRemaining: number;
}

export interface IProposalContent {
  name: string;
  description: string;
  external_url: string;
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
    title: "0x4f49502d31000000000000000000000000000000000000000000000000000000",
    submitter: "0x6e36b2f9f2BcC273f090ff049952Fa4B5Cc67567",
    submissionTimestamp: 1653948322,
  },
  1: {
    title: "0x4f49502d32000000000000000000000000000000000000000000000000000000",
    submitter: "0x0adfA199aB9485CE53859CD237836bFE6019F5Fa",
    submissionTimestamp: 1655157922,
  },
  2: {
    title: "0x4f49502d33000000000000000000000000000000000000000000000000000000",
    submitter: "0x6e36b2f9f2BcC273f090ff049952Fa4B5Cc67567",
    submissionTimestamp: 1655503522,
  },
  3: {
    title: "0x4f49502d34000000000000000000000000000000000000000000000000000000",
    submitter: "0x0adfA199aB9485CE53859CD237836bFE6019F5Fa",
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

/**
 * returns a unix time differential (in seconds)
 * @param numDays number of days you want
 */
export const unixDays = (numDays: number) => {
  return numDays * 24 * 60 * 60;
};

/**
 * timeRemaining as a Unix Time from the contract
 * @param submissionTimestamp should be a Unix Time (1/1000 of JS Time)
 * @returns a Unix Time unless the proposal is not active or endorsements status, then returns undefined (no expiration)
 */
export const timeRemaining = ({
  state,
  submissionTimestamp,
}: {
  state: PStatus;
  submissionTimestamp: number;
}): number | undefined => {
  if (state === "active") {
    // TODO(appleseed): setup a config to make these duration requirements (from the contract) easily modifiable
    return submissionTimestamp + unixDays(7);
  } else if (state === "endorsement") {
    return submissionTimestamp + unixDays(14);
  } else {
    return undefined;
  }
};

export const parseProposalState = ({ isActive }: { isActive: boolean | undefined }): PStatus => {
  switch (isActive) {
    case true:
      return "active";
    case false:
      return "endorsement";
    default:
      return "discussion";
  }
};

/**
 * expects a uri that returns json metadata with three keys:
 * - name {string}
 * - description {string}
 * - external_url {string} - url link to discussion
 */
export const parseProposalContent = async ({ uri }: { uri: string }): Promise<IProposalContent> => {
  let readURI = uri;
  if (~uri.indexOf("ipfs:/")) {
    readURI = `https://ipfs.io/ipfs/${uri.replace("ipfs:/", "")}`;
  }
  try {
    const res = await axios.get(readURI);
    return {
      name: res.data.name as string,
      description: res.data.description as string,
      external_url: res.data.external_url as string,
    };
  } catch (error) {
    // handle error
    console.log(error);
    return {
      name: "",
      description: "",
      external_url: "",
    };
  }
};

/**
 * @NOTE (appleseed) - this may be unnecessary (it might repeat the same proposal as `renderProposals` in `<ProposalsDashboard>`)
 * @returns the activeProposal (without metadata)
 */
export const useActiveProposal = () => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);
  return useQuery<IActiveProposal, Error>(["getActiveProposal"], async () => {
    /**
     * @NOTE `getActiveProposal` returns [0, 0] when nothing is active
     */
    const activeProposal = await contract.getActiveProposal();
    /**
     * number of seconds remaining in proposal
     */
    const activationTimestamp = parseBigNumber(activeProposal.activationTimestamp, 0);
    const unixTimeRemaining = timeRemaining({ state: "active", submissionTimestamp: activationTimestamp });
    const jsTimeRemaining = unixTimeRemaining ? unixTimeRemaining * 1000 : 0;
    return {
      instructionsId: parseBigNumber(activeProposal.instructionsId, 0),
      activationTimestamp,
      timeRemaining: jsTimeRemaining,
    };
  });
};

export const mockGetTotalInstructions = (): number => {
  return mockTotalInstructions;
};

export const useGetTotalInstructions = (): UseQueryResult<number, Error> => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = GOV_INSTRUCTIONS_CONTRACT.getEthersContract(chain.id);
  return useQuery<number, Error>(["GetTotalInstructions"], async () => {
    const total = await contract.totalInstructions();
    // NOTE(appleseed): not using DecimalBigNumber.toAproxNumber() because this seems simplere
    return parseBigNumber(total, 0);
  });
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
export const mockGetProposalURI = (title: string): string => {
  return mockProposalURIs[title];
};

//TODO: Not implemented in Contract. Follow up with SC Team
/// Function to return mock proposal content in lieu of content deployed to IPFS
export const mockGetProposalContent = (uri: string): string => {
  return mockProposalContent[uri];
};

/// Function to return mock proposal state in lieu of contract/content deployed to IPFS
export const mockGetProposalState = (title: string): PStatus => {
  return mockProposalState[title];
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
  // TODO(appleseed): this needs to be rewritten
  const queryKey = proposalsQueryKey(filters);
  const useDependentQuery = createDependentQuery(queryKey);
  /// Get total number of proposal through INSTR module contract's totalInstructions variable
  const { data: numberOfProposals } = useGetTotalInstructions();
  const query = useQuery<Proposal[], Error>(
    queryKey,
    async () => {
      queryAssertion(numberOfProposals, queryKey);
      const allProposals: Proposal[] = [];

      /// For each proposal, fetch the relevant data points used in the frontend
      // NOTE(appleseed): 1. iterate in reverse order, 2. don't query any proposals that are older than 2 weeks
      // NOTE(cont'd): otherwise we'll have too many api calls
      // TODO(cont'd): 3. build separate functionality (via the graph) that queries for older proposals
      for (let i = numberOfProposals; i > 0; i--) {
        const proposal = MockGetProposalMetadata(i);
        const isActive = MockGetProposalHasBeenActivated(i);
        const endorsements = MockGetProposalTotalEndorsements(i);
        const yesVotes = MockGetYesVotesForProposal(i);
        const noVotes = MockGetNoVotesForProposal(i);
        const proposalURI = mockGetProposalURI(proposal.title);
        const proposalContent = mockGetProposalContent(proposalURI);
        /**
         * should become parsing logic to determine a proposal's state
         * - TODO(appleseed): still need to determine methodolgy for "discussion", "draft" and "closed" states
         * @returns {PStatus} IProposalState
         */
        const proposalState = mockGetProposalState(proposal.title);

        const currentProposal: Proposal = {
          id: i,
          title: ethers.utils.parseBytes32String(proposal.title),
          submitter: proposal.submitter,
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
