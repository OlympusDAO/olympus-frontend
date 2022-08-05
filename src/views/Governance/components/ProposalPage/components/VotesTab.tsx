import { Box, Typography, useTheme } from "@mui/material";
import { Metric, PrimaryButton, SecondaryButton, TertiaryButton, VoteBreakdown } from "@olympusdao/component-library";
// import { PrimaryButton, Radio, VoteBreakdown } from "@olympusdao/component-library";
import { ProposalTabProps } from "src/views/Governance/interfaces";

export const VotesTab = ({ proposal }: ProposalTabProps) => {
  const theme = useTheme();

  return (
    <>
      {" "}
      <Box borderRadius="6px" padding="18px" sx={{ backgroundColor: theme.colors.gray[700] }}>
        <Box display="flex" flexDirection="column">
          <Typography fontSize="15px" fontWeight={500} lineHeight="24px">
            Cast your vote
          </Typography>
        </Box>
        <Metric label="Your voting power" metric={"15,530.00 OHM"} />
        <Box display="flex" flexDirection="row" justifyContent="center">
          <SecondaryButton sx={{ minWidth: "120px" }}>Yes</SecondaryButton>
          <TertiaryButton sx={{ minWidth: "120px" }}>No</TertiaryButton>
        </Box>
        <Box display="flex" flexDirection="row" justifyContent="center">
          <PrimaryButton sx={{ minWidth: "120px" }}>Vote</PrimaryButton>
        </Box>
      </Box>
      <VoteBreakdown
        voteForLabel="Yes"
        voteAgainstLabel="No"
        voteParticipationLabel="Total Participants"
        voteForCount={proposal.yesVotes}
        voteAgainstCount={proposal.noVotes}
        totalHoldersCount={0}
        quorum={0}
      />
    </>

    // <Grid container direction="column">
    //   <Grid className="cast-vote-header" item>
    //     <Typography variant="h6">Cast your vote</Typography>
    //   </Grid>
    //   <Grid className="install-location" item>
    //     <Typography variant="body2" color={theme.colors.gray[90]}>
    //       Your Yes vote will be approving the policy at{" "}
    //       <span style={{ color: theme.colors.gray[40] }}>this location</span>
    //     </Typography>
    //   </Grid>
    //   <Grid className="vote-submission-section" container direction="row" alignItems="center" spacing={2}>
    //     <Grid item xs={3}>
    //       <Radio label="Yes" />
    //       <Radio label="No" />
    //     </Grid>
    //     <Grid item xs={6}>
    //       <OutlinedInput className="your-comment" placeholder="Your comment (Optional)" />
    //     </Grid>
    //     <Grid item xs={3}>
    //       <PrimaryButton fullWidth>Vote</PrimaryButton>
    //     </Grid>
    //   </Grid>
    //   <Grid className="vote-breakdown" item>
    //     <VoteBreakdown
    //       voteForLabel="Yes"
    //       voteAgainstLabel="No"
    //       voteAbstainLabel="Abstain"
    //       voteForCount={proposal.yesVotes}
    //       voteAgainstCount={proposal.noVotes}
    //       voteAbstainCount={0}
    //     />
    //   </Grid>
    //   <Grid container direction="column">
    //     <Grid item>
    //       <Typography variant="h6">Top Voters</Typography>
    //     </Grid>
    //   </Grid>
    // </Grid>
  );
};
