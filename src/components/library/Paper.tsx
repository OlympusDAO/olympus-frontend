import { Box, Grid, Paper as MuiPaper, PaperProps, Typography, Zoom } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, ReactElement } from "react";
import Chip from "src/components/library/Chip";
import InfoTooltip from "src/components/library/InfoTooltip";

const PREFIX = "Paper";

const classes = {
  root: `${PREFIX}-root`,
};

const StyledPaper = styled(MuiPaper, {
  shouldForwardProp: prop => prop !== "fullWidth" && prop !== "enableBackground",
})<Styles>(({ theme, fullWidth, enableBackground }) => ({
  [`&.${classes.root}`]: {
    zIndex: 5,
    padding: "20px 30px 20px 30px",
    borderRadius: "10px",
    maxWidth: fullWidth ? "100%" : "900px",
    width: fullWidth ? "100%" : "97%",
    marginBottom: "1.8rem",
    overflow: "hidden",
    background: enableBackground ? theme.colors.paper.card : "",
    backdropFilter: enableBackground ? "" : "none",
    "--webkitBackdropFilter": enableBackground ? "" : "none",
    "& .card-header": {
      width: "100%",
      minHeight: "33px",
      marginBottom: "10px",
      position: "relative",
      "& h5": {
        fontWeight: "600",
      },
    },
  },
}));

type Styles = {
  fullWidth?: boolean;
  enableBackground?: boolean;
};

export interface OHMPaperProps extends PaperProps {
  /** Header Text for Paper */
  headerText?: string;
  /** Sub Header for Paper */
  subHeader?: ReactElement;
  /** Header Chip for Paper */
  headerChip?: string;
  /*Include an InfoTooltip after HeaderText */
  tooltip?: string;
  /** Used to specify a custom header instead of using the default headerText and subHeader prop. */
  headerContent?: ReactElement;
  /** Make Paper Width 100% */
  fullWidth?: boolean;
  /** Custom content for Top Right Position. */
  topLeft?: ReactElement;
  /** Custom content for Top Right Position. */
  topRight?: ReactElement;
  /**Zoom Animation. Defaults to True. Set to False to disable zoom on load */
  zoom?: boolean;
  /** Enable Paper backgrounds for child paper components */
  enableBackground?: boolean;
}
/**
 * Primary Paper Component for UI.
 */
const Paper: FC<OHMPaperProps> = ({
  headerText,
  headerContent,
  className = "",
  tooltip,
  fullWidth = false,
  topLeft,
  topRight,
  zoom = true,
  subHeader,
  enableBackground = false,
  headerChip,
  ...props
}) => {
  return (
    <Zoom in={true} appear={zoom}>
      <StyledPaper
        className={`${classes.root} ${className}`}
        {...props}
        elevation={0}
        enableBackground={enableBackground}
        fullWidth={fullWidth}
      >
        <Grid container direction="column" spacing={2}>
          {(topLeft || headerText || topRight || headerContent) && (
            <Grid item className="card-header">
              <Box display="flex" justifyContent="space-between">
                {topLeft && <div className="top-left">{topLeft}</div>}
                {headerText && !headerContent && (
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Typography fontSize="24px" className="header-text" fontWeight={700} lineHeight="33px">
                      {headerText}
                    </Typography>
                    {tooltip && (
                      <Box display="inline" alignSelf="center" style={{ fontSize: "9px" }}>
                        <InfoTooltip message={tooltip} />
                      </Box>
                    )}
                    {headerChip && (
                      <Box ml="8px">
                        <Chip label={headerChip} />
                      </Box>
                    )}
                  </Box>
                )}
                {headerContent}
                <div className="top-right">{topRight}</div>
              </Box>
              {subHeader && <Box display="flex">{subHeader}</Box>}
            </Grid>
          )}
          <Grid item>{props.children}</Grid>
        </Grid>
      </StyledPaper>
    </Zoom>
  );
};

export default Paper;
