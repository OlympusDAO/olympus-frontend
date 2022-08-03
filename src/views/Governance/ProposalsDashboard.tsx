import "./Governance.scss";

import { t } from "@lingui/macro";
import { Grid, Link } from "@mui/material";
import { Skeleton } from "@mui/material";
import { Paper, Proposal, SecondaryButton } from "@olympusdao/component-library";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useProposal } from "src/hooks/useProposal";
import { useActiveProposal, useGetTotalInstructions } from "src/hooks/useProposals";

import { FilterModal } from "./components/FilterModal";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { toCapitalCase } from "./helpers";

export const ProposalsDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { data: numberOfProposals, isLoading } = useGetTotalInstructions();
  console.log("numberOfProposals", numberOfProposals);
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
        console.log("redner", i, i - 1, Math.max(coercedNumber - 10, 0));
        proposals.push(<ProposalContainer instructionsId={i} />);
      }
      return proposals;
    }
    return <ProposalSkeleton />;
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
          <Link to={`/governancetest/proposals/${proposal?.id}`} component={RouterLink}>
            <Proposal
              chipLabel={toCapitalCase(proposal?.state)}
              proposalTitle={proposal?.proposalName}
              publishedDate={new Date(proposal?.submissionTimestamp)}
              status={proposal?.state}
              voteEndDate={timeRemaining ? new Date(timeRemaining) : new Date()}
              votesAbstain={0}
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
    <Skeleton>
      <Proposal
        chipLabel={toCapitalCase("active")}
        proposalTitle={"proposal.proposalName"}
        publishedDate={new Date()}
        status={"active"}
        voteEndDate={new Date()}
        votesAbstain={0}
        votesAgainst={0}
        votesFor={0}
      />
    </Skeleton>
  );
};
