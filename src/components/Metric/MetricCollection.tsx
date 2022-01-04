import { Children } from "react";
import { Grid, Box, GridSize } from "@material-ui/core";
import Metric from "./Metric";

/**
 * Metrics Collection. Takes in Metric Component and properly them across the grid.
 */
interface MetricCollectionProps {
  children: React.ReactElement<typeof Metric> | React.ReactElement<typeof Metric>[];
}
const MetricCollection = (props: MetricCollectionProps) => {
  //Based on Number of Children, determine each rows grid width
  const numOfMetrics = Children.count(props.children);
  let numPerRow = (12 / numOfMetrics) as GridSize;
  if (numOfMetrics > 3) {
    numPerRow = 4;
  }
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems={{ xs: "left", sm: "center" }}>
      <Grid container spacing={2} alignItems="flex-end">
        {Children.map(props.children, child => (
          <Grid item xs={12} sm={numPerRow}>
            {child}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default MetricCollection;
