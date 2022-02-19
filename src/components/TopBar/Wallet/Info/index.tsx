import { Box, Link, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FC } from "react";
import { NavLink } from "react-router-dom";

import Faq from "./Faq";
import News from "./News";
import Proposals from "./Proposals";

const useStyles = makeStyles<Theme>(theme => ({
  tabNav: {
    "& a": {
      fontSize: "14px",
      lineHeight: "20px",
      color: theme.colors.gray[90],
      padding: "8px 18px 10px 18px",
      "&.active": {
        color: theme.colors.primary[300],
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
  const classes = useStyles();

  const RenderComponent = (props: { path?: string }) => {
    switch (props.path) {
      case "news":
        return <News />;
      case "proposals":
        return <Proposals />;
      case "faq":
        return <Faq />;
      default:
        return <Proposals />;
    }
  };
  return (
    <Box>
      <Box display="flex" flexDirection="row" className={classes.tabNav} pt="18px" mb="18px">
        <Link component={NavLink} to="/info/faq">
          FAQ
        </Link>
        <Link component={NavLink} to="/info/proposals">
          Votes
        </Link>
        <Link component={NavLink} to="/info/news">
          News
        </Link>
      </Box>
      <RenderComponent path={props.path} />
    </Box>
  );
};

export default Info;
