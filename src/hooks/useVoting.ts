import { t } from "@lingui/macro";
import { useMutation } from "@tanstack/react-query";
import { BigNumber, ContractReceipt } from "ethers";
import { useDispatch } from "react-redux";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";
import { useNetwork, useSigner } from "wagmi";

interface Vote {
  proposalId: BigNumber;
  vote: boolean;
}

interface ActivatedProposal {
  proposalId: BigNumber;
  activationTimestamp: BigNumber;
}

export const useEndorse = () => {
  const dispatch = useDispatch();

  const { chain = { id: 1 } } = useNetwork();
  const { data: signer } = useSigner();

  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);

  return useMutation<ContractReceipt, Error, { proposalId: BigNumber }>(
    async ({ proposalId }: { proposalId: BigNumber }) => {
      if (!signer) throw new Error("No signer connected, cannot endorse");

      // NOTE (lienid): can't decide if it is worth calling totalInstructions on the INSTR contract
      //                to make sure that the passed ID is valid. If it is being fed through by the
      //                site then there's no reason it should be invalid. Also don't know if -1 may
      //                ever be passed as some sort of default value
      if (proposalId.eq(-1)) throw new Error(t`Cannot endorse proposal with invalid ID`);

      const transaction = await contract.connect(signer).endorseProposal(proposalId);
      return transaction.wait();
    },
    {
      onError: error => {
        console.error(error.message);
        dispatch(createErrorToast(error.message));
      },
      onSuccess: () => {
        dispatch(createInfoToast(t`Successfully endorsed proposal`));
      },
    },
  );
};

export const useVote = () => {
  const dispatch = useDispatch();

  const { chain = { id: 1 } } = useNetwork();
  const { data: signer } = useSigner();

  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);

  return useMutation<ContractReceipt, Error, { voteData: Vote }>(
    async ({ voteData }: { voteData: Vote }) => {
      if (!signer) throw new Error("No signer connected, cannot endorse");

      const activeProposal: ActivatedProposal = await contract.activeProposal();
      const activeProposalId = activeProposal.proposalId;

      if (!voteData.proposalId.eq(activeProposalId)) throw new Error(t`You can only vote for the activated proposal`);

      const transaction = await contract.connect(signer).vote(voteData.vote);
      return transaction.wait();
    },
    {
      onError: error => {
        console.error(error.message);
        dispatch(createErrorToast(error.message));
      },
      onSuccess: () => {
        dispatch(createInfoToast(t`Successfully voted for proposal`));
      },
    },
  );
};
