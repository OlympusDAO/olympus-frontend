import "./Governance.scss";

import { t } from "@lingui/macro";
import { Grid, Link } from "@mui/material";
import { Skeleton } from "@mui/material";
import { Paper, Proposal, SecondaryButton } from "@olympusdao/component-library";
import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useProposal } from "src/hooks/useProposal";
import {
  Proposal as ProposalType,
  useActiveProposal,
  useGetTotalInstructions,
  useProposals,
} from "src/hooks/useProposals";

import { FilterModal } from "./components/FilterModal";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { toCapitalCase } from "./helpers";

export const ProposalsDashboard = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { data: numberOfProposals = 0 } = useGetTotalInstructions();
  console.log("number", numberOfProposals);
  const { data: activeProposal } = useActiveProposal();
  const _useProposals = useProposals({ state: "active" });
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
    for (let i = numberOfProposals; i > numberOfProposals - 10; i--) {
      return <ProposalContainer instructionsId={i} />;
    }
    // return allProposalsData.map(proposal => {
    //   return (
    //     <Grid key={proposal.proposalName} item xs={12}>
    //       <Link to={`/governancetest/proposals/${proposal.id}`} component={RouterLink}>
    //         <Proposal
    //           chipLabel={toCapitalCase(proposal.state)}
    //           proposalTitle={proposal.proposalName}
    //           publishedDate={new Date(1659389876)}
    //           status={proposal.state}
    //           voteEndDate={new Date(1659389876)}
    //           votesAbstain={0}
    //           votesAgainst={proposal.noVotes}
    //           votesFor={proposal.yesVotes}
    //         />
    //       </Link>
    //     </Grid>
    //   );
    // });
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
            {activeProposal && (
              <ProposalContainer
                instructionsId={activeProposal?.instructionsId}
                timeRemaining={activeProposal?.timeRemaining}
              />
            )}
            {renderProposals()}
          </>
        </Grid>
      </Paper>

      <FilterModal isModalOpen={isFilterModalOpen} cancelFunc={handleFilterModalCancel} />
    </div>
  );
};

const ProposalContainer = ({ instructionsId, timeRemaining }: { instructionsId: number; timeRemaining?: number }) => {
  const { data: proposal, isLoading } = useProposal(instructionsId);

  // TODO(appleseed): add timeremaining indicator
  return (
    <>
      {isLoading || !proposal ? (
        <Grid key={instructionsId} item xs={12}>
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
        </Grid>
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
