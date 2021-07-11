<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
import useTheme from "../hooks/useTheme";
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
import GitHubImg from "../assets/github.svg";
import MediumImg from "../assets/medium.svg";
import TwitterImg from "../assets/twitter.svg";
import DiscordImg from "../assets/discord.svg";
=======
import { SvgIcon, makeStyles } from "@material-ui/core";
=======
=======
>>>>>>> Open social links in new tab
=======
>>>>>>> Linting fixes
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer
import { SvgIcon, Link } from "@material-ui/core";
<<<<<<< HEAD
>>>>>>> link hover styles no underline
import { ReactComponent as GitHub } from "../assets/icons/v1.2/github-dark_mode.svg";
import { ReactComponent as Medium } from "../assets/icons/v1.2/medium-dark_mode.svg";
import { ReactComponent as Twitter } from "../assets/icons/v1.2/twitter-dark_mode.svg";
import { ReactComponent as Discord } from "../assets/icons/v1.2/discord-dark_mode.svg";
=======
import { ReactComponent as GitHub } from "../assets/icons/v1.2/github.svg";
import { ReactComponent as Medium } from "../assets/icons/v1.2/medium.svg";
import { ReactComponent as Twitter } from "../assets/icons/v1.2/twitter.svg";
import { ReactComponent as Discord } from "../assets/icons/v1.2/discord.svg";
>>>>>>> imported new icons and got them working with theme colors

<<<<<<< HEAD
const useStyles = makeStyles(theme => ({
  svgStyle: {
    fillColor: theme.palette.text.primary,
  },
}));
>>>>>>> removed some unneeded pngs and updated social.jsx to use new components and materal svgicon component

<<<<<<< HEAD
export default function Social() {
  return (
    <div className="social-row">
      <a href="https://github.com/OlympusDAO" target="_blank">
        <img src={GitHubImg} alt="github" className="social-icon-small" />
      </a>
      <a href="https://olympusdao.medium.com" target="_blank">
        <img src={MediumImg} alt="medium" className="social-icon-small" />
      </a>
      <a href="https://twitter.com/OlympusDAO" target="_blank">
        <img src={TwitterImg} alt="twitter" className="social-icon-small" />
      </a>
      <a href="https://discord.gg/6QjjtUcfM4" target="_blank">
        <img src={DiscordImg} alt="discord" className="social-icon-small" />
=======
=======
>>>>>>> link hover styles no underline
function Social() {
  return (
    <div className="social-row">
      <Link href="https://github.com/OlympusDAO">
        <SvgIcon color="primary" component={GitHub} />
      </Link>

      <Link href="https://olympusdao.medium.com/">
        <SvgIcon color="primary" component={Medium} />
      </Link>

      <Link href="https://twitter.com/OlympusDAO">
        <SvgIcon color="primary" component={Twitter} />
      </Link>

<<<<<<< HEAD
      <a href="https://discord.gg/6QjjtUcfM4">
<<<<<<< HEAD
        <img src={DiscordImg} alt="discord" target="_blank" className="social-icon-small" />
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
=======
        <SvgIcon className={classes.svgStyle}>
          <Discord />
        </SvgIcon>
>>>>>>> removed some unneeded pngs and updated social.jsx to use new components and materal svgicon component
      </a>
=======
      <Link href="https://discord.gg/6QjjtUcfM4">
        <SvgIcon color="primary" component={Discord} />
      </Link>
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> link hover styles no underline
    </div>
  );
}
=======
=======
import React from "react";
=======
>>>>>>> Linting fixes
import GitHubImg from "../assets/github.svg";
import MediumImg from "../assets/medium.svg";
import TwitterImg from "../assets/twitter.svg";
import DiscordImg from "../assets/discord.svg";

export default function Social() {
  return (
    <div className="social-row">
      <a href="https://github.com/OlympusDAO" target="_blank">
        <img src={GitHubImg} alt="github" className="social-icon-small" />
      </a>
      <a href="https://olympusdao.medium.com" target="_blank">
        <img src={MediumImg} alt="medium" className="social-icon-small" />
      </a>
      <a href="https://twitter.com/OlympusDAO" target="_blank">
        <img src={TwitterImg} alt="twitter" className="social-icon-small" />
      </a>
      <a href="https://discord.gg/6QjjtUcfM4" target="_blank">
        <img src={DiscordImg} alt="discord" className="social-icon-small" />
      </a>
>>>>>>> Open social links in new tab
    </div>
  );
}
<<<<<<< HEAD
>>>>>>> Open social links in new tab
=======
>>>>>>> Linting fixes
=======
    </div>
  );
}

export default Social;
>>>>>>> rebased from develop. everything appears to work except rebase timer
