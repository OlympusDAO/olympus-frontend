import { t, Trans } from "@lingui/macro";
import { Grid, Link, SvgIcon, Tooltip, Typography } from "@mui/material";
import { Modal } from "@olympusdao/component-library";
import React from "react";
import { ResponsiveContainer } from "recharts";
import { ReactComponent as GraphLogo } from "src/assets/icons/graph-grt-logo.svg";

function ExpandedChart({
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
  data: any[];
  infoTooltipMessage: string;
  headerText: string;
  headerSubText: string;
  runwayExtraInfo?: string;
  subgraphQueryUrl?: string;
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
            <Typography variant="h4" color="textSecondary" style={{ fontWeight: 400 }}>
              <Trans>Today</Trans>
            </Typography>
          </Grid>
          {subgraphQueryUrl && (
            <Grid item xs textAlign="right" marginRight="15px">
              <Link href={subgraphQueryUrl} target="_blank" rel="noopener noreferrer">
                <Tooltip title={t`Open Subgraph Query`}>
                  <SvgIcon component={GraphLogo} viewBox="0 0 100 100" style={{ width: "16px", height: "16px" }} />
                </Tooltip>
              </Link>
            </Grid>
          )}
        </Grid>
      }
    >
      <Grid container direction="column" style={{ height: "600px" }}>
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
