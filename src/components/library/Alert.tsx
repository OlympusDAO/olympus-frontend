import { AlertProps, LinearProgress, Snackbar } from "@mui/material";
import { Alert as MuiAlert, AlertTitle } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC } from "react";

const PREFIX = "Alert";

const classes = {
  progressBar: `${PREFIX}-progressBar`,
  muiAlert: `${PREFIX}-muiAlert`,
};

const StyledSnackbar = styled(Snackbar)(() => ({
  [`& .${classes.progressBar}`]: {
    width: "100%",
    marginTop: "10px",
  },

  [`& .${classes.muiAlert}`]: {
    wordBreak: "break-word",
  },
}));

export interface OHMAlertProps {
  open: boolean;
  severity: AlertProps["severity"];
  title: string;
  text: string;
  onClose: () => void;
  progress: number;
}

const Alert: FC<OHMAlertProps> = ({ open, severity, title, text, onClose, progress }) => {
  return (
    <StyledSnackbar open={open} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <MuiAlert variant="filled" icon={false} severity={severity} onClose={onClose} className={classes.muiAlert}>
        <AlertTitle>{title}</AlertTitle>
        {text}
        <LinearProgress variant="determinate" value={progress} className={classes.progressBar} />
      </MuiAlert>
    </StyledSnackbar>
  );
};

export default Alert;
