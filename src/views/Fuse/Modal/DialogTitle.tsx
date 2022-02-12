import { Box, DialogTitleProps, IconButton, makeStyles, Theme } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

interface Props extends DialogTitleProps {
  children: React.ReactChild;
  onClose?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  closeButton: {
    position: "absolute",
    left: theme.spacing(1),
    // top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  icon: {
    color: theme.palette.grey[500],
  },
}));
export function DialogTitle({ onClose, children, ...rest }: Props) {
  const classes = useStyles();

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      {onClose ? (
        <IconButton className={classes.closeButton} onClick={onClose} size="medium">
          <CloseIcon className={classes.icon} />
        </IconButton>
      ) : null}
      {children}
    </Box>
  );
}
