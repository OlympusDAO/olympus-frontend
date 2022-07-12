import "src/components/Chart/chart.scss";

import { t } from "@lingui/macro";
import { Box, Grid, Link, Skeleton, SvgIcon, Tooltip, Typography } from "@mui/material";
import { InfoTooltip } from "@olympusdao/component-library";
import { ReactElement } from "react";
import { ReactComponent as Fullscreen } from "src/assets/icons/fullscreen.svg";
import { ReactComponent as GraphLogo } from "src/assets/icons/graph-grt-logo.svg";

type ChartCardProps = {
  headerText: string;
  headerTooltip?: string;
  headerSubtext?: string;
  subgraphQueryUrl?: string;
  expandedChart?: ReactElement;
  handleOpenExpandedChart?(): void;
  isLoading: boolean;
};

export const ChartCard: React.FC<ChartCardProps> = props => {
  return (
    <Box style={{ width: "100%", height: "100%" }}>
      <div className="chart-card-header">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          style={{ width: "100%", overflow: "hidden" }}
        >
          <Box display="flex" width="90%" alignItems="center">
            <Typography
              variant="h6"
              color="textSecondary"
              className="card-title-text"
              style={{ fontWeight: 400, overflow: "hidden" }}
            >
              {props.headerText}
            </Typography>
            {props.headerTooltip && (
              <Typography variant={"h6"} color="textSecondary">
                <InfoTooltip message={props.headerTooltip} />
              </Typography>
            )}
          </Box>

          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                {props.subgraphQueryUrl && (
                  <Link href={props.subgraphQueryUrl} target="_blank" rel="noopener noreferrer">
                    <Tooltip title={t`Open Subgraph Query`}>
                      <SvgIcon component={GraphLogo} viewBox="0 0 100 100" style={{ width: "16px", height: "16px" }} />
                    </Tooltip>
                  </Link>
                )}
              </Grid>
              <Grid item>
                {props.handleOpenExpandedChart && (
                  <Tooltip title={t`Open in expanded view`}>
                    <SvgIcon
                      component={Fullscreen}
                      color="primary"
                      onClick={props.handleOpenExpandedChart}
                      style={{ fontSize: "1rem", cursor: "pointer" }}
                    />
                  </Tooltip>
                )}
              </Grid>
            </Grid>
          </Grid>
          {props.expandedChart}
        </Box>
        {props.isLoading ? (
          <Skeleton variant="text" width={100} />
        ) : (
          <Box display="flex">
            <Typography variant="h4" style={{ fontWeight: 600, marginRight: 5 }}>
              {props.isLoading ? <Skeleton variant="text" /> : props.headerSubtext}
            </Typography>
          </Box>
        )}
      </div>
      <Box width="100%" minHeight={260} minWidth={310} className="ohm-chart">
        {props.isLoading ? <Skeleton variant="rectangular" width="100%" height={260} /> : props.children}
      </Box>
    </Box>
  );
};
