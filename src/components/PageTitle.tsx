import { AppBar, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FC, ReactElement } from "react";

export interface OHMPageTitleProps {
  name?: string | ReactElement;
}

/**
 * Component for Displaying PageTitle
 */
const PageTitle: FC<OHMPageTitleProps> = ({ name }) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up(1048));
  const tablet = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <AppBar position="sticky" sx={{ backdropFilter: "none", zIndex: "8" }} elevation={0}>
      <Box
        sx={{ backgroundColor: theme.colors.gray[600] }}
        padding="10px"
        paddingTop={desktop ? "29.5px" : "36.5px"}
        paddingBottom="22.5px"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
        alignContent="center"
        marginLeft={desktop ? `25px` : "0px"}
        paddingLeft={desktop ? "10px" : "68px"}
        marginTop={tablet ? "-8px" : "3px"}
      >
        <Typography variant={desktop ? "h1" : "h4"}>{name}</Typography>
      </Box>
    </AppBar>
  );
};

export default PageTitle;
