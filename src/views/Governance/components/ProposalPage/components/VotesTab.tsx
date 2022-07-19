import { Grid, OutlinedInput, Typography, useTheme } from "@mui/material";
import { PrimaryButton, Radio, VoteBreakdown } from "@olympusdao/component-library";
import { ProposalTabProps } from "src/views/Governance/interfaces";

export const VotesTab = ({ proposal }: ProposalTabProps) => {
  const theme = useTheme();

  return (
    <Grid container direction="column">
      <Grid className="cast-vote-header" item>
        <Typography variant="h6">Cast your vote</Typography>
      </Grid>
      <Grid className="install-location" item>
        <Typography variant="body2" color={theme.colors.gray[90]}>
          Your Yes vote will be approving the policy at{" "}
          <span style={{ color: theme.colors.gray[40] }}>this location</span>
        </Typography>
      </Grid>
      <Grid className="vote-submission-section" container direction="row" alignItems="center" spacing={2}>
        <Grid item xs={3}>
          <Radio label="Yes" />
          <Radio label="No" />
        </Grid>
        <Grid item xs={6}>
          <OutlinedInput className="your-comment" placeholder="Your comment (Optional)" />
        </Grid>
        <Grid item xs={3}>
          <PrimaryButton fullWidth>Vote</PrimaryButton>
        </Grid>
      </Grid>
      <Grid className="vote-breakdown" item>
        <VoteBreakdown
          voteForLabel="Yes"
          voteAgainstLabel="No"
          voteAbstainLabel="Abstain"
          voteForCount={proposal.yesVotes}
          voteAgainstCount={proposal.noVotes}
          voteAbstainCount={0}
        />
      </Grid>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="h6">Top Voters</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
