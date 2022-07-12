import "./Governance.scss";

import { t } from "@lingui/macro";
import { Grid, Link } from "@mui/material";
import { Paper, Proposal, SecondaryButton } from "@olympusdao/component-library";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Proposal as ProposalType, useProposals } from "src/hooks/useProposals";

import { FilterModal } from "./components/FilterModal";
import { SearchBar } from "./components/SearchBar/SearchBar";

export const ProposalsDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const _useProposals = useProposals({ isActive: false });
  const allProposalsData: ProposalType[] = useMemo(() => {
    if (_useProposals.isLoading || !_useProposals.data) return [];
    return _useProposals.data;
  }, [_useProposals]);

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterModalCancel = () => {
    setIsFilterModalOpen(false);
  };

  const renderProposals = () => {
    return allProposalsData.map(proposal => {
      return (
        <Grid item xs={12}>
          <Link to={`/governancetest/proposals/${proposal.proposalName}`} component={RouterLink}>
            <Proposal
              chipLabel="Discussion"
              proposalTitle={proposal.proposalName}
              publishedDate={new Date(1659389876)}
              status="discussion"
              voteEndDate={new Date(1659389876)}
              votesAbstain={0}
              votesAgainst={proposal.noVotes}
              votesFor={proposal.yesVotes}
            />
          </Link>
        </Grid>
      );
    });
  };

  return (
    <div className="proposals-dash">
      <Paper headerText={t`Proposals`}>
        <Grid
          className="dashboard-actions"
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <SecondaryButton startIconName="hamburger" onClick={handleFilterClick}>
            Filter
          </SecondaryButton>
          <SearchBar />
        </Grid>
        <Grid container direction="column" spacing={2}>
          {renderProposals()}
        </Grid>
      </Paper>

      <FilterModal isModalOpen={isFilterModalOpen} cancelFunc={handleFilterModalCancel} />
    </div>
  );
};
