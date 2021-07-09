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
    </div>
  );
}

export default Social;
