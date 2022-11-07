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
export const parseProposalContent = async ({ uri }: { uri: string | undefined }): Promise<IProposalContent> => {
  const placeholder = {
    name: "",
    description: "",
    external_url: "",
  };
  if (!uri) return placeholder;
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
