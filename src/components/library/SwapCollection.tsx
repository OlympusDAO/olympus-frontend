import { Box, styled, useTheme } from "@mui/material";
import { FC, ReactElement } from "react";
import Icon from "src/components/library/Icon";
import { OHMSwapCardProps } from "src/components/library/SwapCard";

export interface OHMSwapCollectionProps {
  UpperSwapCard: ReactElement<OHMSwapCardProps>;
  LowerSwapCard: ReactElement<OHMSwapCardProps>;
  arrowOnClick?: () => void;
}

const StyledArrow = styled(Box)(
  ({ theme, onClick }) =>
    onClick && {
      "&": {
        transitionProperty: "all",
        transitionTimingFunction: " cubic-bezier(.4,0,.2,1)",
        transitionDuration: ".15s",
        cursor: "pointer",
      },
      "&:hover": {
        border: `1px solid ${theme.colors.gray[10]}`,
        " & .rotate": {
          WebkitTransform: "rotateZ(540deg)",
          MozTransition: "rotateZ(540deg)",
          transform: "rotateZ(540deg)",
        },
        " & .arrow-wrapper": {
          marginTop: "-2px",
        },
      },
      "& .rotate": {
        WebkitTransition: "0.6s ease-out",
        MozTransition: "0.6s ease-out",
        transition: " 0.6s ease-out",
      },
    },
);

/**
 * Component for Displaying SwapCollection
 */
const SwapCollection: FC<OHMSwapCollectionProps> = ({ UpperSwapCard, LowerSwapCard, arrowOnClick }) => {
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="column" maxWidth="476px">
      {UpperSwapCard}
      <Box display="flex" flexDirection="row" justifyContent="center">
        <StyledArrow
          width="21px"
          height="21px"
          borderRadius="6px"
          sx={{ backgroundColor: theme.colors.gray[600] }}
          textAlign="center"
          marginTop={"-7px"}
          zIndex="10"
          onClick={arrowOnClick}
        >
          <Box className="arrow-wrapper">
            <Icon
              className="rotate"
              name="arrow-down"
              sx={{
                fontSize: "7px",
              }}
            />
          </Box>
        </StyledArrow>
      </Box>
      <Box marginTop="-7px">{LowerSwapCard}</Box>
    </Box>
  );
};

export default SwapCollection;
