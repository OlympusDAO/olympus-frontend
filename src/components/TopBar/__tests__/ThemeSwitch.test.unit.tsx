import { render } from "../../../testUtils";
import ThemeSwitch from "../ThemeSwitch";

describe("<ThemeSwitch/>", () => {
  it("should render component", () => {
    const { container } = render(<ThemeSwitch theme={"light"} toggleTheme={() => {}} />);
    expect(container).toMatchSnapshot();
  });
});
