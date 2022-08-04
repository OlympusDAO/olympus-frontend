import { Grid, styled } from "@mui/material";
import { TextButton } from "@olympusdao/component-library";
import ReactMarkdown from "react-markdown";
import { ProposalTabProps } from "src/views/Governance/interfaces";

export const PollDetailsTab = ({ proposal }: ProposalTabProps) => {
  const StyledGridItem = styled(Grid)(() => ({
    "p > img": {
      maxWidth: "100%",
    },
  }));

  return (
    <Grid container direction="column">
      <StyledGridItem item>
        <ReactMarkdown children={proposal.content} />
      </StyledGridItem>
      <Grid className="discussion-button" item>
        <TextButton href={proposal.uri} endIconName="arrow-up">
          Discussion
        </TextButton>
      </Grid>
    </Grid>
  );
};
