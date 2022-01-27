import { render } from "../../../testUtils";
import ThemeSwitch from "../ThemeSwitch";

describe("<ThemeSwitch/>", () => {
  it("should render component", () => {
    const { container } = render(<ThemeSwitch theme={"light"} toggleTheme={() => console.log("toggleTheme")} />);
    expect(container).toMatchSnapshot();
  });
});
