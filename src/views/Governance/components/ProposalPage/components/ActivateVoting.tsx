import { Box } from "@mui/material";
import { PrimaryButton } from "@olympusdao/component-library";
import { useActivateProposal } from "src/hooks/useProposal";
import { ProposalTabProps } from "src/views/Governance/interfaces";
import { useAccount } from "wagmi";

export const ActivateVoting = ({ proposal }: ProposalTabProps) => {
  const { address, isConnected } = useAccount();
  const connectedWalletIsProposer =
    isConnected && !!address && proposal.submitter.toLowerCase() === address.toLowerCase();
  const proposalStateIsCorrect = proposal.state === "ready to activate" && Date.now() < proposal.nextDeadline;
  const proposalStatesToShow = ["ready to activate", "discussion"].includes(proposal.state);
  const activateProposal = useActivateProposal();
  const handleActivate = () => {
    activateProposal.mutate(proposal.id);
  };

  return (
    <>
      {connectedWalletIsProposer && proposalStatesToShow && (
        <Box display="flex" flexDirection="row" justifyContent="center">
          <PrimaryButton
            sx={{ minWidth: "120px" }}
            disabled={!proposalStateIsCorrect || activateProposal.isLoading}
            onClick={handleActivate}
            loading={activateProposal.isLoading}
          >
            {activateProposal.isLoading ? "Activating..." : "Activate for Voting"}
          </PrimaryButton>
        </Box>
      )}
    </>
  );
};
