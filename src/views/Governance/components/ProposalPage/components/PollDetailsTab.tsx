import { Grid } from "@mui/material";
import { TextButton } from "@olympusdao/component-library";
import { ProposalTabProps } from "src/views/Governance/interfaces";

import { MarkdownPreview } from "../../MarkdownPreview";

export const PollDetailsTab = ({ proposal }: ProposalTabProps) => {
  return (
    <Grid container direction="column">
      <Grid item>
        <MarkdownPreview content={proposal.content} />
      </Grid>
      <Grid className="discussion-button" item>
        <TextButton href={proposal.uri} endIconName="arrow-up">
          Discussion
        </TextButton>
      </Grid>
    </Grid>
  );
};
