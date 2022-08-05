import { Box, Grid, InputLabel, Select, styled, Typography } from "@mui/material";
import { Paper, PrimaryButton } from "@olympusdao/component-library";
import MDEditor from "@uiw/react-md-editor";
import { FC, useState } from "react";
import { makeJsonFile, uploadToIPFS } from "src/helpers/Web3Storage";

import { BackButton } from "../BackButton";
import { MarkdownPreview } from "../MarkdownPreview";
import { TextEntry } from "./components/TextEntry";

export const CreateProposal = () => {
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");
  const [proposalDiscussion, setProposalDiscussion] = useState("");
  const [proposalAction, setProposalAction] = useState("installModule");
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
          <Select
            key="action"
            native={true}
            defaultValue="installModule"
            sx={{ blur: "none" }}
            onChange={e => setProposalAction(e.target.value)}
            fullWidth
          >
            <option value="installModule">Install Module</option>
            <option value="upgradeModule">Upgrade Module</option>
            <option value="approvePolicy">Approve Policy</option>
            <option value="terminatePolicy">Terminate Policy</option>
            <option value="changeExecutor">Change Executor</option>
          </Select>
        </Box>
      </Grid>
    );
  };

  const handleFormSubmission = async () => {
    const files = makeJsonFile({
      name: proposalTitle,
      description: proposalDescription,
      content: proposalDescription,
      external_url: proposalDiscussion,
    });
    const cid = await uploadToIPFS(files);
    console.log("after", cid);
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
            onChange={value => value && setProposalDescription(value)}
            height={400}
            visibleDragbar={false}
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
          <PrimaryButton onClick={handleFormSubmission}>Continue</PrimaryButton>
        </Box>
      </Paper>
    </Box>
  );
};
