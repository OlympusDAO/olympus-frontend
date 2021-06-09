import React, { useEffect, useState } from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
// import useTheme from "../../hooks/useTheme.js";
import { ReactComponent as SunIcon } from '../../assets/icons/sun-icon.svg';
import { ReactComponent as MoonIcon } from '../../assets/icons/moon-icon.svg';
import "./themeswitch.scss";

function ThemeSwitcher({theme, toggleTheme}) {
  // const [theme, toggleTheme, mounted] = useTheme();

  // Avoid theme change flicker
  // if (!mounted) {
  //   return null;
  // }

  return (
      <ToggleButton
        className="toggle-button btn top-bar-button btn-overwrite-primer m-2"
        type="button"
        title="Change Theme" 
        value="check" 
        onClick={e => toggleTheme(e)}
      >
        { theme === "dark" ? <MoonIcon className="moon"/> : <SunIcon className="sun"/> }
      </ToggleButton>
  );
}

export default ThemeSwitcher;
