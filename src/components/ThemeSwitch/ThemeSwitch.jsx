<<<<<<< HEAD
import ToggleButton from "@material-ui/lab/ToggleButton";
=======
import React from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
// import useTheme from "../../hooks/useTheme.js";
>>>>>>> Linting fixes
import { ReactComponent as SunIcon } from "../../assets/icons/sun-icon.svg";
import { ReactComponent as MoonIcon } from "../../assets/icons/moon-icon.svg";
import "./themeswitch.scss";

function ThemeSwitcher({ theme, toggleTheme }) {
  return (
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    <ToggleButton
      className="toggle-button btn top-bar-button btn-overwrite-primer m-2"
=======
    <ToggleButton
      className="toggle-button"
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
=======
    <ToggleButton
      className="toggle-button btn top-bar-button btn-overwrite-primer m-2"
>>>>>>> Linting fixes
      type="button"
      title="Change Theme"
      value="check"
      onClick={e => toggleTheme(e)}
    >
      {theme === "dark" ? <MoonIcon className="moon" /> : <SunIcon className="sun" />}
    </ToggleButton>
<<<<<<< HEAD
<<<<<<< HEAD
=======
      <ToggleButton
        className="toggle-button"
        type="button"
        title="Change Theme" 
        value="check" 
        onClick={e => toggleTheme(e)}
      >
        { theme === "dark" ? <MoonIcon className="moon"/> : <SunIcon className="sun"/> }
      </ToggleButton>
>>>>>>> theme toggle styled, bonds page basic styles, fixed rounded sidebar issue
=======
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
=======
>>>>>>> Linting fixes
  );
}

export default ThemeSwitcher;
