import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FC, ReactElement } from "react";

export interface OHMPageTitleProps {
  name?: string | ReactElement;
  subtitle?: string | ReactElement;
  noMargin?: boolean;
}

/**
 * Component for Displaying PageTitle
 */
const PageTitle: FC<OHMPageTitleProps> = ({ name, subtitle, noMargin }) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      width="100%"
      marginLeft={noMargin ? "0px" : mobile ? "9px" : "33px"}
      marginTop={mobile ? "33px" : "0px"}
      paddingBottom="22.5px"
    >
      <Box paddingTop="3px" display="flex" flexDirection="row" justifyContent="flex-start" alignContent="center">
        <Typography variant="h1">{name}</Typography>
      </Box>
      {subtitle && (
        <Box display="flex" flexDirection="row" justifyContent="flex-start">
          <Typography color={theme.colors.gray[40]}>{subtitle}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default PageTitle;
