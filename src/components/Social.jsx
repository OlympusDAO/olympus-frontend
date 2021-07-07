<<<<<<< HEAD
=======
import useTheme from "../hooks/useTheme";
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
import GitHubImg from "../assets/github.svg";
import MediumImg from "../assets/medium.svg";
import TwitterImg from "../assets/twitter.svg";
import DiscordImg from "../assets/discord.svg";

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
function Social() {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="social-row">
      <a href="https://github.com/OlympusDAO">
        <img src={GitHubImg} alt="github" target="_blank" className="social-icon-small" />
      </a>
      <a href="https://olympusdao.medium.com/">
        <img src={MediumImg} alt="medium" target="_blank" className="social-icon-small" />
      </a>
      <a href="https://twitter.com/OlympusDAO">
        <img src={TwitterImg} alt="twitter" target="_blank" className="social-icon-small" />
      </a>
      <a href="https://discord.gg/6QjjtUcfM4">
        <img src={DiscordImg} alt="discord" target="_blank" className="social-icon-small" />
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
      </a>
    </div>
  );
}
