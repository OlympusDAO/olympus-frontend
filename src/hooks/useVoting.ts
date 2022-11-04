import { useMutation, useQuery } from "@tanstack/react-query";
import { BigNumber, ContractReceipt, ethers } from "ethers";
import { GOVERNANCE_CONTRACT, VOTE_TOKEN_CONTRACT } from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useArchiveNodeProvider } from "src/hooks/useArchiveNodeProvider";
import { VotesCastEvent } from "src/typechain/OlympusGovernance";
import { useNetwork, useSigner } from "wagmi";

interface Vote {
  proposalId: BigNumber;
  vote: boolean;
}

interface ActivatedProposal {
  proposalId: BigNumber;
  activationTimestamp: BigNumber;
}

/**
 * event is not indexed so can't filter by proposalId in the `VotesCast()` event
 * - as a result this returns ALL VOTES CAST EVENTS ON PARTHENON
 */
export const useGetVotesCastEvents = () => {
  const { chain = { id: 1 } } = useNetwork();
  const archiveProvider = useArchiveNodeProvider(chain?.id);
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id, archiveProvider);
  return useQuery<VotesCastEvent[], Error>(
    ["GetVotesCastEvents", chain.id],
    async () => {
      // using EVENTS
      return await contract.queryFilter(contract.filters.VotesCast());
    },
    { enabled: !!chain && !!chain.id && !!archiveProvider && !!contract },
  );
};

const voteCastEventProposalIdComparison = (event: VotesCastEvent, proposalId: number) => {
  return event.args?.proposalId.eq(ethers.utils.parseUnits(String(proposalId), 0));
};

const voteCastEventVoterAddressComparison = (event: VotesCastEvent, voterAddress: string) => {
  return event.args?.voter === voterAddress;
};

/**
 * returns all VotesCast events by ALL voters for THIS proposal
 */
export const useGetVotesCastForProposal = (
  proposalId: number,
): { data: VotesCastEvent[]; isFetched: boolean; isLoading: boolean } => {
  const { data: votesCastEvents, isFetched, isLoading } = useGetVotesCastEvents();
  let thisProposal: VotesCastEvent[] = [];
  if (isFetched && !!votesCastEvents && votesCastEvents?.length > 0) {
    thisProposal = votesCastEvents.filter((event: VotesCastEvent) =>
      voteCastEventProposalIdComparison(event, proposalId),
    );
  }
  return {
    data: thisProposal,
    isFetched,
    isLoading,
  };
};

/**
 * returns all VotesCast events by THIS voter for THIS proposal
 */
export const useGetVotesCastForProposalAndVoter = (
  proposalId: number,
  voterAddress: string,
): { data: VotesCastEvent[]; isFetched: boolean; isLoading: boolean } => {
  const { data: votesCastEvents, isFetched, isLoading } = useGetVotesCastEvents();
  let thisProposal: VotesCastEvent[] = [];
  if (isFetched && !!votesCastEvents && votesCastEvents?.length > 0) {
    thisProposal = votesCastEvents.filter(
      (event: VotesCastEvent) =>
        voteCastEventProposalIdComparison(event, proposalId) &&
        voteCastEventVoterAddressComparison(event, voterAddress),
    );
  }
  return {
    data: thisProposal,
    isFetched,
    isLoading,
  };
};

/**
 * returns all VotesCast events by THIS voter for ALL PROPOSALS
 */
export const useGetVotesCastByVoter = (
  voterAddress: string,
): { data: VotesCastEvent[]; isFetched: boolean; isLoading: boolean } => {
  const { data: votesCastEvents, isFetched, isLoading } = useGetVotesCastEvents();
  let thisVoter: VotesCastEvent[] = [];
  if (isFetched && !!votesCastEvents && votesCastEvents?.length > 0) {
    thisVoter = votesCastEvents.filter((event: VotesCastEvent) =>
      voteCastEventVoterAddressComparison(event, voterAddress),
    );
  }
  return {
    data: thisVoter,
    isFetched,
    isLoading,
  };
};

