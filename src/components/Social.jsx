import React from "react";
import GitHubImg from "../assets/github.svg";
import MediumImg from "../assets/medium.svg";
import TwitterImg from "../assets/twitter.svg";
import DiscordImg from "../assets/discord.svg";

function Social() {
  return (
    <div className="social-row">
      <a href="https://github.com/OlympusDAO" target="_blank" rel="noopener noreferrer">
        <img src={GitHubImg} alt="Olympus on Github" className="social-icon-small" />
      </a>
      <a href="https://olympusdao.medium.com/" target="_blank" rel="noopener noreferrer">
        <img src={MediumImg} alt="Olympus on Medium" className="social-icon-small" />
      </a>
      <a href="https://twitter.com/OlympusDAO" target="_blank" rel="noopener noreferrer">
        <img src={TwitterImg} alt="Olympus on Twitter" className="social-icon-small" />
      </a>
      <a href="https://discord.gg/6QjjtUcfM4" target="_blank" rel="noopener noreferrer">
        <img src={DiscordImg} alt="Olympus Discord" className="social-icon-small" />
      </a>
    </div>
  );
}

export default Social;
