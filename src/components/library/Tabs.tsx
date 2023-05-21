import { Tabs as MuiTabs, TabsProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
const PREFIX = "Tabs";

const classes = {
  root: `${PREFIX}-root`,
};

const StyledMuiTabs = styled(MuiTabs)(() => ({
  [`&.${classes.root}`]: {
    "&.MuiTabs-vertical": {
      height: "auto",
      minHeight: "auto",
    },
    " & .MuiTabs-scrollable": {
      overflowY: "hidden",
    },
  },
}));

type Props = Omit<
  TabsProps,
  | "TouchRippleProps"
  | "onFocusVisible"
  | "focusRipple"
  | "focusVisibleClassName"
  | "centerRipple"
  | "disableRipple"
  | "disableTouchRipple"
>;

export interface OhmTabsProps extends Props {
  className?: string;
}

const Tabs: React.FC<OhmTabsProps> = ({ className = "", ...props }) => {
  return (
    <StyledMuiTabs textColor="primary" indicatorColor="primary" {...props} className={`${classes.root} ${className}`} />
  );
};

export default Tabs;
