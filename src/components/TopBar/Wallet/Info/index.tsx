import { Box, Fade, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import { Navigate, NavLink, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Environment } from "src/helpers/environment/Environment/Environment";

import Faq from "./Faq";
import News from "./News";
import { Proposals } from "./Proposals";

/**
 * Component for displaying info
 */
export const Info: FC = () => (
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

const PREFIX = "Info";

const classes = {
  tabNav: `${PREFIX}-tabNav`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(({ theme }) => ({
  [`& .${classes.tabNav}`]: {
    "& a": {
      fontSize: "14px",
      lineHeight: "20px",
      color: theme.colors.gray[90],
      padding: "8px 18px 10px 18px",
      "&.active": {
        color: theme.palette.mode === "light" ? theme.palette.primary.main : theme.colors.primary[300],
      },
    },
  },
}));

const InfoContainer = () => {
  const { pathname } = useLocation();

  return (
    <Root>
      <Fade in>
        <Box display="flex" flexDirection="row" className={classes.tabNav} pt="18px" mb="18px">
          {Environment.isWalletNewsEnabled() && (
            <Link component={NavLink} to="/info/news">
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

      {pathname === "/info" && <Navigate to={Environment.isWalletNewsEnabled() ? "news" : "proposals"} />}

      <Outlet />
    </Root>
  );
};
