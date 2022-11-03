import { useMutation, useQuery } from "@tanstack/react-query";
import { BigNumber, ContractReceipt, ethers } from "ethers";
import { useDispatch } from "react-redux";
import { GOVERNANCE_CONTRACT, VOTE_TOKEN_CONTRACT } from "src/constants/contracts";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
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
 * returns the total endorsement value (# of tokens) for the connected wallet for the current proposal
 */
export const useUserEndorsement = (proposalId: number) => {
  const { chain = { id: 1 } } = useNetwork();
  const { isConnected, address: voterAddress } = useAccount();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);
  // const _useProposal = useProposal(proposalId);
  // const proposal: IAnyProposal = _useProposal.isLoading || !_useProposal.data ? NULL_PROPOSAL : _useProposal.data;

  return useQuery<boolean, Error>(
    ["getUserEndorsement", proposalId, voterAddress],
    async () => {
      // TODO(appleseed): this function isn't accessible rn
      // const endorsementValue = await _useProposal.data.votesRegisteredByUser(proposalId, address as string);
      const result = await contract.queryFilter(contract.filters.VotesCast());
      if (result.length > 0) {
        const thisProposal = result.filter(
          (event: ethers.Event) => event.args?.proposalId === proposalId && event.args?.voter === voterAddress,
        );
        if (thisProposal.length > 0) {
          // const endorsementValue = thisProposal[thisProposal.length - 1].proposalId;
          // return new DecimalBigNumber(endorsementValue, 3);
          return true;
        }
        // return new DecimalBigNumber("0", 3);
        return false;
      } else {
        // return new DecimalBigNumber("0", 3);
        return false;
      }
    },
    { enabled: !!isConnected && !!voterAddress },
  );
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
      return new DecimalBigNumber(votingSupply, 3);
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
  const dispatch = useDispatch();

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
