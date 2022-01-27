import "./NotFound.scss";

import { Trans } from "@lingui/macro";

import OlympusLogo from "../../assets/Olympus Logo.svg";

export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="https://olympusdao.finance" target="_blank">
          <img className="branding-header-icon" src={OlympusLogo} alt="OlympusDAO" />
        </a>

        <h4>
          <Trans>Page not found</Trans>
        </h4>
      </div>
    </div>
  );
}
