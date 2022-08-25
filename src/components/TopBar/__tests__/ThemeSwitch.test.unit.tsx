import ThemeSwitch from "src/components/TopBar/ThemeSwitch";
import { render } from "src/testUtils";

describe("<ThemeSwitch/>", () => {
  it("should render component", () => {
    const { container } = render(<ThemeSwitch theme={"light"} toggleTheme={() => console.log("toggleTheme")} />);
    expect(container).toMatchSnapshot();
  });
});
