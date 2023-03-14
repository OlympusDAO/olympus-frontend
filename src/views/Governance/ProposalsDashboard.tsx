import "src/views/Governance/Governance.scss";

import { Box, Grid, Link, Typography } from "@mui/material";
import { Skeleton } from "@mui/material";
import { Paper, Tab, Tabs } from "@olympusdao/component-library";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useProposal } from "src/hooks/useProposal";
import { useGetLastProposalId } from "src/hooks/useProposals";
import ActionButtons from "src/views/Governance/components/ActionButtons";
import { FilterModal } from "src/views/Governance/components/FilterModal";
import { Proposal } from "src/views/Governance/components/Proposal";
import { SearchBar } from "src/views/Governance/components/SearchBar/SearchBar";
import { toCapitalCase } from "src/views/Governance/helpers";

export const ProposalsDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { data: numberOfProposals, isLoading } = useGetLastProposalId();

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterModalCancel = () => {
    setIsFilterModalOpen(false);
  };

  const renderProposals = () => {
    const coercedNumber = Number(numberOfProposals);
    // TODO(appleseed): properly handle 0 proposals
    if (numberOfProposals && coercedNumber > 0) {
      // TODO(appleseed): just parsing last 10 proposals right now
      const proposals = [];
      for (let i = coercedNumber; i > Math.max(coercedNumber - 10, 0); i--) {
        proposals.push(<ProposalContainer key={i} instructionsId={i} />);
      }
      return proposals;
    }
    return <ProposalSkeleton />;
  };

  return (
    <div className="proposals-dash">
      <Paper>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Typography fontSize="27px" fontWeight="500" lineHeight="33px">
            Proposals
          </Typography>
          <ActionButtons />
        </Box>
        <Box display="flex" justifyContent="center">
          <Tabs value={false}>
            <Tab label="Treasury" />
            <Tab label="Community" />
          </Tabs>
        </Box>
        <SearchBar />
        {/* <Grid
          className="dashboard-actions"
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <SecondaryButton startIconName="hamburger" onClick={handleFilterClick}>
            Filter
          </SecondaryButton>
        </Grid> */}
        <Grid container direction="column" spacing={2} xs={12} ml={0}>
          <>{isLoading ? <ProposalSkeleton /> : renderProposals()}</>
        </Grid>
      </Paper>

      <FilterModal isModalOpen={isFilterModalOpen} cancelFunc={handleFilterModalCancel} />
    </div>
  );
};

const ProposalContainer = ({ instructionsId }: { instructionsId: number }) => {
  const { data: proposal, isLoading } = useProposal(instructionsId);

  return (
    <>
      {isLoading || !proposal ? (
        <ProposalSkeleton />
      ) : (
        <Grid key={instructionsId} item xs={12} style={{ paddingLeft: "0px" }}>
          <Link to={`/governance/proposals/${proposal?.id}`} component={RouterLink}>
            <Proposal
              chipLabel={toCapitalCase(proposal?.state)}
              proposalTitle={proposal?.title}
              publishedDate={new Date(proposal?.submissionTimestamp)}
              status={proposal?.state}
              voteEndDate={new Date(proposal?.nextDeadline)}
              quorum={proposal.quorum}
              votesAgainst={proposal?.noVotes}
              votesFor={proposal?.yesVotes}
            />
          </Link>
        </Grid>
      )}
    </>
  );
};

export const ProposalSkeleton = () => {
  return (
    <Skeleton width="100%">
      <Proposal
        chipLabel={toCapitalCase("active")}
        proposalTitle={"proposal.title"}
        publishedDate={new Date()}
        status={"active"}
        voteEndDate={new Date()}
        quorum={0}
        votesAgainst={0}
        votesFor={0}
      />
    </Skeleton>
  );
};
