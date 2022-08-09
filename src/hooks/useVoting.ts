import { t } from "@lingui/macro";
import { BigNumber, ContractReceipt } from "ethers";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { GOVERNANCE_CONTRACT } from "src/constants/contracts";
import { error as createErrorToast, info as createInfoToast } from "src/slices/MessagesSlice";
import { useNetwork, useSigner } from "wagmi";

interface Vote {
  instructionsId: BigNumber;
  vote: boolean;
}

interface ActivatedProposal {
  instructionsId: BigNumber;
  activationTimestamp: BigNumber;
}

export const useEndorse = () => {
  const dispatch = useDispatch();
  const { chain = { id: 1 } } = useNetwork();
  const { data: signer } = useSigner();
  const contract = GOVERNANCE_CONTRACT.getEthersContract(chain.id);

  if (!signer) throw new Error("No signer connected, cannot endorse");
  contract.connect(signer);

  return useMutation<ContractReceipt, Error, number>(
    // Pass in instructionsId to endorse
    async instructionsId => {
      //TODO: validate the instructions id input, make sure it is valid
      const idAsBigNumber = BigNumber.from(instructionsId);
      const transaction = await contract.endorseProposal(idAsBigNumber);

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

  if (!signer) throw new Error("No signer connected, cannot endorse");
  contract.connect(signer);

  return useMutation<ContractReceipt, Error, Vote>(
    // Pass in whether vote is yes or no
    async ({ instructionsId, vote }) => {
      const activeProposal: ActivatedProposal = await contract.activeProposal();
      const activeProposalId = activeProposal.instructionsId;

      // Validate inputs
      if (!instructionsId.eq(activeProposalId)) throw new Error(t`You can only vote for the activated proposal`);

      const transaction = await contract.vote(vote);

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
