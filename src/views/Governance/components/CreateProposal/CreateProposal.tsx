import "./CreateProposal.scss";

import { Grid, MenuItem, Select, Typography } from "@mui/material";
import { Paper, PrimaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { makeJsonFile, uploadToIPFS } from "src/helpers/Web3Storage";

import { BackButton } from "../BackButton";
import { TextEntry } from "./components/TextEntry";

export const CreateProposal = () => {
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");
  const [proposalDiscussion, setProposalDiscussion] = useState("");
  const [proposalAction, setProposalAction] = useState("installModule");
  const [proposalContract, setProposalContract] = useState("");

  const selectionInput = () => {
    return (
      <Grid className="create-proposal-entry" container direction="column" xs={6}>
        <Grid className="entry-title" item>
          <Typography variant="body2">Action</Typography>
        </Grid>
        <Grid item>
          <Select defaultValue="installModule" onChange={(e: any) => setProposalAction(e.target.value)} fullWidth>
            <MenuItem value="installModule">Install Module</MenuItem>
            <MenuItem value="upgradeModule">Upgrade Module</MenuItem>
            <MenuItem value="approvePolicy">Approve Policy</MenuItem>
            <MenuItem value="terminatePolicy">Terminate Policy</MenuItem>
            <MenuItem value="changeExecutor">Change Executor</MenuItem>
          </Select>
        </Grid>
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
    <div className="create-proposal-form">
      <Paper>
        <Grid container direction="column" spacing={2}>
          <BackButton />
          <TextEntry inputTitle="Title" gridSize={12} handleChange={setProposalTitle} />
          <TextEntry
            inputTitle="Description"
            secondaryTitle={`${proposalDescription.length}/14,400`}
            gridSize={12}
            handleChange={setProposalDescription}
          />
          <TextEntry
            inputTitle="Discussion"
            gridSize={12}
            placeholder="e.g. https://forum.olympusday.finance/..."
            handleChange={setProposalDiscussion}
          />
          <Grid container direction="row">
            {selectionInput()}
            <TextEntry
              inputTitle="Target"
              placeholder="Contract address"
              gridSize={6}
              handleChange={setProposalContract}
            />
          </Grid>
          <PrimaryButton className="continue-button" onClick={handleFormSubmission}>
            Continue
          </PrimaryButton>
        </Grid>
      </Paper>
    </div>
  );
};
