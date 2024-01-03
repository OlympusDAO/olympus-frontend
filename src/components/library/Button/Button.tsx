import { Button as MuiButton, ButtonProps, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import Icon, { IconName } from "src/components/library/Icon";

const PREFIX = "custom";

const classes = {
  root: `${PREFIX}-root`,
};

const StyledMuiButton = styled(MuiButton, {
  shouldForwardProp: prop => prop !== "icon",
})<OHMButtonProps>(({ icon }) => ({
  [`&.${classes.root}`]: {
    fontSize: "15px",
    fontWeight: 500,
    height: "39px",
    borderRadius: "6px",
    lineHeight: "21px",
    margin: "4.5px",
    textTransform: "none",
    textDecoration: "none",
    whiteSpace: "nowrap",
    maxHeight: "39px",
    padding: icon ? "9px" : "6px 16px",
    "&.MuiButton-text": {
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
    "& .MuiSvgIcon-root": {
      fontSize: "22px",
    },
    "&.MuiButton-fullWidth": {
      marginLeft: "0px",
      marginRight: "0px",
    },
    "&.MuiButton-sizeLarge": {
      minWidth: icon ? "inherit" : "250px",
      height: "51px",
      maxHeight: "51px",
      padding: icon ? "12px" : "6px 16px",
      fontSize: "18px",
      "& .MuiSvgIcon-root": {
        fontSize: "29px",
      },
    },
    "&.MuiButton-sizeSmall": {
      padding: icon ? "6px" : "0px 23px",
      height: "33px",
      fontSize: "14px",
      "& .MuiSvgIcon-root": {
        fontSize: "18px",
      },
    },
    "& .MuiButton-endIcon": {
      marginLeft: "8px",
    },
    "& .MuiButton-startIcon": {
      marginRight: "8px",
    },
  },
}));

export interface OHMButtonProps extends ButtonProps {
  template?: "primary" | "secondary" | "tertiary" | "text" | "success" | "feedback";
  icon?: IconName;
  onClick?: any;
  startIconName?: IconName;
  endIconName?: IconName;
  loading?: boolean;
}

/**
 * Primary Button Component for UI.
 */
const Button: FC<OHMButtonProps> = ({
  disableElevation = true,
  disableFocusRipple = true,
  disableRipple = true,
  template = "primary",
  startIconName,
  endIconName,
  className = "",
  loading,
  ...props
}) => {
  let variant = props.variant;
  let color = props.color;
  let localProps = {};
  //let target: HTMLAttributeAnchorTarget = undefined;
  switch (template) {
    case "primary":
      variant = "contained";
      color = "primary";
      break;
    case "secondary":
      variant = "outlined";
      color = "secondary";
      break;
    case "tertiary":
      variant = "outlined";
      color = "primary";
      break;
    case "text":
      variant = "text";
      color = "secondary";
      break;
    case "success":
      variant = "contained";
      color = "success";
      break;
  }
  if (props.href) {
    localProps = {
      target: "_blank",
    };
  }
  const endIcon = endIconName || (props.href && "arrow-up") || null;
  return (
    <StyledMuiButton
      variant={variant}
      color={color}
      className={`${classes.root} ${className}`}
      disableElevation={disableElevation}
      disableFocusRipple={disableFocusRipple}
      disableRipple={disableRipple}
      {...props}
      {...localProps}
      startIcon={startIconName ? <Icon name={startIconName} fontSize="large" /> : null}
      endIcon={endIcon ? <Icon name={endIcon} fontSize="large" /> : null}
    >
      {loading && <CircularProgress color="inherit" size="17px" sx={{ marginRight: "8px", opacity: 1 }} />}
      {props.icon && !props.children ? <Icon name={props.icon} /> : null}
      {props.children}
    </StyledMuiButton>
  );
};

export default Button;
