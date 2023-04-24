import { Grid, Link, SvgIcon, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Modal, Tooltip } from "@olympusdao/component-library";
import React, { useEffect } from "react";
import { ResponsiveContainer } from "recharts";
import { ReactComponent as GraphLogo } from "src/assets/icons/graph-grt-logo.svg";

const ExpandedChart = ({
  open,
  handleClose,
  renderChart,
  data,
  infoTooltipMessage,
  headerText,
  headerSubText,
  runwayExtraInfo,
  subgraphQueryUrl,
}: {
  open: boolean;
  handleClose: () => void;
  renderChart: React.ReactElement;
  data: Record<string, unknown>[];
  infoTooltipMessage: string;
  headerText: string;
  headerSubText: string;
  runwayExtraInfo?: string;
  subgraphQueryUrl?: string;
}) => {
  /**
   * Ensure that the expanded chart modal closes when pressing escape.
   *
   * This should theoretically be handled by the `Modal` component, but it isn't.
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) handleClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, open]);

  // Setting relative (percentage) values doesn't work very well with ResponsiveContainer, so we do a manual calculation.
  const windowHeight = window.screen.height;
  const modalHeight = 0.7 * windowHeight;
  const chartHeight = 0.7 * modalHeight;

  const theme = useTheme();
  const hidePaperSidePadding = useMediaQuery(theme.breakpoints.down("md"));

  /**
   * We minimise padding on the left and right at smaller screen sizes, in order
   * to maximise space for the graph.
   */
  const paperStyles = {
    ...(hidePaperSidePadding && { paddingLeft: "10px", paddingRight: "10px" }),
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closePosition={"right"}
      minHeight={modalHeight + "px"}
      maxWidth={"90%"}
      headerContent={
        <Grid container width="100%">
          <Grid alignItems="center" width="maxContent" item xs={12} whiteSpace="nowrap">
            <Typography variant="h6" color="textSecondary" style={{ fontWeight: 400 }}>
              {headerText}
            </Typography>
          </Grid>
          <Grid item container xs={11}>
            <Typography variant="h4" style={{ fontWeight: 600, marginRight: 5, display: "block" }}>
              {headerSubText}
            </Typography>
            {runwayExtraInfo}
          </Grid>
          {subgraphQueryUrl && (
            <Grid item xs textAlign="right" marginRight="15px">
              <Link href={subgraphQueryUrl} target="_blank" rel="noopener noreferrer">
                <Tooltip message={`Open Subgraph Query`} />
                <SvgIcon component={GraphLogo} viewBox="0 0 100 100" style={{ width: "16px", height: "16px" }} />
              </Link>
            </Grid>
          )}
        </Grid>
      }
      sx={{
        "& .Modal-paper": paperStyles,
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          {data && data.length > 0 && (
            /**
             * Setting the width to 99% ensures that the chart resizes correctly.
             *
             * Source: https://stackoverflow.com/a/53205850
             */
            <ResponsiveContainer width="99%" height={chartHeight} minWidth={300}>
              {renderChart}
            </ResponsiveContainer>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{infoTooltipMessage}</Typography>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default ExpandedChart;
