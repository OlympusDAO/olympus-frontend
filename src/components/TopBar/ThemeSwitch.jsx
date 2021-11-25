import ToggleButton from "@material-ui/lab/ToggleButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as SunIcon } from "../../assets/icons/sun.svg";
import { ReactComponent as MoonIcon } from "../../assets/icons/moon.svg";
import { t } from "@lingui/macro";
import useTheme from "src/hooks/useTheme";

function ThemeSwitcher() {
  const [theme, toggleTheme] = useTheme();
  return (
    <ToggleButton
      className="toggle-button"
      type="button"
      title={t`Change Theme`}
      value="check"
      onClick={e => toggleTheme(e)}
    >
      {theme === "dark" ? (
        <SvgIcon component={MoonIcon} color="primary" />
      ) : (
        <SvgIcon component={SunIcon} color="primary" />
      )}
    </ToggleButton>
  );
}

export default ThemeSwitcher;
