import React from "react";
import GitHubImg from "../assets/github.svg";
import MediumImg from "../assets/medium.svg";
import TwitterImg from "../assets/twitter.svg";
import DiscordImg from "../assets/discord.svg";

function Social() {
  return (
    <div className="social-row">
      <a href="https://github.com/OlympusDAO" target="_blank" rel="noreferrer">
        <img src={GitHubImg} alt="github" className="social-icon-small" />
      </a>
      <a href="https://olympusdao.medium.com/" target="_blank" rel="noreferrer">
        <img src={MediumImg} alt="medium" className="social-icon-small" />
      </a>
      <a href="https://twitter.com/OlympusDAO" target="_blank" rel="noreferrer">
        <img src={TwitterImg} alt="twitter" className="social-icon-small" />
      </a>
      <a href="https://discord.gg/6QjjtUcfM4" target="_blank" rel="noreferrer">
        <img src={DiscordImg} alt="discord" className="social-icon-small" />
      </a>
    </div>
  );
}

export default Social;
