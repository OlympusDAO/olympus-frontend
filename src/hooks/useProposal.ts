import { t } from "@lingui/macro";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { parseBigNumber, stringToBytes32String } from "src/helpers";
import { createDependentQuery } from "src/helpers/react-query/createDependentQuery";
import { queryAssertion } from "src/helpers/react-query/queryAssertion";
import { nonNullable } from "src/helpers/types/nonNullable";
import { IPFSFileData, IProposalJson, makeJsonFile, uploadToIPFS } from "src/helpers/Web3Storage";
/// Import Proposal data type and mock data getters from useProposals
import {
  IAnyProposal,
  parseProposalContent,
  parseProposalState,
  ProposalAction,
  timeRemaining,
} from "src/hooks/useProposals";
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

  const proposalState = parseProposalState({ isActive });

  const query = useQuery<IAnyProposal, Error>(
    queryKey,
    async () => {
      queryAssertion(metadata && proposalState && endorsements && yesVotes && noVotes, queryKey);
      /// For the specified proposal index, fetch the relevant data points used in the frontend
      const proposalContent = await parseProposalContent({ uri: metadata.proposalURI });
      const content: string = proposalContent.description;
      const discussionURL: string = proposalContent.external_url;
      /**
       * submissionTimestamp as a Unix Time from the contract
       */
      const submissionTimestamp = parseBigNumber(metadata.submissionTimestamp, 0);
      const unixTimeRemaining = timeRemaining({ state: proposalState, submissionTimestamp });
      const jsTimeRemaining = unixTimeRemaining ? unixTimeRemaining * 1000 : undefined;
      const currentProposal = {
        id: instructionsIndex,
        title: proposalContent.name,
        submitter: metadata.submitter,
        // NOTE(appleseed): multiply submissionTimestamp by 1000 to convert to JS Time from Unix Time
        submissionTimestamp: submissionTimestamp * 1000,
        timeRemaining: jsTimeRemaining,
        isActive: isActive,
        state: proposalState,
        endorsements: parseBigNumber(endorsements, 0),
        yesVotes: parseBigNumber(yesVotes, 0),
        noVotes: parseBigNumber(noVotes, 0),
        uri: discussionURL,
        content,
      };

      return currentProposal;
    },
    {
      enabled: !!metadata && !!proposalState && !!endorsements && !!yesVotes && !!noVotes,
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
 * https://goerli.etherscan.io/address/0xaAd5e6e1362b458E38140B7E8c6d5D71b933a56f#writeContract
 *
 * params:
 * [[2,"0x5a46373152Fe723f052117fdc8E5282677808A70"]]
 * 0x6d792070726f706f73616c000000000000000000000000000000000000000000
 *
 * title (2nd param above):
 * ethers.utils.formatBytes32String("my proposal name")
 *
 * gotcha:
 * there are rules in Instructions.store() around contract addresses & naming for modules, etc
 *
 * deploy a new proposal for the 2nd element of the 1st param:
 * # from bophades repo
 * forge create src/policies/Governance.sol:Governance --constructor-args 0x3B294580Fcf1F60B94eca4f4CE78A2f52D23cC83 --rpc-url https://eth-goerli.g.alchemy.com/v2/_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC --private-key yours
 */
export const useSubmitProposal = () => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);
  const { data: signer } = useSigner();

  // TODO(appleseed): update ANY types below
  return useMutation<any, Error, { proposal: ISubmitProposal }>(async ({ proposal }: { proposal: ISubmitProposal }) => {
    if (!signer) throw new Error(t`Signer is not set`);

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