/**
 * returns the total vote value (# of tokens) for the connected wallet for the current proposal
 */
export const useUserVote = (proposalId: number, voterAddress: string) => {
  const { data: votesCastEvents, isLoading, isFetched } = useGetVotesCastForProposalAndVoter(proposalId, voterAddress);
  let thisVote: DecimalBigNumber = new DecimalBigNumber("0", 3);
  if (isFetched && !!votesCastEvents && votesCastEvents?.length > 0) {
    thisVote = new DecimalBigNumber(votesCastEvents[0].args.userVotes, 3);
  }
  return {
    data: thisVote,
    isFetched,
    isLoading,
  };
};

/**
 * returns the total supply of the Vote Token
 */
export const useVotingSupply = () => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = VOTE_TOKEN_CONTRACT.getEthersContract(chain.id);

  return useQuery<DecimalBigNumber, Error>(
    ["getVoteTokenTotalSupply", chain?.id],
    async () => {
      const votingSupply = await contract.totalSupply();
      return new DecimalBigNumber(votingSupply, 18);
    },
    { enabled: !!chain?.id },
  );
};

/**
 * returns the collateral Minimum
 */
export const useVotingCollateralMinimum = () => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);

  return useQuery<DecimalBigNumber, Error>(
    ["getVotingCollateralMinimum", chain?.id],
    async () => {
      const collateral = await contract.COLLATERAL_MINIMUM();
      return new DecimalBigNumber(collateral, 18);
    },
    { enabled: !!chain?.id },
  );
};

/**
 * returns the collateral Minimum as a decimal
 * - i.e. 0.05 = 5%
 */
export const useVotingCollateralRequirement = () => {
  const { chain = { id: 1 } } = useNetwork();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);

  return useQuery<DecimalBigNumber, Error>(
    ["getVotingCollateralRequirement", chain?.id],
    async () => {
      const collateral = await contract.COLLATERAL_REQUIREMENT();
      return new DecimalBigNumber(collateral, 4);
    },
    { enabled: !!chain?.id },
  );
};

// export const useEndorse = () => {
//   const dispatch = useDispatch();

//   const { chain = { id: 1 } } = useNetwork();
//   const { data: signer } = useSigner();

//   const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);

//   return useMutation<ContractReceipt, Error, { proposalId: BigNumber }>(
//     async ({ proposalId }: { proposalId: BigNumber }) => {
//       if (!signer) throw new Error("No signer connected, cannot endorse");

//       // NOTE (lienid): can't decide if it is worth calling totalInstructions on the INSTR contract
//       //                to make sure that the passed ID is valid. If it is being fed through by the
//       //                site then there's no reason it should be invalid. Also don't know if -1 may
//       //                ever be passed as some sort of default value
//       if (proposalId.eq(-1)) throw new Error(t`Cannot endorse proposal with invalid ID`);

//       const transaction = await contract.connect(signer).registerForProposal(proposalId);
//       return transaction.wait();
//     },
//     {
//       onError: error => {
//         console.error(error.message);
//       },
//       onSuccess: () => {
//         console.log(`Successfully endorsed proposal`);
//       },
//     },
//   );
// };

export const useVote = () => {
  const { chain = { id: 1 } } = useNetwork();
  const { data: signer } = useSigner();

  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);

  return useMutation<ContractReceipt, Error, { voteData: Vote }>(
    async ({ voteData }: { voteData: Vote }) => {
      if (!signer) throw new Error("No signer connected, cannot endorse");

      // const activeProposal: ActivatedProposal = await contract.activeProposal();
      // const activeProposalId = activeProposal.proposalId;

      // if (!voteData.proposalId.eq(activeProposalId)) throw new Error(t`You can only vote for the activated proposal`);

      const transaction = await contract.connect(signer).vote(voteData.proposalId, voteData.vote);
      return transaction.wait();
    },
    {
      onError: error => {
        console.error(error.message);
      },
      onSuccess: () => {
        console.log(`Successfully voted for proposal`);
      },
    },
  );
};
