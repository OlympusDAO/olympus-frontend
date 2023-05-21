import { Slider as MuiSlider, SliderProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC } from "react";

const PREFIX = "MuiSlider";

const classes = {
  root: `${PREFIX}-root`,
  thumb: `${PREFIX}-thumb`,
  track: `${PREFIX}-track`,
  rail: `${PREFIX}-rail`,
};

const StyledOHMSlider = styled(MuiSlider)(({ theme }) => ({
  [`&.${classes.root}`]: {
    color: theme.colors.primary[300],
    height: 8,
  },

  [`& .${classes.thumb}`]: {
    height: 24,
    width: 24,
    backgroundColor: theme.colors.gray[10],
    boxShadow: "0px 12px 16px -4px rgba(16, 24, 40, 0.1), 0px 4px 6px -2px rgba(16, 24, 40, 0.05)",
    "&:focus, &:hover, &:active": {
      boxShadow: "0px 12px 16px -4px rgba(16, 24, 40, 0.1), 0px 4px 6px -2px rgba(16, 24, 40, 0.05)",
    },
  },

  [`& .${classes.track}`]: {
    height: 8,
    borderRadius: 4,
  },

  [`& .${classes.rail}`]: {
    height: 8,
    opacity: 1,
    color: theme.palette.mode === "light" ? theme.colors.paper.cardHover : theme.colors.gray[500],
    borderRadius: 4,
  },
}));

export type OHMSliderProps = SliderProps;

/**
 * Component for Displaying Slider
 */

const Slider: FC<OHMSliderProps> = props => {
  return <StyledOHMSlider valueLabelDisplay="off" aria-label="pretto slider" defaultValue={20} {...props} />;
};

export default Slider;
