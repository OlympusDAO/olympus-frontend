import { Alert, AlertProps } from "@mui/material";
import { Box, Collapse, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { FC } from "react";
import Icon, { IconName } from "src/components/library/Icon";

const PREFIX = "Notification";

const classes = {
  root: `${PREFIX}-root`,
  icon: `${PREFIX}-icon`,
  text: `${PREFIX}-text`,
};

const StyledCollapse = styled(Collapse, { shouldForwardProp: prop => prop !== "square" })<OHMNotificationProps>(
  ({ theme, square }) => ({
    [`& .${classes.root}`]: {
      borderRadius: square ? "0px" : "9px",
      paddingTop: "9px",
      paddingBottom: "9px",
      marginBottom: "10px",
      wordBreak: "break-word",
      justifyContent: "center",
      color: theme.colors.gray[700],
      "& a": {
        fontWeight: "500",
        color: theme.colors.gray[700],
        textDecoration: "underline",
      },
      "& .MuiAlert-message": {
        padding: "0px",
        flexGrow: "1",
      },
      "& .MuiAlert-action": {
        paddingLeft: "0px",
        "& .MuiIconButton-sizeSmall": {
          padding: "0px",
          "& .MuiSvgIcon-fontSizeSmall": {
            fontSize: "1.14rem",
          },
        },
      },
      "&.MuiAlert-filledSuccess": {
        color: "#253449",
      },
    },

    [`& .${classes.icon}`]: {
      fontSize: "16.5px",
      marginRight: "9px",
    },

    [`& .${classes.text}`]: {
      fontSize: "15px",
      lineHeight: "24px",
    },
  }),
);

export interface OHMNotificationProps extends AlertProps {
  template?: "info" | "success" | "error" | "default" | "warning";
  dismissible?: boolean;
  /** To manage show/hide state in parent. Pass setState here */
  onDismiss?: () => void;
  /** To manage show/hide state in the parent. Pass useState here */
  show?: boolean;
  square: boolean;
}

/**
 * Primary Notification Component for UI.
 *
 * ### Controlling Notification State.
 * This component manages its own state, however if you encounter a scenario where you need to handle
 * the state in the parent component you can leverage the onDismiss and show props
 *
 * ```jsx
 * const [open, setOpen] = useState(true);
 * <DefaultNotification show={open} onDismiss={() => setOpen(false)} dismissible >
 *   This is a dismissible notification with custom width
 * </DefaultNotification>
 * ```
 *
 * ```jsx
 * <Button onClick={() => setOpen(true)}>
 *   Reappear After Dismiss
 * </Button>
 *
 * ```
 *
 */

const Notification: FC<OHMNotificationProps> = ({
  template = "info",
  dismissible = false,
  onDismiss,
  show,
  square = false,
  ...props
}) => {
  let icon;
  let severity = props.severity;
  let variant = props.variant;
  switch (template) {
    case "default":
      // icon = "info" as IconName;
      severity = "info";
      variant = "filled";
      break;
    case "success":
      icon = "check-circle" as IconName;
      severity = "success";
      variant = "filled";
      break;
    case "error":
      icon = "alert-circle" as IconName;
      severity = "error";
      variant = "filled";
      break;
    case "info":
      icon = "info" as IconName;
      severity = "info";
      variant = "filled";
      break;
    case "warning":
      icon = "info" as IconName;
      severity = "warning";
      variant = "filled";
      break;
  }

  const action =
    props.action || dismissible === false ? (
      props.action
    ) : (
      <IconButton
        aria-label="close"
        color="inherit"
        size="small"
        onClick={() => {
          setOpen(false);
          if (onDismiss) {
            onDismiss();
          }
        }}
      >
        <Icon name="x" />
      </IconButton>
    );

  const [open, setOpen] = useState(true);
  useEffect(() => {
    if (show === true) {
      setOpen(true);
    }
  }, [show]);
  return (
    <StyledCollapse in={open} square={square}>
      <Alert
        variant={variant}
        icon={false}
        severity={severity}
        className={classes.root}
        action={action}
        {...props}
        elevation={8}
      >
        <Box display="flex" alignItems="center" justifyContent="center">
          {icon && <Icon className={classes.icon} name={icon} />}
          <Box display="flex" alignItems="center">
            <Typography className={classes.text}>{props.children}</Typography>
          </Box>
        </Box>
      </Alert>
    </StyledCollapse>
  );
};

export default Notification;
