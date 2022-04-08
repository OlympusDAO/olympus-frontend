import { Link, makeStyles } from "@material-ui/core";
import { Icon } from "@olympusdao/component-library";
import React from "react";

const useStyles = makeStyles(theme => ({
  gray: {
    color: theme.colors.gray[90],
  },
}));

const Social: React.FC = () => {
  const classes = useStyles();
  return (
    <div className="social-row">
      <Link href="https://github.com/OlympusDAO" target="_blank">
        <Icon name="github" className={classes.gray} />
      </Link>
      <Link href="https://olympusdao.medium.com/" target="_blank">
        <Icon name="medium" className={classes.gray} />
      </Link>
      <Link href="https://twitter.com/OlympusDAO" target="_blank">
        <Icon name="twitter" className={classes.gray} />
      </Link>
      <Link href="https://discord.gg/6QjjtUcfM4" target="_blank">
        <Icon name="discord" className={classes.gray} />
      </Link>
    </div>
  );
};

export default Social;
