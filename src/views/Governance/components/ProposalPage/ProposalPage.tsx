import "./ProposalPage.scss";

import { t } from "@lingui/macro";
import { Grid, Typography, useTheme } from "@mui/material";
import { Chip, OHMChipProps, Paper, Tab, Tabs, TertiaryButton, TextButton } from "@olympusdao/component-library";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { shorten } from "src/helpers";
import { useProposal } from "src/hooks/useProposal";
import { Proposal as ProposalType } from "src/hooks/useProposals";

import { NULL_PROPOSAL } from "../../constants";

export const ProposalPage = () => {
  const theme = useTheme();

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
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid className="back-button" item>
              <TextButton startIconName="x">Back</TextButton>
            </Grid>
            <Grid item>
              <TertiaryButton>Create new proposal</TertiaryButton>
            </Grid>
          </Grid>
          <Grid className="proposal-header" container direction="column">
            <Grid item>
              <Typography className="published-date" variant="body2" color={theme.colors.gray[90]}>
                Posted on {formattedPublishedDate} by {shorten(proposal.proposer)}
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
          <Grid className="proposal-tabs" container>
            <Tabs>
              <Tab label={t`Poll Detail`}></Tab>
              <Tab label={t`Votes`}></Tab>
            </Tabs>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
