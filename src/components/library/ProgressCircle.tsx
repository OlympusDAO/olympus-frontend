import { Box, CircularProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC } from "react";

const PREFIX = "ProgressCircle";

const classes = {
  root: `${PREFIX}-root`,
  balance: `${PREFIX}-balance`,
  label: `${PREFIX}-label`,
};

const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: "flex",
    "& .empty-progress": {
      color: theme.palette.mode === "light" ? theme.colors.paper.cardHover : theme.colors.gray[500],
    },
    "& .progress": {
      position: "absolute",
      color: theme.colors.feedback.userFeedback,
    },
    "& .progress-count": {
      position: "absolute",
      fontSize: "12px",
      height: "160px",
      width: "160px",
    },
  },

  [`& .${classes.balance}`]: {
    fontSize: "24px",
    lineHeight: "32px",
    fontWeight: 600,
    marginBottom: "6px",
  },

  [`& .${classes.label}`]: {
    lineHeight: "20px",
    fontWeight: 400,
  },
}));

export interface OHMProgressCircleProps {
  balance: string;
  label: string;
  progress?: number;
}

/**
 * Component for Displaying ProgressCircle
 */
const ProgressCircle: FC<OHMProgressCircleProps> = ({ balance, label, progress = 0 }) => {
  return (
    <Root className={classes.root}>
      <CircularProgress variant="determinate" className="empty-progress" value={100} size="160px" thickness={2.5} />
      <CircularProgress variant="determinate" className="progress" value={progress} size="160px" thickness={2.5} />
      <div className="progress-count">
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
          <Typography className={classes.balance}>{balance}</Typography>
          <Typography className={classes.label}>{label}</Typography>
        </Box>
      </div>
    </Root>
  );
};

export default ProgressCircle;
