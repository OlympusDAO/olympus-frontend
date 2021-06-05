import React, { useEffect, useState } from "react";
// import { useThemeSwitcher } from "react-css-theme-switcher";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { ReactComponent as SunIcon } from '../../assets/icons/sun-icon.svg';
import { ReactComponent as MoonIcon } from '../../assets/icons/moon-icon.svg';
import "./themeswitch.scss";

export default function ThemeSwitcher() {
  const theme = window.localStorage.getItem("theme");
  const [isDarkMode, setIsDarkMode] = useState(true)
  // const { switcher, currentTheme, status, themes } = useThemeSwitcher();

  // this is to load the last theme from local storage, we can use this but commented out for now
  // useEffect(() => {
  //   window.localStorage.setItem("theme", currentTheme);
  // }, [currentTheme]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // switcher({ theme: isChecked ? themes.dark : themes.light }); // this is to set the theme context, will want to use with above
  };

  // Avoid theme change flicker
  // if (status === "loading") {
  //   return null;
  // }

  return (
      <ToggleButton
        className="toggle-button btn btn-dark btn-overwrite-primer m-2"
        type="button"
        title="Change Theme" 
        value="check" 
        selected={isDarkMode} onChange={toggleTheme}
      >
        { isDarkMode ? <MoonIcon className="moon"/> : <SunIcon className="sun"/> }
      </ToggleButton>
  );
}
