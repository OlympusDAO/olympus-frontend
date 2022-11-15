import { useMutation, useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { GOV_INSTRUCTIONS_CONTRACT, GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { parseBigNumber, stringToBytes32String } from "src/helpers";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { nonNullable } from "src/helpers/types/nonNullable";
import { IPFSFileData, IProposalJson, makeJsonFile, uploadToIPFS } from "src/helpers/Web3Storage";
import { useArchiveNodeProvider } from "src/hooks/useArchiveNodeProvider";
/// Import Proposal data type and mock data getters from useProposals
import {
  IAnyProposal,
  parseProposalContent,
  parseProposalState,
  ProposalAction,
  useActivationTimelines,
  useGetProposalURIFromEvent,
} from "src/hooks/useProposals";
import { useVotingCollateralMinimum, useVotingCollateralRequirement, useVotingSupply } from "src/hooks/useVoting";
import { InstructionStructOutput } from "src/typechain/OlympusGovInstructions";
import { useNetwork, useSigner } from "wagmi";

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
  const archiveProvider = useArchiveNodeProvider(chain?.id);
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id, archiveProvider);
  const queryKey = proposalQueryKey(instructionsIndex);
  const { data: proposalURI } = useGetProposalURIFromEvent({
    proposalId: instructionsIndex,
  });
  const { data: metadata, isFetched: metadataIsFetched } = useQuery(
    ["GetProposalMetadata", instructionsIndex],
    async () => {
      return await contract.getProposalMetadata(instructionsIndex);
    },
  );

  const { data: activationTimelines } = useActivationTimelines();

  const query = useQuery<IAnyProposal, Error>(
    queryKey,
    async () => {
      if (metadata === undefined || activationTimelines === undefined) {
        // this should be impossible if the enabled block checks !!metadata, too
        // but it's necessary to fix the metadata | undefined typing in the rest of this query
        throw new Error("something went wrong with proposalMetadata.");
      } else {
        /// For the specified proposal index, fetch the relevant data points used in the frontend
        const proposalContent = await parseProposalContent({ uri: proposalURI });
        const content: string = proposalContent.description;
        const discussionURL: string = proposalContent.external_url;
        /**
         * submissionTimestamp as a JS Time (milliseconds) from the contract (was a unix time (seconds) on the contract)
         * NOTE(appleseed): multiply unixTimestamps by 1000 to convert to JS Time from Unix Time
         */
        const submissionTimestamp = parseBigNumber(metadata.submissionTimestamp, 0) * 1000;
        const activationTimestamp = parseBigNumber(metadata.activationTimestamp, 0) * 1000;
        const activationTimelock = parseBigNumber(activationTimelines.activationTimelock, 0) * 1000;
        const activationDeadline = parseBigNumber(activationTimelines.activationDeadline, 0) * 1000;
        const votingPeriod = parseBigNumber(activationTimelines.votingPeriod, 0) * 1000;
        const isActive = activationTimestamp !== 0;
        const earliestActivation = submissionTimestamp + activationTimelock;
        const activationExpiry = submissionTimestamp + activationDeadline;
        const votingExpiry = activationTimestamp + votingPeriod;
        const proposalState = parseProposalState({
          activationTimestamp,
          earliestActivation,
          activationExpiry,
          votingExpiry,
        });
        const endorsements = parseBigNumber(metadata.totalRegisteredVotes, 18);
        const yesVotes = parseBigNumber(metadata.yesVotes, 18);
        const noVotes = parseBigNumber(metadata.noVotes, 18);

        const currentProposal = {
          id: instructionsIndex,
          title: proposalContent.name,
          submitter: metadata.submitter,
          submissionTimestamp: submissionTimestamp,
          timeRemaining: proposalState.jsTimeRemaining,
          nextDeadline: proposalState.nextDeadline,
          isActive: isActive,
          state: proposalState.status,
          endorsements,
          yesVotes,
          noVotes,
          uri: discussionURL,
          content,
        };

        return currentProposal;
      }
    },
    {
      enabled:
        !!chain &&
        !!archiveProvider &&
        !!contract &&
        proposalURI.length > 0 &&
        !!metadata &&
        metadataIsFetched &&
        !!activationTimelines,
    },
  );

  return query as typeof query;
};

export type TInstructionSet = {
  action: ProposalAction;
  target: string;
};

