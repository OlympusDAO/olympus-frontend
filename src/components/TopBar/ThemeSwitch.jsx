import { t } from "@lingui/macro";
import SvgIcon from "@material-ui/core/SvgIcon";
import ToggleButton from "@material-ui/lab/ToggleButton";

import { ReactComponent as MoonIcon } from "../../assets/icons/moon.svg";
import { ReactComponent as SunIcon } from "../../assets/icons/sun.svg";

function ThemeSwitcher({ theme, toggleTheme }) {
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
