import { Box, Typography } from "@mui/material";
import { FC, ReactElement } from "react";

export interface OHMPageTitleProps {
  name?: string | ReactElement;
}

/**
 * Component for Displaying PageTitle
 */
const PageTitle: FC<OHMPageTitleProps> = ({ name }) => {
  return (
    <Box
      width="100%"
      paddingBottom="22.5px"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignContent="center"
      marginLeft="33px"
    >
      <Typography variant="h1">{name}</Typography>
    </Box>
  );
};

export default PageTitle;
