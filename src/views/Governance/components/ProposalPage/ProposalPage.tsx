import "./ProposalPage.scss";

import { t } from "@lingui/macro";
import { Box, Grid, Link, Typography, useTheme } from "@mui/material";
import { Chip, Icon, OHMChipProps, Paper, SecondaryButton, Tab, TabPanel, Tabs } from "@olympusdao/component-library";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { shorten } from "src/helpers";
import { useProposal } from "src/hooks/useProposal";
import { Proposal as ProposalType } from "src/hooks/useProposals";

import { NULL_PROPOSAL } from "../../constants";
import { toCapitalCase } from "../../helpers";
import { BackButton } from "../BackButton";
import { PollDetailsTab } from "./components/PollDetailsTab";
import { VotesTab } from "./components/VotesTab";

export const ProposalPage = () => {
  const theme = useTheme();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const { passedId } = useParams();
  const proposalId = useMemo(() => {
    if (!passedId) return -1;
    return parseInt(passedId);
  }, [passedId]);

  const _useProposal = useProposal(proposalId);
  const proposal: ProposalType = useMemo(() => {
    if (_useProposal.isLoading || !_useProposal.data) return NULL_PROPOSAL;
    return _useProposal.data;
  }, [_useProposal]);

  const dateFormat = new Intl.DateTimeFormat([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZoneName: "short",
    hour: "numeric",
    minute: "numeric",
  });
  const formattedPublishedDate = dateFormat.format(proposal.submissionTimestamp);

  const mapStatus = (status: string) => {
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

  const proposalHeader = () => {
    return (
      <Grid className="proposal-header" container direction="column">
        <Grid item>
          <Typography className="published-date" variant="body2" color={theme.colors.gray[90]}>
            Posted on <span style={{ color: theme.colors.gray[40] }}>{formattedPublishedDate}</span> by:{" "}
            <span style={{ color: theme.colors.gray[40] }}>{shorten(proposal.proposer)}</span>
          </Typography>
        </Grid>
        <Grid item>
          <Typography className="proposal-title" variant="h4">
            {proposal.proposalName}
          </Typography>
        </Grid>
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <Chip label={toCapitalCase(proposal.state)} template={mapStatus(proposal.state)} strong />
          </Grid>
          <Grid item>
            <Box pl="9px" display="flex">
              <Icon name="timeLeft" style={{ fontSize: "18px", fill: theme.colors.gray[90] }} />
              <Typography ml="9px" variant="body2" color={theme.colors.gray[90]} lineHeight="18px">
                Ends in 12 hours
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <div className="proposal-page">
      <Paper>
        <Grid className="page-content" container direction="column">
          <Grid className="navigation" container direction="row" justifyContent="space-between" alignItems="center">
            <BackButton />
            <Grid item>
              <Link to="/governancetest/create-proposal" component={RouterLink}>
                <SecondaryButton>Create new proposal</SecondaryButton>
              </Link>
            </Grid>
          </Grid>
          {proposalHeader()}
          <Grid className="proposal-tabs" container direction="column" alignItems="flex-start">
            <Tabs
              centered
              value={selectedIndex}
              TabIndicatorProps={{ style: { display: "none" } }}
              onChange={(_, view: number) => setSelectedIndex(view)}
            >
              <Tab label={t`Poll Detail`}></Tab>
              <Tab label={t`Votes`}></Tab>
            </Tabs>

            <TabPanel value={selectedIndex} index={0}>
              <PollDetailsTab proposal={proposal} />
            </TabPanel>
            <TabPanel value={selectedIndex} index={1}>
              <VotesTab proposal={proposal} />
            </TabPanel>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
