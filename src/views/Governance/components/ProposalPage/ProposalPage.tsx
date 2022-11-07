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
import { PollDetailsTab } from "src/views/Governance/components/ProposalPage/components/PollDetailsTab";
import { VotesTab } from "src/views/Governance/components/ProposalPage/components/VotesTab";
import { NULL_PROPOSAL } from "src/views/Governance/constants";
import { toCapitalCase } from "src/views/Governance/helpers";

export const ProposalPage: FC = () => {
  const { passedId } = useParams();
  const proposalId = useMemo(() => {
    if (!passedId) return -1;
    return parseInt(passedId);
  }, [passedId]);

  const _useProposal = useProposal(proposalId);
  const proposal: IAnyProposal = useMemo(() => {
    if (_useProposal.isLoading || !_useProposal.data) return NULL_PROPOSAL;
    return _useProposal.data;
  }, [_useProposal]);
  return (
    <>
      <Routes>
        <Route path="/" element={<PageWrapper proposal={proposal} />}>
          <Route index element={<PollDetailsTab proposal={proposal} />} />
          <Route path="votes" element={<VotesTab proposal={proposal} />} />
        </Route>
      </Routes>
    </>
  );
};

export const PageWrapper = (props: { proposal: IAnyProposal }) => (
  <Box display="flex" justifyContent="center" width="100%">
    <Paper>
      <Box>
        <BackButton />
        <Grid container mb="10px">
          <Grid item sm={6}>
            <ProposalHeader proposal={props.proposal} />
          </Grid>
          <Grid display="flex" item sm={6} justifyContent="flex-end">
            <ActionButtons />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="center">
          <Tabs value={false} centered textColor="primary" indicatorColor="primary">
            <Link component={NavLink} to={`/governance/proposals/${props.proposal.id}`} end>
              <Tab label={`Poll Detail`}></Tab>
            </Link>
            <Link component={NavLink} to={`/governance/proposals/${props.proposal.id}/votes`}>
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

const ProposalHeader = (props: { proposal: IAnyProposal }) => {
  const { proposal } = props;
  const theme = useTheme();
  const dateFormat = new Intl.DateTimeFormat([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZoneName: "short",
    hour: "numeric",
    minute: "numeric",
  });
  const mapStatus = (status: PStatus) => {
    switch (status) {
      case "active":
        return "success" as OHMChipProps["template"];
      case "endorsement":
        return "purple" as OHMChipProps["template"];
      case "discussion":
        return "userFeedback" as OHMChipProps["template"];
      case "closed":
        return "gray" as OHMChipProps["template"];
      case "draft":
        return "darkGray" as OHMChipProps["template"];
    }
  };
  const formattedPublishedDate = dateFormat.format(proposal.submissionTimestamp);

  let boundedTimeRemaining = 0;
  if (proposal.timeRemaining && proposal.timeRemaining - Date.now() > 0) {
    boundedTimeRemaining = (proposal.timeRemaining - Date.now()) / 1000;
  }

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
        <Chip label={toCapitalCase(proposal.state)} template={mapStatus(proposal.state)} strong />
        <Box pl="9px" display="flex" alignItems="center">
          {proposal.timeRemaining && (
            <>
              <Icon name="timeLeft" style={{ fontSize: "10px", fill: theme.colors.gray[90] }} />
              <Typography ml="9px" variant="body2" color={theme.colors.gray[90]} lineHeight="18px">
                {boundedTimeRemaining == 0 ? `Vote Finished` : `Ends in ${prettifySeconds(boundedTimeRemaining)}`}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Grid>
  );
};
