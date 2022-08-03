import { Grid, Typography } from "@mui/material";
import { TextButton } from "@olympusdao/component-library";
import { ProposalTabProps } from "src/views/Governance/interfaces";

export const PollDetailsTab = ({ proposal }: ProposalTabProps) => {
  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="body1">{proposal.content}</Typography>
      </Grid>
      <Grid className="discussion-button" item>
        <TextButton href={proposal.uri} endIconName="arrow-up">
          Discussion
        </TextButton>
      </Grid>
    </Grid>
  );
};
