import { Box, Fade, Link, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FC } from "react";
import { NavLink, Outlet, Route, Routes } from "react-router-dom";

import Faq from "./Faq";
import News from "./News";
import { Proposals } from "./Proposals";

/**
 * Component for displaying info
 */
export const Info: FC<{ path?: string }> = () => (
  <>
    <Routes>
      <Route path="/" element={<InfoContainer />}>
        <Route path="news" element={<News />} />
        <Route path="proposals" element={<Proposals />} />
        <Route path="faq" element={<Faq />} />
      </Route>
    </Routes>
  </>
);

const useStyles = makeStyles<Theme>(theme => ({
  tabNav: {
    "& a": {
      fontSize: "14px",
      lineHeight: "20px",
      color: theme.colors.gray[90],
      padding: "8px 18px 10px 18px",
      "&.active": {
        color: theme.palette.type === "light" ? theme.palette.primary.main : theme.colors.primary[300],
      },
    },
  },
}));

const InfoContainer = () => {
  const classes = useStyles();

  return (
    <>
      <Fade in={true}>
        <Box display="flex" flexDirection="row" className={classes.tabNav} pt="18px" mb="18px">
          {!process.env.REACT_APP_DISABLE_NEWS && (
            <Link component={NavLink} to="/info">
              News
            </Link>
          )}
          <Link component={NavLink} to="/info/proposals">
            Votes
          </Link>
          <Link component={NavLink} to="/info/faq">
            FAQ
          </Link>
        </Box>
      </Fade>

      <Outlet />
    </>
  );
};