export interface ISubmitProposal {
  name: string;
  proposalURI: string;
  instructions: TInstructionSet[];
}
/**
 * submit proposal at:
 * https://goerli.etherscan.io/tx/0x7150ffcc290038deab9c89b1630df273273d2b428e6ee6fb6bec0ddeefe25b18
 *
 * params:
 * [[2,"0x5a46373152Fe723f052117fdc8E5282677808A70"]]
 * 0x6d792070726f706f73616c000000000000000000000000000000000000000000
 * [{"action": "2", "target": "0x5a46373152Fe723f052117fdc8E5282677808A70"}]
 *
 * title (2nd param above):
 * ethers.utils.formatBytes32String("my proposal name")
 * 0x6d792070726f706f73616c206e616d6500000000000000000000000000000000
 *
 * proposalURI: ipfs://bafybeicyta5tlfodbxkgofjoy46iexwhl2d773rjl4cryklqyx7dzikx2u/proposal.json
 *
 * gotcha:
 * there are rules in Instructions.store() around contract addresses & naming for modules, etc
 *
 * deploy a new proposal for the 2nd element of the 1st param:
 * # from bophades repo
 * forge create src/policies/Governance.sol:Governance --constructor-args 0x3B294580Fcf1F60B94eca4f4CE78A2f52D23cC83 --rpc-url https://eth-goerli.g.alchemy.com/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC --private-key yours
 *
 */
export const useSubmitProposal = () => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);
  const { data: signer } = useSigner();

  // TODO(appleseed): update ANY types below
  return useMutation<any, Error, { proposal: ISubmitProposal }>(async ({ proposal }: { proposal: ISubmitProposal }) => {
    if (!signer) throw new Error(`Signer is not set`);

    // NOTE(appleseed): proposal.name is limited 31 characters, but full proposal name is uploaded in metadata via useIPFSUpload
    await contract.connect(signer).submitProposal(
      proposal.instructions,
      ethers.utils.formatBytes32String(stringToBytes32String(proposal.name)),
      // TODO(appleseed): add back in name after contract update
      proposal.proposalURI,
    );
  });
};

export const useIPFSUpload = () => {
  return useMutation<IPFSFileData | undefined, Error, { proposal: IProposalJson }>(
    async ({ proposal }: { proposal: IProposalJson }) => {
      const file = makeJsonFile(proposal, "proposal.json");
      const fileInfo = await uploadToIPFS(file);
      console.log("after", fileInfo);
      return fileInfo;
    },
  );
};

/**
 * how much voting power does it require to create a proposal
 */
export const useCreateProposalVotingPowerReqd = () => {
  const { data: totalSupply, isFetched: supplyFetched, isLoading: supplyLoading } = useVotingSupply();
  const {
    data: collateralMinimum,
    isFetched: minimumFetched,
    isLoading: minimumLoading,
  } = useVotingCollateralMinimum();
  const {
    data: collateralRequirement,
    isFetched: requirementFetched,
    isLoading: requirementLoading,
  } = useVotingCollateralRequirement();
  // const collateral = _max(
  //     (VOTES.totalSupply() * COLLATERAL_REQUIREMENT) / 10_000,
  //     COLLATERAL_MINIMUM
  // );
  const everythingFetched = supplyFetched && minimumFetched && requirementFetched;
  let collateral = new DecimalBigNumber("0", 18);
  if (everythingFetched && !!totalSupply && !!collateralRequirement && !!collateralMinimum) {
    const numerator = totalSupply.mul(collateralRequirement);
    collateral = new DecimalBigNumber((collateralMinimum.gt(numerator) ? collateralMinimum : numerator).toString(), 18);
  }

  return {
    data: collateral,
    isLoading: supplyLoading && minimumLoading && requirementLoading,
    isFetched: everythingFetched,
  };
};

/** get the instructions from the proposal */
export const useGetInstructions = (proposalId: number) => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = GOV_INSTRUCTIONS_CONTRACT.getEthersContract(chain.id);
  return useQuery<InstructionStructOutput[], Error>(
    ["getInstructions", chain.id, proposalId],
    async () => {
      // using EVENTS
      return await contract.getInstructions(String(proposalId));
    },
    { enabled: !!chain && !!chain.id && !!contract && !!proposalId },
  );
};

export const useActivateProposal = () => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);
  const { data: signer } = useSigner();

  // TODO(appleseed): update ANY types below
  return useMutation<any, Error, number>(async (proposalId: number) => {
    if (!signer) throw new Error(`Signer is not set`);

    // NOTE(appleseed): proposal.name is limited 31 characters, but full proposal name is uploaded in metadata via useIPFSUpload
    await contract.connect(signer).activateProposal(proposalId);
  });
};
