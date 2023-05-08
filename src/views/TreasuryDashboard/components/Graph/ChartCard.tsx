import { Grid, Link, Skeleton, SvgIcon, Typography } from "@mui/material";
import { InfoTooltip, Tooltip } from "@olympusdao/component-library";
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
  height?: number;
  children?: React.ReactNode;
};

export const DEFAULT_HEIGHT = 400;

export const ChartCard: React.FC<ChartCardProps> = props => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent="space-between" alignItems="flex-start">
          <Grid item xs={11}>
            <Typography variant="h6" color="textSecondary" display="inline">
              {props.headerText}
            </Typography>
            {props.headerTooltip && <InfoTooltip message={props.headerTooltip} />}
          </Grid>
          <Grid item xs={1}>
            <Grid container spacing={1} justifyContent="flex-end">
              <Grid item>
                {props.subgraphQueryUrl && (
                  <Link href={props.subgraphQueryUrl} target="_blank" rel="noopener noreferrer">
                    <Tooltip message={`Open Subgraph Query`} />
                    <SvgIcon component={GraphLogo} viewBox="0 0 100 100" style={{ width: "16px", height: "16px" }} />
                  </Link>
                )}
              </Grid>
              <Grid item>
                {props.handleOpenExpandedChart && (
                  <>
                    <Tooltip message={`Open in Expanded View`} />
                    <SvgIcon
                      component={Fullscreen}
                      color="primary"
                      onClick={props.handleOpenExpandedChart}
                      style={{ fontSize: "1rem", cursor: "pointer" }}
                    />
                  </>
                )}
              </Grid>
            </Grid>
          </Grid>
          {props.expandedChart}
        </Grid>
        <Grid item xs={12}>
          {props.isLoading ? (
            <Skeleton variant="text" width={100} />
          ) : (
            <Typography variant="h4" fontWeight={600}>
              {props.headerSubtext}
            </Typography>
          )}
        </Grid>
      </Grid>
      {/* We shift the Grid item left and make it wider to ensure that the x-axis labels are aligned with the header & subtext. */}
      <Grid item xs={13} marginLeft={"-10px"}>
        {props.isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={props.height || DEFAULT_HEIGHT} />
        ) : (
          props.children
        )}
      </Grid>
    </Grid>
  );
};
