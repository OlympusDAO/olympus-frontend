import { Box, Grid, GridSize } from "@mui/material";
import { Children } from "react";
import { ReactElement } from "react-markdown/lib/react-markdown";

/**
 * Metrics Collection. Takes in Metric Component and properly them across the grid.
 */
const MetricCollection = ({ children }: { children: JSX.Element | ReactElement }) => {
  // Based on Number of Children, determine each rows grid width
  const numOfMetrics = Children.count(children);
  let numPerRow = (12 / numOfMetrics) as GridSize;
  if (numOfMetrics > 3) {
    numPerRow = 4;
  }
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems={{ xs: "left", sm: "center" }}>
      <Grid container spacing={2} alignItems="flex-end">
        {Children.map(children, child => (
          <Grid item xs={12} sm={numPerRow}>
            {child}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default MetricCollection;
