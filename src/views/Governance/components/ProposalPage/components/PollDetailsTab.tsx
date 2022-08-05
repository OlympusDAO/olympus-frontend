import { Box } from "@mui/material";
import { Paper, TertiaryButton } from "@olympusdao/component-library";
import { ProposalTabProps } from "src/views/Governance/interfaces";

import { MarkdownPreview } from "../../MarkdownPreview";

export const PollDetailsTab = ({ proposal }: ProposalTabProps) => {
  return (
    <Paper enableBackground fullWidth>
      <Box display="flex" flexDirection="column">
        <MarkdownPreview content={proposal.content} />

        <Box display="flex" flexDirection="row" justifyContent="flex-end">
          <TertiaryButton target="_blank" href={proposal.uri}>
            Discussion
          </TertiaryButton>
        </Box>
      </Box>
    </Paper>
  );
};
