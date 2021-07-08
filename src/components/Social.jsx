import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../assets/icons/v1.2/github-dark_mode.svg";
import { ReactComponent as Medium } from "../assets/icons/v1.2/medium-dark_mode.svg";
import { ReactComponent as Twitter } from "../assets/icons/v1.2/twitter-dark_mode.svg";
import { ReactComponent as Discord } from "../assets/icons/v1.2/discord-dark_mode.svg";

function Social() {
  return (
    <div className="social-row">
      <Link href="https://github.com/OlympusDAO">
        <SvgIcon color="primary">
          <GitHub />
        </SvgIcon>
      </Link>

      <Link href="https://olympusdao.medium.com/">
        <SvgIcon>
          <Medium color="primary" />
        </SvgIcon>
      </Link>

      <Link href="https://twitter.com/OlympusDAO">
        <SvgIcon color="primary">
          <Twitter />
        </SvgIcon>
      </Link>

      <Link href="https://discord.gg/6QjjtUcfM4">
        <SvgIcon color="primary">
          <Discord />
        </SvgIcon>
      </Link>
    </div>
  );
}

export default Social;
