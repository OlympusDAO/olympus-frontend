import { Box, Typography, TypographyTypeMap } from "@mui/material";
import { Skeleton, SkeletonTypeMap } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, ReactElement } from "react";
import InfoTooltip from "src/components/library/InfoTooltip";
const PREFIX = "Metric";

const classes = {
  root: `${PREFIX}-root`,
  label: `${PREFIX}-label`,
  metric: `${PREFIX}-metric`,
};

const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    textOverflow: "ellipsis",
    overflow: "hidden",
    "& h4": {
      fontWeight: 500,
    },
  },

  [`& .${classes.label}`]: {
    fontSize: "18px",
    lineHeight: "28px",
    color: theme.palette.text.secondary,
  },
}));

export interface OHMMetricProps {
  className?: string;
  label?: string;
  metric?: string | ReactElement;
  isLoading?: boolean;
  labelVariant?: TypographyTypeMap["props"]["variant"];
  metricVariant?: TypographyTypeMap["props"]["variant"];
  tooltip?: string;
  loadingWidth?: SkeletonTypeMap["props"]["width"];
}

/**
 * Primary Metric Component for UI. Presents a label and metric with optional tooltip.
 */
const Metric: FC<OHMMetricProps> = ({ className = "", metricVariant = "h5", loadingWidth = "100%", ...props }) => {
  return (
    <Root className={`${classes.root} ${className}`}>
      <Box textAlign={{ xs: "center" }}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography className={classes.label} color="textSecondary">
            {props.label}
          </Typography>
          {props.tooltip && (
            <Box display="flex" className={classes.label} alignItems="center" style={{ fontSize: "14px" }}>
              <InfoTooltip message={props.tooltip} />
            </Box>
          )}
        </Box>
        <Box width="100%" fontSize="24px" lineHeight="33px" fontWeight="700">
          {props.isLoading ? (
            <Skeleton width={loadingWidth} />
          ) : typeof props.metric === "string" ? (
            <Typography fontSize="24px" fontWeight="700" lineHeight="33px">
              {props.metric}
            </Typography>
          ) : (
            props.metric
          )}
        </Box>
      </Box>
    </Root>
  );
};

export default Metric;
