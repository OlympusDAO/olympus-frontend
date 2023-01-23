import { Grid, Typography } from "@mui/material";

/**
 * React Component that renders the contents of a Markdown file
 * and displays them in a notification banner.
 */
const KnownIssues = (): JSX.Element => {
  return (
    <Grid container>
      <Grid item xs={12} textAlign="center">
        {/* Consistent with heading titles of the other components in the TreasuryDashboard. See ChartCard. */}
        <Typography variant="h6" color="textSecondary" display="inline">
          Disclaimers
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
        style={{
          maxWidth: "80ch", // Limit width and improve readability
          margin: "0 auto", // Centers
        }}
      >
        <li>
          Illiquid assets have been removed from market value and will be re-introduced when they reach their date of
          maturity
        </li>
        <li>Due to technical limitations, the balance and value of native ETH is not included</li>
        <li>There may be a visible delay when capital is deployed to a new contract or blockchain</li>
        <li>
          The timestamp shown in each tooltip represents the time of the most recently-indexed block across all chains
        </li>
      </Grid>
    </Grid>
  );
};

export default KnownIssues;
