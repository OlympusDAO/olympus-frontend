<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import React from "react";
=======
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
=======
=======
import React from "react";
>>>>>>> Linting fixes
>>>>>>> Linting fixes
=======
>>>>>>> rebased from develop. everything appears to work except rebase timer
import OlympusLogo from "../../assets/logo.svg";
import "./notfound.scss";

export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="https://olympusdao.finance" target="_blank">
          <img className="branding-header-icon" src={OlympusLogo} alt="OlympusDAO" />
        </a>

        <h4>Page not found</h4>
      </div>
    </div>
  );
}
