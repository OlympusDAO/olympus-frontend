import "./ProposalPage.scss";

import { t } from "@lingui/macro";
import { Grid, Link, Typography, useTheme } from "@mui/material";
import {
  Chip,
  OHMChipProps,
  Paper,
  SecondaryButton,
  Tab,
  TabPanel,
  Tabs,
  TextButton,
} from "@olympusdao/component-library";
import { useMemo, useState } from "react";
import { NavLink as RouterLink, useParams } from "react-router-dom";
import { shorten } from "src/helpers";
import { useProposal } from "src/hooks/useProposal";
import { Proposal as ProposalType } from "src/hooks/useProposals";

import { NULL_PROPOSAL } from "../../constants";

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

  return (
    <div className="proposal-page">
      <Paper>
        <Grid className="page-content" container direction="column">
          <Grid className="navigation" container direction="row" justifyContent="space-between" alignItems="center">
            <Grid className="back-button" item>
              <Link to="/governancetest" component={RouterLink}>
                <TextButton startIconName="x">Back</TextButton>
              </Link>
            </Grid>
            <Grid item>
              <SecondaryButton>Create new proposal</SecondaryButton>
            </Grid>
          </Grid>
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
            <Grid item>
              <Chip label="Active" template={mapStatus("active")} strong />
            </Grid>
          </Grid>
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
              <Grid item>
                <Typography variant="body1">{proposal.content}</Typography>
              </Grid>
            </TabPanel>
            <TabPanel value={selectedIndex} index={1}>
              <Grid item>Votes will go here</Grid>
            </TabPanel>
          </Grid>
          <Grid className="discussion-button" item>
            <TextButton endIconName="arrow-up">Discussion</TextButton>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
