import { Provider } from "@ethersproject/abstract-provider";
import { t } from "@lingui/macro";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { parseBigNumber, stringToBytes32String } from "src/helpers";
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
import { OlympusGovernance__factory } from "src/typechain";
import { useNetwork, useProvider, useSigner } from "wagmi";

const getProposalURIFromEvent = async ({ provider, proposalId }: { provider: Provider; proposalId: number }) => {
  const logs = await provider.getLogs({
    fromBlock: "earliest",
    toBlock: "latest",
    topics: [OlympusGovernance__factory.createInterface().getEventTopic("ProposalSubmitted")],
  });
  try {
    const iface = new ethers.utils.Interface(OlympusGovernance__factory.abi);
    const proposalURI: string = logs
      .map((result: { topics: string[]; data: string }) => {
        const parsed = iface.parseLog({ topics: result.topics, data: result.data });
        if (parsed.args.proposalId === proposalId) return parsed.args.proposalURI;
      })
      .filter((result_1: string) => result_1 != undefined)
      .pop();
    // const tokens: string[] = logs
    //   .map((result: { topics: string[]; data: string }) => {
    //     const parsed = iface.parseLog({ topics: result.topics, data: result.data });
    //     if (parsed.args.underlying === OHM_ADDRESSES[networks.MAINNET]) return parsed.args.bondToken;
    //   })
    //   .filter((result_1: string) => result_1 != undefined);
    // return tokens;
    return proposalURI;
  } catch (error) {
    console.error(error);
  }
};

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
  const provider = useProvider();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);
  const queryKey = proposalQueryKey(instructionsIndex);
  // const useDependentQuery = createDependentQuery(queryKey);
  // dependent queries, may be more clear as Promises
  // const metadata = useDependentQuery("GetProposalMetadata", () => contract.getProposalMetadata(instructionsIndex));
  // isActive becomes proposal.activationTimestamp != 0
  // const isActive = useDependentQuery("ProposalHasBeenActivated", () =>
  //   contract.proposalHasBeenActivated(instructionsIndex),
  // );
  // added to metadata
  // const endorsements = useDependentQuery("TotalEndorsementsForProposal", () =>
  //   contract.totalEndorsementsForProposal(instructionsIndex),
  // );
  // const yesVotes = useDependentQuery("YesVotesForProposal", () => contract.yesVotesForProposal(instructionsIndex));
  // const noVotes = useDependentQuery("NoVotesForProposal", () => contract.noVotesForProposal(instructionsIndex));

  const query = useQuery<IAnyProposal, Error>(
    queryKey,
    async () => {
      // queryAssertion(metadata, queryKey);
      const metadata = await contract.getProposalMetadata(instructionsIndex);
      /// For the specified proposal index, fetch the relevant data points used in the frontend
      // needs to be parsed from the event...
      const proposalURI = await getProposalURIFromEvent({ provider, proposalId: instructionsIndex });
      const proposalContent = await parseProposalContent({ uri: proposalURI });
      const content: string = proposalContent.description;
      const discussionURL: string = proposalContent.external_url;
      /**
       * submissionTimestamp as a Unix Time from the contract
       */
      const submissionTimestamp = parseBigNumber(metadata.submissionTimestamp, 0);
      const activationTimestamp = parseBigNumber(metadata.activationTimestamp, 0);
      const isActive = activationTimestamp !== 0;
      const proposalState = parseProposalState({ isActive });
      const endorsements = parseBigNumber(metadata.totalRegisteredVotes, 3);
      const yesVotes = parseBigNumber(metadata.yesVotes, 3);
      const noVotes = parseBigNumber(metadata.noVotes, 3);
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
        endorsements,
        yesVotes,
        noVotes,
        uri: discussionURL,
        content,
      };

      return currentProposal;
    },
    // {
    //   enabled: !!metadata && !!proposalState && !!endorsements && !!yesVotes && !!noVotes,
    // },
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
 * TODO(appleseed) must APPROVE vOHM to be spent on Gov Contract: https://goerli.etherscan.io/tx/0x687575662aaf247992c47599dfef947bbe64f2022ee59df6e065e72e194b07cf
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
