import { Box, Fade, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC } from "react";
import { NavLink } from "react-router-dom";

import Faq from "./Faq";
import News from "./News";
import Proposals from "./Proposals";

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

export interface OHMInfoProps {
  path?: string;
}

/**
 * Component for Displaying Info
 */
const Info: FC<OHMInfoProps> = (props: { path?: string }) => {
  return (
    <Root>
      <Fade in={true}>
        <Box display="flex" flexDirection="row" className={classes.tabNav} pt="18px" mb="18px">
          {!process.env.REACT_APP_DISABLE_NEWS && (
            <Link component={NavLink} to="/info" exact>
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
      {(() => {
        switch (props.path) {
          case "news":
            return <News />;
          case "proposals":
            return <Proposals />;
          case "faq":
            return <Faq />;
          default:
            return <News />;
        }
      })()}
    </Root>
  );
};

export default Info;
