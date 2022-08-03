import { Grid } from "@mui/material";
import { TextButton } from "@olympusdao/component-library";
import MarkdownIt from "markdown-it";
import { ProposalTabProps } from "src/views/Governance/interfaces";

export const PollDetailsTab = ({ proposal }: ProposalTabProps) => {
  const getRenderedDetails = () => {
    console.log(proposal?.content);
    return {
      __html: MarkdownIt({ linkify: true, typographer: true }).render(proposal ? proposal.content : ""),
    };
  };

  return (
    <Grid container direction="column">
      <Grid item>
        {/* TODO(appleseed): ... verify this is ok, XSS security wise */}
        <div dangerouslySetInnerHTML={getRenderedDetails()} />
      </Grid>
      <Grid className="discussion-button" item>
        <TextButton href={proposal.uri} endIconName="arrow-up">
          Discussion
        </TextButton>
      </Grid>
    </Grid>
  );
};
