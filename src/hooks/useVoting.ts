import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BigNumber, ContractReceipt, ethers } from "ethers";
import toast from "react-hot-toast";
import { GOVERNANCE_GOHM_ADDRESSES, VOTE_TOKEN_ADDRESSES } from "src/constants/addresses";
import { GOVERNANCE_CONTRACT, GOVERNANCE_VOHM_VAULT_CONTRACT, VOTE_TOKEN_CONTRACT } from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { useArchiveNodeProvider } from "src/hooks/useArchiveNodeProvider";
import { useGovernanceGohmBalance, useVoteBalance } from "src/hooks/useBalance";
import { proposalMetadataQueryKey, proposalQueryKey } from "src/hooks/useProposal";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { queryClient } from "src/lib/react-query";
import { VotesCastEvent } from "src/typechain/OlympusGovernance";
import { useAccount, useNetwork, useSigner } from "wagmi";

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
 * returns all VotesCast events by ALL voters for THIS proposal sorted by largest vote power
 */
export const useGetVotesCastForProposalBySize = (
  proposalId: number,
): { data: VotesCastEvent[]; isFetched: boolean; isLoading: boolean } => {
  const { data: votesCastEvents, isFetched, isLoading } = useGetVotesCastForProposal(proposalId);
  const sorted = votesCastEvents.sort(
    (a, b) => Number(a.args.userVotes.toString()) - Number(b.args.userVotes.toString()),
  );
  return {
    data: sorted,
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
  let thisVote: DecimalBigNumber = new DecimalBigNumber("0", 18);
  let voteYes = false;
  if (isFetched && !!votesCastEvents && votesCastEvents?.length > 0) {
    thisVote = new DecimalBigNumber(votesCastEvents[0].args.userVotes, 18);
    voteYes = votesCastEvents[0].args.approve;
  }
  return {
    data: { amount: thisVote, voteYes },
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
  const networks = useTestableNetworks();
  const { data: balance } = useVoteBalance()[networks.MAINNET];

  return useMutation<ContractReceipt, Error, { voteData: Vote }>(
    async ({ voteData }: { voteData: Vote }) => {
      if (!signer) throw new Error("No signer connected, cannot endorse");
      if (!balance) throw new Error("You cannot Vote without vOHM");

      const transaction = await contract.connect(signer).vote(voteData.proposalId, voteData.vote);
      toast("Submitted transaction to chain");
      return transaction.wait();
    },
    {
      onError: error => {
        console.error(error.message);
      },
      onSuccess: (tx, { voteData }) => {
        toast(`Successfully voted for proposal`);
        queryClient.invalidateQueries({ queryKey: ["GetVotesCastEvents", chain.id] });
        queryClient.invalidateQueries({ queryKey: proposalQueryKey(voteData.proposalId.toNumber()) });
        queryClient.invalidateQueries({ queryKey: proposalMetadataQueryKey(voteData.proposalId.toNumber()) });
      },
    },
  );
};

/** for a user to get voting power */
export const useWrapToVohm = () => {
  const queryClient = useQueryClient();
  const { address = "" } = useAccount();
  const { chain = { id: 1 } } = useNetwork();
  const { data: signer } = useSigner();
  const contract = GOVERNANCE_VOHM_VAULT_CONTRACT.getEthersContract(chain.id);
  const networks = useTestableNetworks();
  const { data: balance } = useGovernanceGohmBalance()[networks.MAINNET];

  return useMutation<ContractReceipt, Error, string>(
    async (amount: string) => {
      if (!signer) throw new Error("No signer connected, cannot endorse");
      if (!amount || isNaN(Number(amount))) throw new Error(`Please enter a number`);

      const _amount = new DecimalBigNumber(amount, 18);

      if (!_amount.gt("0")) throw new Error(`Please enter a number greater than 0`);

      if (!balance) throw new Error(`Please refresh your page and try again`);

      if (_amount.gt(balance)) throw new Error(`You cannot wrap more than your gOHM balance`);

      if (!contract) throw new Error(`Please switch to the Ethereum network to wrap your gOHM`);

      const transaction = await contract.connect(signer).deposit(_amount.toBigNumber());
      toast("Submitted transaction to chain");
      return transaction.wait();
    },
    {
      onError: error => {
        console.error(error.message);
      },
      onSuccess: () => {
        toast(`Successfully wrapped to vOHM`);
        queryClient.invalidateQueries({ queryKey: [["useBalance", address, VOTE_TOKEN_ADDRESSES, chain.id]] });
        queryClient.invalidateQueries({ queryKey: [["useBalance", address, GOVERNANCE_GOHM_ADDRESSES, chain.id]] });
        queryClient.invalidateQueries({ queryKey: ["getVoteTokenTotalSupply", chain.id] });
      },
    },
  );
};

/** for a user to unwrap voting power to gOHM */
export const useUnwrapFromVohm = () => {
  const queryClient = useQueryClient();
  const { address = "" } = useAccount();
  const { chain = { id: 1 } } = useNetwork();
  const { data: signer } = useSigner();
  const contract = GOVERNANCE_VOHM_VAULT_CONTRACT.getEthersContract(chain.id);
  const networks = useTestableNetworks();
  const { data: balance } = useVoteBalance()[networks.MAINNET];

  return useMutation<ContractReceipt, Error, string>(
    async (amount: string) => {
      if (!signer) throw new Error("No signer connected, cannot endorse");
      if (!amount || isNaN(Number(amount))) throw new Error(`Please enter a number`);

      const _amount = new DecimalBigNumber(amount, 18);

      if (!_amount.gt("0")) throw new Error(`Please enter a number greater than 0`);

      if (!balance) throw new Error(`Please refresh your page and try again`);

      if (_amount.gt(balance)) throw new Error(`You cannot unwrap more than your vOHM balance`);

      if (!contract) throw new Error(`Please switch to the Ethereum network to unwrap your vOHM`);

      const transaction = await contract.connect(signer).withdraw(_amount.toBigNumber());
      toast("Submitted transaction to chain");
      return transaction.wait();
    },
    {
      onError: error => {
        console.error(error.message);
      },
      onSuccess: () => {
        toast(`Successfully unwrapped to gOHM`);
        queryClient.invalidateQueries({ queryKey: [["useBalance", address, VOTE_TOKEN_ADDRESSES, chain.id]] });
        queryClient.invalidateQueries({ queryKey: [["useBalance", address, GOVERNANCE_GOHM_ADDRESSES, chain.id]] });
        queryClient.invalidateQueries({ queryKey: ["getVoteTokenTotalSupply", chain.id] });
      },
    },
  );
};
