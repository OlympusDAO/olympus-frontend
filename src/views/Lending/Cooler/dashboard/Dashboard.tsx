import { Grid, Paper, useMediaQuery, useTheme } from "@mui/material";
import { UtilisationGraph } from "src/views/Lending/Cooler/dashboard/UtilisationGraph";

export const CoolerDashboard = () => {
  const theme = useTheme();
  const hidePaperSidePadding = useMediaQuery(theme.breakpoints.down("md"));

  const paperProps = {
    fullWidth: true,
    enableBackground: true,
  };

  /**
   * We minimise padding on the left and right at smaller screen sizes, in order
   * to maximise space for the graph.
   */
  const paperStyles = {
    ...(hidePaperSidePadding && { paddingLeft: "10px", paddingRight: "10px" }),
  };

  return (
    <div id="cooler-metrics">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper {...paperProps} style={paperStyles}>
            <UtilisationGraph />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper {...paperProps} style={paperStyles}>
            {/* Revenue */}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper {...paperProps} style={paperStyles}>
            {/* Loan Maturity */}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
