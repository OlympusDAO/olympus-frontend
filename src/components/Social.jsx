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
    </div>
  );
}
