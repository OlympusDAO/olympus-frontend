import ToggleButton from "@material-ui/lab/ToggleButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as SunIcon } from "../../assets/icons/sun.svg";
import { ReactComponent as MoonIcon } from "../../assets/icons/moon.svg";
import { t } from "@lingui/macro";

export interface ToggleThemeCallback {
  (e: any): void;
}

type ThemeSwitcherProps = {
  theme: string;
  toggleTheme: ToggleThemeCallback;
};

function ThemeSwitcher({ theme, toggleTheme }: ThemeSwitcherProps) {
  return (
    <ToggleButton
      className="toggle-button"
      type="button"
      title={t`Change Theme`}
      value="check"
      onClick={e => toggleTheme(e)}
    >
      <SvgIcon component={theme === "dark" ? MoonIcon : SunIcon} color="primary" />
    </ToggleButton>
  );
}

export default ThemeSwitcher;
