import ToggleButton from "@material-ui/lab/ToggleButton";
import { SvgIcon } from "@material-ui/core";
import { ReactComponent as SunIcon } from "../assets/icons/v1.2/sun.svg";
import { ReactComponent as MoonIcon } from "../assets/icons/v1.2/moon.svg";
import useTheme from "../hooks/useTheme.js";

function ThemeSwitcher({ toggleTheme }) {
  const [theme] = useTheme();
  return (
    <ToggleButton
      className="toggle-button"
      type="button"
      title="Change Theme"
      value="check"
      onClick={e => toggleTheme(e)}
    >
      {theme === "dark" ? <SvgIcon component={MoonIcon} /> : <SvgIcon component={SunIcon} />}
    </ToggleButton>
  );
}

export default ThemeSwitcher;
