import { Chip as MuiChip, ChipProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ThemeOptions } from "@mui/material/styles";
import { FC } from "react";

const PREFIX = "Chip";

const classes = {
  chip: `${PREFIX}-chip`,
};

const StyledMuiChip = styled(MuiChip, {
  shouldForwardProp: prop => prop !== "template" && prop !== "strong",
})<OHMChipProps>(({ theme, template, strong }) => {
  return {
    [`&.${classes.chip}`]: {
      height: "21px",
      borderRadius: "16px",
      backgroundColor: template
        ? template === "purple"
          ? theme.colors.special["olyZaps"]
          : template === "gray"
          ? theme.colors.gray[500]
          : template === "darkGray"
          ? theme.colors.gray[600]
          : theme.colors.feedback[template]
        : theme.palette.mode === "light"
        ? theme.colors.gray[90]
        : theme.colors.gray[10],
      "& span": {
        fontSize: "12px",
        lineHeight: "18px",
        color:
          theme.palette.mode === "light"
            ? theme.colors.gray[700]
            : template === "gray"
            ? theme.colors.gray[10]
            : template === "darkGray"
            ? theme.colors.gray[90]
            : theme.colors.gray[600],
        fontWeight: strong ? 700 : 450,
      },
    },
  };
});

export interface OHMChipProps extends ChipProps {
  template?: keyof ThemeOptions["colors"]["feedback"] | "purple" | "gray" | "darkGray";
  strong?: boolean;
}

/**
 * Component for Displaying Chip
 */
const Chip: FC<OHMChipProps> = ({ template, strong = false, ...props }) => {
  return <StyledMuiChip className={classes.chip} template={template} strong={strong} {...props} />;
};

export default Chip;
