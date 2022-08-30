import { Route, Routes } from "react-router-dom";
import { CreateProposal } from "src/views/Governance/components/CreateProposal";
import { ProposalPage } from "src/views/Governance/components/ProposalPage";
import { ProposalsDashboard } from "src/views/Governance/ProposalsDashboard";

export const Governance = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ProposalsDashboard />} />
        <Route path="/proposals/:passedId/*" element={<ProposalPage />} />
        <Route path="/create-proposal" element={<CreateProposal />} />
      </Routes>
    </>
  );
};
