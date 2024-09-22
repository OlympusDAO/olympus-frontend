import { Box, Typography } from "@mui/material";
import { PrimaryButton } from "@olympusdao/component-library";
import useAddToNetwork from "src/views/Governance/hooks/dev/useAddChain";
import { useCancelProposal } from "src/views/Governance/hooks/dev/useCancelProposal";
import { useCreateProposal } from "src/views/Governance/hooks/dev/useCreateProposal";
import { useMineBlocks } from "src/views/Governance/hooks/dev/useMineBlocks";
import { useVetoProposal } from "src/views/Governance/hooks/dev/useVetoProposal";

export const GovernanceDevTools = () => {
  const proposal = useCreateProposal();
  const mineBlocks = useMineBlocks();
  const vetoProposal = useVetoProposal();
  const cancelProposal = useCancelProposal();
  const addChain = useAddToNetwork();

  return (
    <>
      <Typography variant="h6" mb="6px">
        Dev Tools
      </Typography>
      <Box display="flex" gap="6px" flexWrap="wrap" border="1px dashed" p={"16px"} mb="6px">
        <PrimaryButton onClick={() => proposal.mutate()}>Create proposal </PrimaryButton>
        <PrimaryButton onClick={() => mineBlocks.mutate({ blocks: 21600 })}>Mine 21600 blocks (~3 Days)</PrimaryButton>
        <PrimaryButton onClick={() => mineBlocks.mutate({ blocks: 50400 })}>Mine 50400 blocks (~7 Days)</PrimaryButton>
        <PrimaryButton onClick={() => mineBlocks.mutate({ blocks: 7200 })}>Mine 7200 blocks (~1 Day)</PrimaryButton>
        <PrimaryButton onClick={() => mineBlocks.mutate({ blocks: 1 })}>Mine 1 block</PrimaryButton>
        <PrimaryButton onClick={() => vetoProposal.mutate({ proposalId: "4" })}>Veto Proposal</PrimaryButton>
        <PrimaryButton onClick={() => cancelProposal.mutate({ proposalId: "5" })}>Cancel Proposal</PrimaryButton>
        <PrimaryButton onClick={() => addChain.mutate()}>Add Fork To Wallet</PrimaryButton>
      </Box>
    </>
  );
};
