import { Box, Grid, InputLabel, Select, styled, Typography } from "@mui/material";
import { Paper, PrimaryButton } from "@olympusdao/component-library";
import MDEditor from "@uiw/react-md-editor";
import { FC, useState } from "react";
import rehypeSanitize from "rehype-sanitize";
import { useIPFSUpload, useSubmitProposal } from "src/hooks/useProposal";
import { ProposalAction } from "src/hooks/useProposals";
import { BackButton } from "src/views/Governance/components/BackButton";
import { TextEntry } from "src/views/Governance/components/CreateProposal/components/TextEntry";
import { MarkdownPreview } from "src/views/Governance/components/MarkdownPreview";

export const CreateProposal = () => {
  const ipfsUpload = useIPFSUpload();
  const submitProposal = useSubmitProposal();

  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");
  const [proposalDiscussion, setProposalDiscussion] = useState("");
  // TODO(appleseed): need to allow multiple instructions
  const [proposalAction, setProposalAction] = useState<ProposalAction>(ProposalAction.InstallModule);
  const [proposalContract, setProposalContract] = useState("");

  const StyledInputLabel = styled(InputLabel)(() => ({
    lineHeight: "24px",
    fontSize: "15px",
    marginBottom: "3px",
  }));

  const SelectionInput: FC = () => {
    return (
      <Grid item xs={6}>
        <Box paddingTop="10px" paddingBottom="10px">
          <StyledInputLabel>Action</StyledInputLabel>
          {/* // TODO(appleseed): need to allow multiple instructions */}
          <Select
            key="action"
            native={true}
            value={proposalAction}
            sx={{ blur: "none" }}
            onChange={e => setProposalAction(Number(e.target.value))}
            fullWidth
          >
            <option value={ProposalAction.InstallModule}>Install Module</option>
            <option value={ProposalAction.UpgradeModule}>Upgrade Module</option>
            <option value={ProposalAction.ActivatePolicy}>Approve Policy</option>
            <option value={ProposalAction.DeactivatePolicy}>Terminate Policy</option>
            <option value={ProposalAction.ChangeExecutor}>Change Executor</option>
          </Select>
        </Box>
      </Grid>
    );
  };

  const canSubmit = () => {
    if (submitProposal.isLoading) return false;
    return true;
  };

  const handleFormSubmission = async () => {
    const proposal = {
      name: proposalTitle,
      description: proposalDescription,
      content: proposalDescription,
      external_url: proposalDiscussion,
    };
    const fileData = await ipfsUpload.mutateAsync({ proposal });
    if (fileData) {
      const proposalURI = `ipfs://${fileData.path}`;
      // TODO(appleseed): need to allow multiple instructions
      const instructions = [{ action: proposalAction, target: proposalContract }];
      submitProposal.mutate({ proposal: { name: proposal.name, instructions, proposalURI } });
    } else {
      // TODO(appleseed): there was a problem uploading your proposal to IPFS
    }
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper>
        <Grid container direction="column" paddingLeft="4.5px" paddingRight="4.5px">
          <BackButton />
          <TextEntry label="Title" handleChange={setProposalTitle} />
          <StyledInputLabel>Description</StyledInputLabel>
          <MDEditor
            preview="edit"
            value={proposalDescription}
            onChange={value => (value ? setProposalDescription(value) : setProposalDescription(""))}
            height={400}
            visibleDragbar={false}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />
          <Box display="flex" flexDirection="row" justifyContent="flex-end">
            <Typography>{proposalDescription.length}/14,400</Typography>
          </Box>
          <MarkdownPreview content={proposalDescription} />
          <TextEntry
            label="Discussion"
            placeholder="e.g. https://forum.olympusday.finance/..."
            handleChange={setProposalDiscussion}
          />

          <Grid container direction="row" spacing="10">
            <SelectionInput />
            <Grid item xs={6}>
              <TextEntry label="Target" placeholder="Contract address" handleChange={setProposalContract} />
            </Grid>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end">
          <PrimaryButton disabled={!canSubmit()} onClick={handleFormSubmission}>
            {submitProposal.isLoading ? "Submitting..." : "Continue"}
          </PrimaryButton>
        </Box>
      </Paper>
    </Box>
  );
};
