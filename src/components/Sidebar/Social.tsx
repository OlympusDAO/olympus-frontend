import { Link } from "@material-ui/core";
import { Icon } from "@olympusdao/component-library";
import React from "react";

const Social: React.FC = () => (
  <div className="social-row">
    <Link href="https://github.com/OlympusDAO" target="_blank">
      <Icon name="github" />
    </Link>
    <Link href="https://olympusdao.medium.com/" target="_blank">
      <Icon name="medium" />
    </Link>
    <Link href="https://twitter.com/OlympusDAO" target="_blank">
      <Icon name="twitter" />
    </Link>
    <Link href="https://discord.gg/6QjjtUcfM4" target="_blank">
      <Icon name="discord" />
    </Link>
  </div>
);

export default Social;
