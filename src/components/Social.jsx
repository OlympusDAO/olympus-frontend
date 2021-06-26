<<<<<<< HEAD
import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../assets/icons/v1.2/github.svg";
import { ReactComponent as Medium } from "../assets/icons/v1.2/medium.svg";
import { ReactComponent as Twitter } from "../assets/icons/v1.2/twitter.svg";
import { ReactComponent as Discord } from "../assets/icons/v1.2/discord.svg";

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

      <Link href="https://discord.gg/6QjjtUcfM4">
        <SvgIcon color="primary" component={Discord} />
      </Link>
=======
import React from "react";
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