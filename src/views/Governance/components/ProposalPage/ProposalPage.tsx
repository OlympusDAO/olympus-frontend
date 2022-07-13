import "./ProposalPage.scss";

import { t } from "@lingui/macro";
import { Grid, Typography } from "@mui/material";
import { Paper, Tab, Tabs, TertiaryButton, TextButton } from "@olympusdao/component-library";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useProposal } from "src/hooks/useProposal";
import { Proposal as ProposalType } from "src/hooks/useProposals";

import { NULL_PROPOSAL } from "../../constants";

export const ProposalPage = () => {
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

  return (
    <div className="proposal-page">
      <Paper>
        <Grid className="page-content" container direction="column">
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
              <TextButton startIconName="x">Back</TextButton>
            </Grid>
            <Grid item>
              <TertiaryButton>Create new proposal</TertiaryButton>
            </Grid>
          </Grid>
          <Grid className="proposal-header" container direction="column">
            <Grid item>
              <Typography variant="body2">
                Posted on {proposal.submissionTimestamp} by {proposal.proposer}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5">{proposal.proposalName}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">{proposal.isActive}</Typography>
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
