import ToggleButton from "@material-ui/lab/ToggleButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as SunIcon } from "../../assets/icons/sun.svg";
import { ReactComponent as MoonIcon } from "../../assets/icons/moon.svg";

interface IThemeSwitcherProps {
  readonly theme: string;
  readonly toggleTheme: (e: KeyboardEvent) => void;
}
function ThemeSwitcher({ theme, toggleTheme }: IThemeSwitcherProps) {
  return (
    <ToggleButton
      className="toggle-button"
      type="button"
      title="Change Theme"
      value="check"
      onClick={e => toggleTheme(e as unknown as KeyboardEvent)}
      // TS-REFACTOR-NOTE: casted as KeyboardEvent because
      // it is expected to be this via TopBar => App.tx => useTheme.ts
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
