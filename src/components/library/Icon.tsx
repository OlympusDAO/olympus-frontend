import { SvgIcon, SvgIconProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import iconPath from "src/components/library/iconsLib";

const PREFIX = "Icon";

const classes = {
  root: `${PREFIX}-root`,
};

const StyledSvgIcon = styled(SvgIcon)(() => ({
  [`&.${classes.root}`]: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    margin: "12px 0px",
  },
}));

export interface OHMIconProps extends SvgIconProps {
  name: keyof typeof iconPath;
}

const Icon: FC<OHMIconProps> = ({ name, ...props }) => {
  return <StyledSvgIcon {...props}>{iconPath[name]}</StyledSvgIcon>;
};

export default Icon;
export type IconName = keyof typeof iconPath;
