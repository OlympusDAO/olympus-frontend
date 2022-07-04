import { Trans } from "@lingui/macro";
import { Box, Grid, Typography } from "@mui/material";
import { Modal } from "@olympusdao/component-library";
import React from "react";
import { ResponsiveContainer } from "recharts";

function ExpandedChart({
  open,
  handleClose,
  renderChart,
  data,
  infoTooltipMessage,
  headerText,
  headerSubText,
  runwayExtraInfo,
}: {
  open: boolean;
  handleClose: () => void;
  renderChart: React.ReactElement;
  data: any[];
  infoTooltipMessage: string;
  headerText: string;
  headerSubText: string;
  runwayExtraInfo?: string;
}) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      closePosition={"right"}
      minHeight={"50%"}
      maxWidth={"90%"}
      headerContent={
        <Grid className="chart-card-header" container width="100%">
          <Grid alignItems="center" width="maxContent" container item whiteSpace="nowrap">
            <Typography variant="h6" color="textSecondary" style={{ fontWeight: 400 }}>
              {headerText}
            </Typography>
          </Grid>
          <Box display="flex" flexWrap="wrap">
            <Typography variant="h4" style={{ fontWeight: 600, marginRight: 5 }}>
              {headerSubText}
            </Typography>
            {runwayExtraInfo}
            <Typography variant="h4" color="textSecondary" style={{ fontWeight: 400 }}>
              <Trans>Today</Trans>
            </Typography>
          </Box>
        </Grid>
      }
    >
      <Grid container direction="column">
        <Grid item xs={10}>
          {data && data.length > 0 && (
            <ResponsiveContainer minHeight={260} minWidth={300}>
              {renderChart}
            </ResponsiveContainer>
          )}
        </Grid>
        <Grid item xs={2}>
          <Typography variant="h6">{infoTooltipMessage}</Typography>
        </Grid>
      </Grid>
    </Modal>
  );
}

export default ExpandedChart;
