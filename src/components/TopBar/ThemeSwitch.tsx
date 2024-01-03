import { Box } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import { Icon } from "src/components/library";

interface IThemeSwitcherProps {
  theme: string;
  toggleTheme: (e: any) => void;
}

function ThemeSwitcher({ theme, toggleTheme }: IThemeSwitcherProps) {
  return (
    <Box marginLeft="5px">
      <ToggleButton
        sx={{ height: "39px" }}
        className="toggle-button"
        type="button"
        title={`Change Theme`}
        value="check"
        onClick={toggleTheme}
      >
        {theme === "dark" ? (
          <Icon name={"moon"} color={"primary"} style={{ fontSize: "17.5px" }} />
        ) : (
          <Icon name={"sun"} color={"primary"} style={{ fontSize: "17.5px" }} />
        )}
      </ToggleButton>
    </Box>
  );
}

export default ThemeSwitcher;
