import { SvgIcon, makeStyles } from "@material-ui/core";
import { ReactComponent as GitHub } from "../assets/icons/v1.2/github-dark_mode.svg";
import { ReactComponent as Medium } from "../assets/icons/v1.2/medium-dark_mode.svg";
import { ReactComponent as Twitter } from "../assets/icons/v1.2/twitter-dark_mode.svg";
import { ReactComponent as Discord } from "../assets/icons/v1.2/discord-dark_mode.svg";

const useStyles = makeStyles(theme => ({
  svgStyle: {
    fillColor: theme.palette.text.primary,
  },
}));

function Social() {
  const classes = useStyles();

  return (
    <div className="social-row">
      <a href="https://github.com/OlympusDAO">
        <SvgIcon className={classes.svgStyle}>
          <GitHub />
        </SvgIcon>
      </a>

      <a href="https://olympusdao.medium.com/">
        <SvgIcon className={classes.svgStyle}>
          <Medium />
        </SvgIcon>
      </a>

      <a href="https://twitter.com/OlympusDAO">
        <SvgIcon className={classes.svgStyle}>
          <Twitter />
        </SvgIcon>
      </a>

      <a href="https://discord.gg/6QjjtUcfM4">
        <SvgIcon className={classes.svgStyle}>
          <Discord />
        </SvgIcon>
      </a>
    </div>
  );
}

export default Social;
