import "src/views/Governance/components/ProposalPage/ProposalPage.scss";

import { Box, Grid, Link, Typography, useTheme } from "@mui/material";
import { Chip, Icon, OHMChipProps, Paper, Tab, Tabs } from "@olympusdao/component-library";
import { FC, useMemo } from "react";
import { NavLink, Outlet, Route, Routes, useParams } from "react-router-dom";
import { shorten } from "src/helpers";
import { prettifySeconds } from "src/helpers/timeUtil";
import { useProposal } from "src/hooks/useProposal";
import { IAnyProposal, PStatus } from "src/hooks/useProposals";
import ActionButtons from "src/views/Governance/components/ActionButtons";
import { BackButton } from "src/views/Governance/components/BackButton";
import { CastVote } from "src/views/Governance/components/ProposalPage/components/CastVote";
import { PollDetailsTab } from "src/views/Governance/components/ProposalPage/components/PollDetailsTab";
import { StatusBar } from "src/views/Governance/components/ProposalPage/components/StatusBar";
import { VotesTab } from "src/views/Governance/components/ProposalPage/components/VotesTab";
import { toCapitalCase } from "src/views/Governance/helpers";

export const mapProposalStatus = (status: PStatus) => {
  switch (status) {
    case "active":
      return "success" as OHMChipProps["template"];
    case "executed":
      return "purple" as OHMChipProps["template"];
    case "discussion":
    case "ready to activate":
    case "ready to execute":
      return "userFeedback" as OHMChipProps["template"];
    case "closed":
    case "expired activation":
    case "expired execution":
      return "gray" as OHMChipProps["template"];
    case "draft":
      return "darkGray" as OHMChipProps["template"];
  }
};

export const proposalDateFormat = new Intl.DateTimeFormat([], {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZoneName: "short",
  hour: "numeric",
  minute: "numeric",
});

export const PageWrapper = ({ proposal }: { proposal: IAnyProposal }) => (
  <Box display="flex" justifyContent="center" width="100%">
    <Paper>
      <Box>
        <BackButton />
        <Grid container mb="10px">
          <Grid item sm={6}>
            <ProposalHeader proposal={proposal} />
          </Grid>
          <Grid display="flex" item sm={6} justifyContent="flex-end">
            <ActionButtons />
          </Grid>
        </Grid>
        <StatusBar proposal={proposal} />
        <CastVote proposal={proposal} />
        <Box display="flex" justifyContent="center">
          <Tabs value={false} centered textColor="primary" indicatorColor="primary">
            <Link component={NavLink} to={`/governance/proposals/${proposal.id}`} end>
              <Tab label={`Poll Detail`}></Tab>
            </Link>
            <Link component={NavLink} to={`/governance/proposals/${proposal.id}/votes`}>
              <Tab label={`Votes`}></Tab>
            </Link>
          </Tabs>
        </Box>
        <Grid className="proposal-tabs" container direction="column" alignItems="flex-start">
          <Outlet />
        </Grid>
      </Box>
    </Paper>
  </Box>
);

const TimeRemaining = ({ proposal }: { proposal: IAnyProposal }) => {
  console.log("timeRemaining const");
  const theme = useTheme();
  console.log("after useTheme");
  let boundedTimeRemaining = 0;
  // const earliest = 1668456876000
  // const deadline = 1668456996000
  // const now = 1668456906000; // must be activated within 1 minute
  // const now = 1668456816000; // can be activated in 3 minutes
  const now = Date.now();
  const timeRemainingDate = proposal.now.getTime() + proposal.timeRemaining;
  if (proposal.timeRemaining && timeRemainingDate - now > 0) {
    const timeRemainingDate = proposal.now.getTime() + proposal.timeRemaining;
    boundedTimeRemaining = (timeRemainingDate - now) / 1000;
  }

  console.log(
    "timeremaining",
    proposal.id,
    "now",
    now,
    proposal.state,
    proposal.nextDeadline,
    proposal.timeRemaining,
    boundedTimeRemaining,
  );
  return (
    <>
      <Icon name="timeLeft" style={{ fontSize: "10px", fill: theme.colors.gray[90] }} />
      <Typography ml="9px" variant="body2" color={theme.colors.gray[90]} lineHeight="18px">
        {proposal.state === "expired activation"
          ? `Activation Period Expired at ${proposalDateFormat.format(proposal.nextDeadline)}`
          : proposal.state === "discussion"
          ? `Can be activated in ${prettifySeconds(boundedTimeRemaining)}`
          : proposal.state === "ready to activate"
          ? `Must be activated within ${prettifySeconds(boundedTimeRemaining)}`
          : proposal.state === "active" && boundedTimeRemaining == 0
          ? `Vote Finished at ${proposalDateFormat.format(proposal.nextDeadline)}`
          : proposal.state === "active"
          ? `Ends in ${prettifySeconds(boundedTimeRemaining)}`
          : proposal.state === "closed"
          ? `Expired at ${proposalDateFormat.format(proposal.nextDeadline)}`
          : `Expired at ${proposalDateFormat.format(proposal.nextDeadline)}`}
      </Typography>
    </>
  );
};

const ProposalHeader = (props: { proposal: IAnyProposal }) => {
  const { proposal } = props;
  const theme = useTheme();

  const formattedPublishedDate = proposalDateFormat.format(proposal.submissionTimestamp);

  return (
    <Grid container direction="column" pt="9px" mb="9px">
      <Grid item>
        <Typography lineHeight="18px" variant="body2" color={theme.colors.gray[90]}>
          Posted on <span style={{ color: theme.colors.gray[40] }}>{formattedPublishedDate}</span> by:{" "}
          <span style={{ color: theme.colors.gray[40] }}>{shorten(proposal.submitter)}</span>
        </Typography>
      </Grid>
      <Grid item>
        <Typography fontSize="24px" lineHeight="32px" fontWeight={700}>
          {proposal.title}
        </Typography>
      </Grid>
      <Box display="flex" flexDirection="row" mt="4px">
        <Chip label={toCapitalCase(proposal.state)} template={mapProposalStatus(proposal.state)} strong />
        <Box pl="9px" display="flex" alignItems="center">
          {proposal && <TimeRemaining proposal={proposal} />}
        </Box>
      </Box>
    </Grid>
  );
};

export const ProposalPage: FC = () => {
  const { passedId } = useParams();
  const proposalId = useMemo(() => {
    if (!passedId) return -1;
    return parseInt(passedId);
  }, [passedId]);

  const { data: proposal, isLoading } = useProposal(proposalId);
  return (
    <>
      {!isLoading && !!proposal && (
        <Routes>
          <Route path="/" element={<PageWrapper proposal={proposal} />}>
            <Route index element={<PollDetailsTab proposal={proposal} />} />
            <Route path="votes" element={<VotesTab proposal={proposal} />} />
          </Route>
        </Routes>
      )}
    </>
  );
};
