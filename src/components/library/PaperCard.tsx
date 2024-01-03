import { Box, BoxProps, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC } from "react";

const PREFIX = "PaperCard";

const classes = {
  container: `${PREFIX}-container`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`&.${classes.container}`]: {
    background: theme.colors.paper.card,
    borderRadius: "9px",
    textOverflow: "ellipsis",
    overflow: "hidden",
    maxHeight: "300px",
    // "&:hover": {
    //   background: theme.colors.paper.cardHover,
    // },
    "& a:hover": {
      color: "unset",
    },
    padding: "18px",
  },
}));

export interface OHMPaperCardProps extends BoxProps {
  className?: string;
  title?: string;
}

/**
 * Component for Displaying PaperCard
 */
const PaperCard: FC<OHMPaperCardProps> = ({ children, className = "", title, ...props }) => {
  return (
    <StyledBox className={`${classes.container} ${className}`} {...props}>
      {title && (
        <Typography fontSize="18px" lineHeight="28px" fontWeight="700">
          {title}
        </Typography>
      )}
      {children}
    </StyledBox>
  );
};

export default PaperCard;
