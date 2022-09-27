import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FC, ReactElement } from "react";

export interface OHMPageTitleProps {
  name?: string | ReactElement;
}

/**
 * Component for Displaying PageTitle
 */
const PageTitle: FC<OHMPageTitleProps> = ({ name }) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      width="100%"
      paddingTop="3px"
      paddingBottom="22.5px"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignContent="center"
      marginLeft={mobile ? "9px" : "33px"}
    >
      <Typography variant="h1">{name}</Typography>
    </Box>
  );
};

export default PageTitle;
