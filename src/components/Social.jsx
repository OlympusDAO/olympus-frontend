import React from 'react';
import OlympusLogo from '../assets/logo.svg';
import GitHubImg from '../assets/github.svg';
import MediumImg from '../assets/medium.svg';
import TwitterImg from '../assets/twitter.svg';
import DiscordImg from '../assets/discord.svg';


function Social() {
  return (
    <div className="social-row">
      <a href="https://github.com/OlympusDAO"><img src={GitHubImg} alt="github" target="_blank" className="social-icon-small"
      /></a>
      <a href="https://olympusdao.medium.com/"
        ><img src={MediumImg} alt="medium" target="_blank" className="social-icon-small"
      /></a>
      <a href="https://twitter.com/OlympusDAO"
        ><img src={TwitterImg} alt="twitter" target="_blank" className="social-icon-small"
      /></a>
      <a href="https://discord.gg/6QjjtUcfM4"
        ><img src={DiscordImg} alt="discord" target="_blank" className="social-icon-small"
      /></a>
    </div>
  );
}

export default Social;
