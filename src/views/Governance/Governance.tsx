import { Box } from "@mui/material";
import { Paper } from "@olympusdao/component-library";
import { Route, Routes } from "react-router-dom";
import PageTitle from "src/components/PageTitle";
import { CreateProposal } from "src/views/Governance/components/CreateProposal";
import { ProposalPage } from "src/views/Governance/components/ProposalPage";
import { VotingPower, VotingPowerMetrics } from "src/views/Governance/components/ProposalPage/components/VotingPower";
import { ProposalsDashboard } from "src/views/Governance/ProposalsDashboard";

export const Governance = () => {
  return (
    <>
      <PageTitle name="Governance" />
      <Box display="flex" justifyContent="center" width="100%">
        <Paper>
          <VotingPowerMetrics />
        </Paper>
      </Box>
      <Routes>
        <Route path="/" element={<ProposalsDashboard />} />
        <Route path="/proposals/:passedId/*" element={<ProposalPage />} />
        <Route path="/create-proposal" element={<CreateProposal />} />
        <Route path="/get-vohm" element={<VotingPower />} />
      </Routes>
    </>
  );
};
