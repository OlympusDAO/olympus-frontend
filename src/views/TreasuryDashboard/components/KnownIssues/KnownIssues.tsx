import { Trans } from "@lingui/macro";
import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import MarkdownContent from "src/views/TreasuryDashboard/components/KnownIssues/content.md";

/**
 * React Component that renders the contents of a Markdown file
 * and displays them in a notification banner.
 */
const KnownIssues = (): JSX.Element => {
  const [warningContent, setWarningContent] = useState("");

  // On component mounting, load the content from the Markdown file
  useEffect(() => {
    fetch(MarkdownContent)
      .then(res => res.text())
      .then(md => setWarningContent(md));
  }, []);

  return (
    <Grid container sx={{ maxWidth: "80ch" }}>
      <Grid item xs={12}>
        {/* Consistent with heading titles of the other components in the TreasuryDashboard. See ChartCard. */}
        <Typography variant="h6" color="textSecondary" display="inline">
          <Trans>Disclaimers</Trans>
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          // Consistent with the fontSize of TreasuryAssetsTable
          fontSize: "14px",
          lineHeight: "20px",
        }}
      >
        <ReactMarkdown children={warningContent} />
      </Grid>
    </Grid>
  );
};

export default KnownIssues;
