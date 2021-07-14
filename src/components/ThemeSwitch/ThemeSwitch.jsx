import ToggleButton from "@material-ui/lab/ToggleButton";
import { ReactComponent as SunIcon } from "../../assets/icons/sun-icon.svg";
import { ReactComponent as MoonIcon } from "../../assets/icons/moon-icon.svg";
import "./themeswitch.scss";

function ThemeSwitcher({ theme, toggleTheme }) {
  return (
    <ToggleButton
      className="toggle-button btn top-bar-button btn-overwrite-primer m-2"
      type="button"
      title="Change Theme"
      value="check"
      onClick={e => toggleTheme(e)}
    >
      {theme === "dark" ? <MoonIcon className="moon" /> : <SunIcon className="sun" />}
    </ToggleButton>
  );
}

export default ThemeSwitcher;
