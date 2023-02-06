import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ethers } from "ethers";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { nonNullable } from "src/helpers/types/nonNullable";
import { useArchiveNodeProvider } from "src/hooks/useArchiveNodeProvider";
import { ProposalSubmittedEvent } from "src/typechain/OlympusGovernance";
import { useNetwork } from "wagmi";

export enum ProposalAction {
  InstallModule,
  UpgradeModule,
  ActivatePolicy,
  DeactivatePolicy,
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
  timeRemaining: number;
  nextDeadline: number;
  collateralClaimableAt: number;
  isActive: boolean | undefined;
  now: Date;
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
export type PStatus =
  | "discussion" // created but not ready to activate
  | "ready to activate" // ready to activate for voting
  | "expired activation" // missed activation window
  | "active" // active for voting
  | "executed" // passed & executed / implemented
  | "draft"
  | "closed";
export interface IProposalState {
  state: PStatus;
}

/**
 * returns a unix time differential (in seconds)
 * @param numDays number of days you want
 */
export const unixDays = (numDays: number) => {
  return numDays * 24 * 60 * 60;
};

interface IActivationTimelines {
  activationDeadline: ethers.BigNumber;
  activationTimelock: ethers.BigNumber;
  votingPeriod: ethers.BigNumber;
  collateralDuration: ethers.BigNumber;
}

/** time in seconds */
export const useActivationTimelines = () => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);
  return useQuery<IActivationTimelines, Error>(
    ["GetActivationTimelines", chain.id],
    async () => {
      const activationDeadline = await contract.ACTIVATION_DEADLINE();
      const activationTimelock = await contract.ACTIVATION_TIMELOCK();
      const votingPeriod = await contract.VOTING_PERIOD();
      // collateralDuration is time your collateral will be locked after proposing
      const collateralDuration = await contract.COLLATERAL_DURATION();

      return {
        activationDeadline,
        activationTimelock,
        votingPeriod,
        collateralDuration,
      };
    },
    { enabled: !!chain && !!chain.id && !!contract },
  );
};

/**
 * All parameters & return values are js timestamps (milliseconds).
 */
export const parseProposalState = ({
  activationTimestamp,
  earliestActivation,
  activationExpiry,
  votingExpiry,
}: {
  activationTimestamp: number;
  earliestActivation: number;
  activationExpiry: number;
  votingExpiry: number;
}): { status: PStatus; jsTimeRemaining: number; nextDeadline: number } => {
  const now = Date.now();
  let status: PStatus;
  let jsTimeRemaining: number;
  let nextDeadline: number;

  if (now < earliestActivation) {
    // "discussion" // created but not ready to activate
    // block.timestamp < proposal.submissionTimestamp + ACTIVATION_TIMELOCK
    status = "discussion";
    jsTimeRemaining = earliestActivation - now;
    nextDeadline = earliestActivation;
  } else if (now < activationExpiry && activationTimestamp === 0) {
    // | "ready to activate" // ready to activate for voting
    // block.timestamp < proposal.submissionTimestamp + ACTIVATION_DEADLINE
    status = "ready to activate";
    jsTimeRemaining = activationExpiry - now;
    nextDeadline = activationExpiry;
  } else if (now >= activationExpiry && activationTimestamp === 0) {
    // | "expired activation" // missed activation window
    // block.timestamp > proposal.submissionTimestamp + ACTIVATION_DEADLINE && activationTimestamp === 0
    status = "expired activation";
    jsTimeRemaining = 0;
    nextDeadline = activationExpiry;
  } else if (activationTimestamp > 0 && now < votingExpiry) {
    status = "active";
    jsTimeRemaining = votingExpiry - now;
    nextDeadline = votingExpiry;
  } else {
    status = "closed";
    jsTimeRemaining = 0;
    nextDeadline = votingExpiry;
  }

  // | "executed" // passed & executed / implemented

  return {
    status,
    jsTimeRemaining,
    nextDeadline,
  };
};

/**
 * expects a uri that returns json metadata with three keys:
 * - name {string}
 * - description {string}
 * - external_url {string} - url link to discussion
 */
export const parseProposalContent = async ({ uri }: { uri: string | undefined }): Promise<IProposalContent> => {
  const placeholder = {
    name: "",
    description: "",
    external_url: "",
  };
  if (!uri) return placeholder;
  let readURI = uri;
  if (~uri.indexOf("ipfs:/")) {
    readURI = `https://w3s.link/ipfs/${uri.replace("ipfs://", "")}`;
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
    return placeholder;
  }
};

export const useGetProposalSubmittedEvents = () => {
  const { chain = { id: 1 } } = useNetwork();
  const archiveProvider = useArchiveNodeProvider(chain?.id);
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id, archiveProvider);
  return useQuery<ProposalSubmittedEvent[], Error>(
    ["GetProposalSubmittedEvents", chain.id],
    async () => {
      // using EVENTS
      return await contract.queryFilter(contract.filters.ProposalSubmitted());
    },
    { enabled: !!chain && !!chain.id && !!archiveProvider && !!contract },
  );
};

/**
 * @param proposalId
 * @returns `{ data: proposalURI, isLoading, isFetched }`
 */
export const useGetProposalURIFromEvent = ({ proposalId }: { proposalId: number }) => {
  const { data: events, isFetched, isLoading } = useGetProposalSubmittedEvents();
  let proposalURI = "";
  if (isFetched && !!events) {
    const selectedProposalEvents = events.filter((event: ProposalSubmittedEvent) =>
      event.args.proposalId.eq(ethers.utils.parseUnits(String(proposalId), 0)),
    );
    const selectedProposalArgs = selectedProposalEvents[0]?.args;
    proposalURI = selectedProposalArgs.proposalURI;
  }
  return {
    data: proposalURI,
    isLoading,
    isFetched,
  };
};

/**
 * Get the most recent Proposal Id
 * - returns useQuery isLoading & isFetched results
 */
export const useGetLastProposalId = (): { data: number; isLoading: boolean; isFetched: boolean } => {
  const { data: events, isFetched, isLoading } = useGetProposalSubmittedEvents();

  ////////
  // NOTE(appleseed) could also be: (if we didn't already need all the events)
  ///////
  // const { chain = { id: 1 } } = useNetwork();
  // const contract = GOV_INSTRUCTIONS_CONTRACT.getEthersContract(chain.id);
  // return useQuery<ProposalSubmittedEvent[], Error>(
  //   ["useGetLastProposalId", chain.id],
  //   async () => {
  //     // using EVENTS
  //     return await contract.totalInstructions();
  //   },
  //   { enabled: !!chain && !!chain.id && !!archiveProvider && !!contract },
  // );

  let data = 0;
  if (isFetched && !!events && events.length > 0) {
    const mostRecentEventArgs = events[events.length - 1].args;
    const proposalNumber = mostRecentEventArgs.proposalId;
    data = Number(ethers.utils.formatUnits(proposalNumber, 0));
  }
  return {
    data,
    isLoading,
    isFetched,
  };
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
      case "discussion":
      case "draft":
      case "closed":
        result = proposal.isActive === false;
        break;
      default:
        console.log(`Sorry, we are out of somethings wrong.`);
    }
  }
  return result;
};
