import { Route, Routes } from "react-router-dom";

import { ProposalPage } from "./components/ProposalPage";
import { ProposalsDashboard } from "./ProposalsDashboard";

export const Governance = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ProposalsDashboard />} />
        <Route path="/proposals/:passedId" element={<ProposalPage />} />
      </Routes>
    </>
  );
};
