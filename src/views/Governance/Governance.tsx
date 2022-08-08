import { Route, Routes } from "react-router-dom";

import { CreateProposal } from "./components/CreateProposal";
import { ProposalPage } from "./components/ProposalPage";
import { ProposalsDashboard } from "./ProposalsDashboard";

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
