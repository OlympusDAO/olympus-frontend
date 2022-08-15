import "src/views/Governance/Governance.scss";

import { Box, Grid, Link, Typography } from "@mui/material";
import { Skeleton } from "@mui/material";
import { Paper, Proposal, Tab, Tabs } from "@olympusdao/component-library";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useProposal } from "src/hooks/useProposal";
import { useActiveProposal, useGetTotalInstructions } from "src/hooks/useProposals";
import ActionButtons from "src/views/Governance/components/ActionButtons";
import { FilterModal } from "src/views/Governance/components/FilterModal";
import { SearchBar } from "src/views/Governance/components/SearchBar/SearchBar";
import { toCapitalCase } from "src/views/Governance/helpers";

export const ProposalsDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { data: numberOfProposals, isLoading } = useGetTotalInstructions();
  const { data: activeProposal } = useActiveProposal();

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
        <Grid container direction="column" spacing={2}>
          <>
            {Number(activeProposal?.activationTimestamp) > 0 && (
              <ProposalContainer
                instructionsId={Number(activeProposal?.instructionsId)}
                timeRemaining={Number(activeProposal?.timeRemaining)}
              />
            )}
            {isLoading ? <ProposalSkeleton /> : renderProposals()}
          </>
        </Grid>
      </Paper>

      <FilterModal isModalOpen={isFilterModalOpen} cancelFunc={handleFilterModalCancel} />
    </div>
  );
};

const ProposalContainer = ({ instructionsId, timeRemaining }: { instructionsId: number; timeRemaining?: number }) => {
  const { data: proposal, isLoading } = useProposal(instructionsId);

  return (
    <>
      {isLoading || !proposal ? (
        <ProposalSkeleton id={instructionsId} />
      ) : (
        <Grid key={instructionsId} item xs={12}>
          <Link to={`/governance/proposals/${proposal?.id}`} component={RouterLink}>
            <Proposal
              chipLabel={toCapitalCase(proposal?.state)}
              proposalTitle={proposal?.proposalName}
              publishedDate={new Date(proposal?.submissionTimestamp)}
              status={proposal?.state}
              voteEndDate={timeRemaining ? new Date(timeRemaining) : new Date()}
              quorum={0}
              votesAgainst={proposal?.noVotes}
              votesFor={proposal?.yesVotes}
            />
          </Link>
        </Grid>
      )}
    </>
  );
};

export const ProposalSkeleton = ({ id = 0 }: { id?: number }) => {
  return (
    <Skeleton width="100%">
      <Proposal
        chipLabel={toCapitalCase("active")}
        proposalTitle={"proposal.proposalName"}
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
